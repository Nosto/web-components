import { describe, it, beforeEach, expect, vi, Mock } from "vitest"
import { NostoCampaign } from "@/components/NostoCampaign/NostoCampaign"
import { mockNostoRecs } from "../mockNostoRecs"
import { createElement } from "../utils/jsx"

describe("NostoCampaign", () => {
  let campaign: NostoCampaign

  beforeEach(() => {
    document.body.innerHTML = ""
  })

  it("should be defined as a custom element", () => {
    expect(customElements.get("nosto-campaign")).toBeDefined()
  })

  it("should throw in connectedCallback if placement is missing", async () => {
    campaign = <nosto-campaign /> as NostoCampaign
    await expect(campaign.connectedCallback()).rejects.toThrow(
      "placement or id attribute is required for NostoCampaign"
    )
  })

  it("should throw in connectedCallback if template is missing", async () => {
    mockNostoRecs({ "123": {} })

    campaign = <nosto-campaign placement="123" template="my-template" /> as NostoCampaign
    await expect(campaign.connectedCallback()).rejects.toThrow('Template with id "my-template" not found.')
  })

  it("should mark element for client injection", async () => {
    const htmlContent = "recommended content"
    const { mockBuilder } = mockNostoRecs({ "789": { html: htmlContent } })

    campaign = <nosto-campaign placement="789" productId="123" variantId="var1" /> as NostoCampaign

    const template = document.createElement("template")
    template.innerHTML = "<span>{{ html }}</span>"
    campaign.appendChild(template)

    await campaign.connectedCallback()

    expect(mockBuilder.load).toHaveBeenCalledWith()
    expect(campaign.innerHTML).toBe(`<span>recommended content</span>`)
  })

  it("should render campaign-level templated HTML if template is provided", async () => {
    const templateId = "campaign-template"
    const template = document.createElement("template")
    template.id = templateId
    template.innerHTML = `
    <section>
      <div class="product" v-for="product in products">{{ product.title }}</div>
    </section>
  `
    document.body.appendChild(template)

    const { mockBuilder } = mockNostoRecs({
      "789": {
        title: "Recommended for you",
        products: [
          { id: "123", title: "Test Product A" },
          { id: "456", title: "Test Product B" }
        ]
      }
    })

    const campaign = <nosto-campaign placement="789" productId="123" template={templateId} /> as NostoCampaign
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    expect(campaign.innerHTML).toContain("Test Product A")
    expect(campaign.innerHTML).toContain("Test Product B")
    expect(mockBuilder.load).toHaveBeenCalledWith()

    // support for re-rendering
    const markup = campaign.innerHTML
    await campaign.connectedCallback()
    expect(campaign.innerHTML).toBe(markup)
  })

  it('should not auto-load campaign if init="false"', async () => {
    const { mockBuilder, injectCampaigns } = mockNostoRecs({ "789": {} })

    campaign = <nosto-campaign placement="789" productId="123" variantId="var1" template="inline-template" /> as NostoCampaign

    campaign.setAttribute("init", "false")
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    expect(mockBuilder.load).not.toHaveBeenCalled()
    expect(injectCampaigns).not.toHaveBeenCalled()
    expect(campaign.hasAttribute("loading")).toBe(false)
  })

  it("should load campaign lazily when lazy attribute is set", async () => {
    const htmlContent = "lazy loaded content"
    const { mockBuilder } = mockNostoRecs({ "456": htmlContent })

    // Mock IntersectionObserver
    const mockObserver = {
      observe: vi.fn(),
      disconnect: vi.fn()
    }
    // @ts-expect-error partial mock assignment
    global.IntersectionObserver = vi.fn(() => mockObserver)

    campaign = <nosto-campaign placement="456" productId="123" lazy="true" /> as NostoCampaign

    await campaign.connectedCallback()

    // Should not load immediately
    expect(mockBuilder.load).not.toHaveBeenCalled()
    expect(mockObserver.observe).toHaveBeenCalledWith(campaign)

    // Simulate intersection - get the callback function and call it
    const observerCallback = (global.IntersectionObserver as Mock).mock.calls[0][0]
    await observerCallback([{ isIntersecting: true }])

    expect(mockBuilder.load).toHaveBeenCalled()
    expect(mockObserver.disconnect).toHaveBeenCalled()
    expect(campaign.innerHTML).toBe(htmlContent)
  })

  it("should not load campaign lazily when intersection is false", async () => {
    const { mockBuilder } = mockNostoRecs({ "456": {} })

    // Mock IntersectionObserver
    const mockObserver = {
      observe: vi.fn(),
      disconnect: vi.fn()
    }
    // @ts-expect-error partial mock assignment
    global.IntersectionObserver = vi.fn(() => mockObserver)

    campaign = <nosto-campaign placement="456" productId="123" lazy="true" /> as NostoCampaign

    await campaign.connectedCallback()

    // Simulate no intersection - get the callback function and call it
    const observerCallback = (global.IntersectionObserver as Mock).mock.calls[0][0]
    await observerCallback([{ isIntersecting: false }])

    expect(mockBuilder.load).not.toHaveBeenCalled()
    expect(mockObserver.disconnect).not.toHaveBeenCalled()
  })

  it('should respect init="false" even when lazy is set', async () => {
    const { mockBuilder } = mockNostoRecs({ "456": {} })

    // Mock IntersectionObserver
    const mockObserver = {
      observe: vi.fn(),
      disconnect: vi.fn()
    }
    // @ts-expect-error partial mock assignment
    global.IntersectionObserver = vi.fn(() => mockObserver)

    campaign = <nosto-campaign placement="456" productId="123" init="false" lazy="true" /> as NostoCampaign

    await campaign.connectedCallback()

    // Should not create observer or load when init="false"
    expect(mockObserver.observe).not.toHaveBeenCalled()
    expect(mockBuilder.load).not.toHaveBeenCalled()
  })
})
