import { describe, it, beforeEach, expect, vi, Mock } from "vitest"
import { NostoCampaign } from "@/components/NostoCampaign/NostoCampaign"
import { mockNostoRecs } from "../mockNostoRecs"

describe("NostoCampaign", () => {
  let campaign: NostoCampaign

  beforeEach(() => {
    document.body.innerHTML = ""
  })

  function mount(attrs: Record<string, string> = {}) {
    campaign = new NostoCampaign()
    Object.assign(campaign, attrs)
    return campaign
  }

  it("should be defined as a custom element", () => {
    expect(customElements.get("nosto-campaign")).toBeDefined()
  })

  it("should throw in connectedCallback if placement is missing", async () => {
    campaign = new NostoCampaign()
    await expect(campaign.connectedCallback()).rejects.toThrow(
      "placement or id attribute is required for NostoCampaign"
    )
  })

  it("should throw in connectedCallback if template is missing", async () => {
    mockNostoRecs({ "123": {} })

    campaign = new NostoCampaign()
    campaign.placement = "123"
    campaign.template = "my-template"
    await expect(campaign.connectedCallback()).rejects.toThrow('Template with id "my-template" not found.')
  })

  it("should mark element for client injection", async () => {
    const htmlContent = "recommended content"
    const { mockBuilder } = mockNostoRecs(
      { "789": { html: htmlContent } },
      {
        placements: {
          injectCampaigns: vi.fn(async (campaigns, targets) => {
            const target = targets["789"]
            target.innerHTML = campaigns["789"]
          })
        }
      }
    )

    campaign = mount({
      placement: "789",
      productId: "123",
      variantId: "var1"
    })

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

    const { mockBuilder } = mockNostoRecs(
      {
        "789": {
          title: "Recommended for you",
          products: [
            { id: "123", title: "Test Product A" },
            { id: "456", title: "Test Product B" }
          ]
        }
      },
      {
        placements: {
          injectCampaigns: vi.fn(async (campaigns, targets) => {
            const target = targets["789"]
            target.innerHTML = campaigns["789"]
          })
        }
      }
    )

    const campaign = new NostoCampaign()
    campaign.placement = "789"
    campaign.productId = "123"
    campaign.template = templateId
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

    campaign = mount({
      placement: "789",
      productId: "123",
      variantId: "var1",
      template: "inline-template"
    })

    campaign.setAttribute("init", "false")
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    expect(mockBuilder.load).not.toHaveBeenCalled()
    expect(injectCampaigns).not.toHaveBeenCalled()
    expect(campaign.hasAttribute("loading")).toBe(false)
  })

  it("should load campaign lazily when lazy attribute is set", async () => {
    const htmlContent = "lazy loaded content"
    const { mockBuilder } = mockNostoRecs(
      { "456": htmlContent },
      {
        placements: {
          injectCampaigns: vi.fn(async (campaigns, targets) => {
            const target = targets["456"]
            target.innerHTML = campaigns["456"]
          })
        }
      }
    )

    // Mock IntersectionObserver
    const mockObserver = {
      observe: vi.fn(),
      disconnect: vi.fn()
    }
    // @ts-expect-error partial mock assignment
    global.IntersectionObserver = vi.fn(() => mockObserver)

    campaign = mount({
      placement: "456",
      productId: "123"
    })
    campaign.lazy = true

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

    campaign = mount({
      placement: "456",
      productId: "123"
    })
    campaign.lazy = true

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

    campaign = mount({
      placement: "456",
      productId: "123",
      init: "false"
    })
    campaign.lazy = true

    await campaign.connectedCallback()

    // Should not create observer or load when init="false"
    expect(mockObserver.observe).not.toHaveBeenCalled()
    expect(mockBuilder.load).not.toHaveBeenCalled()
  })
})
