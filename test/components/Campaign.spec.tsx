/** @jsx createElement */
import { describe, it, expect, vi, Mock } from "vitest"
import { Campaign } from "@/components/Campaign/Campaign"
import { mockNostoRecs } from "../mockNostoRecs"
import { createElement } from "../utils/jsx"

describe("Campaign", () => {
  let campaign: Campaign

  it("should be defined as a custom element", () => {
    expect(customElements.get("nosto-campaign")).toBeDefined()
  })

  it("should throw in connectedCallback if placement is missing", async () => {
    campaign = (<nosto-campaign />) as Campaign
    await expect(campaign.connectedCallback()).rejects.toThrow("placement or id attribute is required for Campaign")
  })

  it("should throw in connectedCallback if template is missing", async () => {
    mockNostoRecs({ "123": {} })

    campaign = (<nosto-campaign placement="123" template="my-template" />) as Campaign
    await expect(campaign.connectedCallback()).rejects.toThrow('Template with id "my-template" not found.')
  })

  it("should mark element for client injection", async () => {
    const htmlContent = "recommended content"
    const { mockBuilder } = mockNostoRecs({ "789": { html: htmlContent } })

    campaign = (<nosto-campaign placement="789" productId="123" variantId="var1" />) as Campaign

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

    const campaign = (<nosto-campaign placement="789" productId="123" template={templateId} />) as Campaign
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

    campaign = (
      <nosto-campaign placement="789" productId="123" variantId="var1" template="inline-template" />
    ) as Campaign

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

    campaign = (<nosto-campaign placement="456" productId="123" lazy={true} />) as Campaign

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

    campaign = (<nosto-campaign placement="456" productId="123" lazy={true} />) as Campaign

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

    campaign = (<nosto-campaign placement="456" productId="123" init="false" lazy={true} />) as Campaign

    await campaign.connectedCallback()

    // Should not create observer or load when init="false"
    expect(mockObserver.observe).not.toHaveBeenCalled()
    expect(mockBuilder.load).not.toHaveBeenCalled()
  })

  describe("cart-synced functionality", () => {
    it("should set up cart listener when cart-synced is true", async () => {
      const { mockBuilder } = mockNostoRecs({ "789": "cart synced content" })

      campaign = (<nosto-campaign placement="789" cartSynced={true} />) as Campaign

      await campaign.connectedCallback()

      // Should load the campaign initially
      expect(mockBuilder.load).toHaveBeenCalled()
      // cartSynced property should be set
      expect(campaign.cartSynced).toBe(true)
    })

    it("should not set cart-synced when attribute is not present", async () => {
      const { mockBuilder } = mockNostoRecs({ "789": "normal content" })

      campaign = (<nosto-campaign placement="789" />) as Campaign

      await campaign.connectedCallback()

      expect(mockBuilder.load).toHaveBeenCalled()
      expect(campaign.cartSynced).toBe(false) // boolean attributes default to false when not present
    })

    it("should set cart-synced to true when attribute is present", async () => {
      const { mockBuilder } = mockNostoRecs({ "789": "cart synced content" })

      campaign = document.createElement("nosto-campaign") as Campaign
      campaign.setAttribute("placement", "789")
      campaign.setAttribute("cart-synced", "") // HTML boolean attribute style

      await campaign.connectedCallback()

      expect(mockBuilder.load).toHaveBeenCalled()
      expect(campaign.cartSynced).toBe(true)
    })

    it("should work with cart-synced and init=false", async () => {
      const { mockBuilder } = mockNostoRecs({ "789": "content" })

      campaign = (<nosto-campaign placement="789" cartSynced={true} init="false" />) as Campaign

      await campaign.connectedCallback()

      // Should set cart-synced but not load initially due to init="false"
      expect(campaign.cartSynced).toBe(true)
      expect(mockBuilder.load).not.toHaveBeenCalled()
    })

    it("should work with cart-synced and lazy loading", async () => {
      const { mockBuilder } = mockNostoRecs({ "789": "lazy cart synced content" })

      // Mock IntersectionObserver
      const mockObserver = {
        observe: vi.fn(),
        disconnect: vi.fn()
      }
      // @ts-expect-error partial mock assignment
      global.IntersectionObserver = vi.fn(() => mockObserver)

      campaign = (<nosto-campaign placement="789" cartSynced={true} lazy={true} />) as Campaign

      await campaign.connectedCallback()

      // Should set up intersection observer and cart sync
      expect(campaign.cartSynced).toBe(true)
      expect(mockObserver.observe).toHaveBeenCalledWith(campaign)
      expect(mockBuilder.load).not.toHaveBeenCalled() // Should not load immediately due to lazy

      // Simulate intersection
      const observerCallback = (global.IntersectionObserver as Mock).mock.calls[0][0]
      await observerCallback([{ isIntersecting: true }])

      expect(mockBuilder.load).toHaveBeenCalled()
      expect(mockObserver.disconnect).toHaveBeenCalled()
    })

    it("should have load method available for manual triggering", async () => {
      const { mockBuilder } = mockNostoRecs({ "789": "content" })

      campaign = (<nosto-campaign placement="789" cartSynced={true} init="false" />) as Campaign

      await campaign.connectedCallback()

      // Should not load initially
      expect(mockBuilder.load).not.toHaveBeenCalled()

      // Manual load should work
      await campaign.load()
      expect(mockBuilder.load).toHaveBeenCalled()
    })
  })

  it("should clean up cart listener on disconnect", () => {
    campaign = (<nosto-campaign placement="789" cartSynced={true} />) as Campaign

    // @ts-expect-error accessing private property for testing
    campaign.cartUpdateListener = vi.fn()

    campaign.disconnectedCallback()

    // @ts-expect-error accessing private property for testing
    expect(campaign.cartUpdateListener).toBeUndefined()
  })
})
