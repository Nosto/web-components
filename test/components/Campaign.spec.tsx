/** @jsx createElement */
import { describe, it, expect, vi, Mock, beforeEach, afterEach } from "vitest"
import { Campaign } from "@/components/Campaign/Campaign"
import { mockNostoRecs } from "../mockNostoRecs"
import { createElement } from "../utils/jsx"

// Extend global type for nostojs
declare global {
  // eslint-disable-next-line no-var
  var nostojs: unknown
}

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
    let mockListen: Mock
    let originalNostojs: unknown

    beforeEach(() => {
      mockListen = vi.fn()
      // Store original function
      originalNostojs = global.nostojs
    })

    afterEach(() => {
      // Restore original function
      global.nostojs = originalNostojs as typeof global.nostojs
      vi.clearAllMocks()
    })

    it("should register cart update listener when cart-synced is true", async () => {
      // Set up our mock after calling mockNostoRecs
      const { mockBuilder } = mockNostoRecs({ "789": "content" })

      // Override the mock to add listen method
      global.nostojs = vi.fn((callback: (api: unknown) => void) => {
        const api = {
          createRecommendationRequest: () => mockBuilder,
          listen: mockListen,
          attributeProductClicksInCampaign: vi.fn(),
          placements: {
            injectCampaigns: vi.fn()
          }
        }
        callback(api)
        return Promise.resolve(api)
      })

      campaign = (<nosto-campaign placement="789" cart-synced={true} />) as Campaign

      await campaign.connectedCallback()

      expect(mockListen).toHaveBeenCalledWith("cartUpdated", expect.any(Function))
      expect(campaign.cartUpdateListener).toBeDefined()
    })

    it("should not register cart update listener when cart-synced is false or not set", async () => {
      const { mockBuilder } = mockNostoRecs({ "789": "content" })

      // Override the mock to add listen method
      global.nostojs = vi.fn((callback: (api: unknown) => void) => {
        const api = {
          createRecommendationRequest: () => mockBuilder,
          listen: mockListen,
          attributeProductClicksInCampaign: vi.fn(),
          placements: {
            injectCampaigns: vi.fn()
          }
        }
        callback(api)
        return Promise.resolve(api)
      })

      campaign = (<nosto-campaign placement="789" />) as Campaign

      await campaign.connectedCallback()

      expect(mockListen).not.toHaveBeenCalled()
      expect(campaign.cartUpdateListener).toBeUndefined()
    })

    it("should reload campaign when cart update event is triggered", async () => {
      const { mockBuilder } = mockNostoRecs({ "789": "original content" })

      // Override the mock to add listen method
      global.nostojs = vi.fn((callback: (api: unknown) => void) => {
        const api = {
          createRecommendationRequest: () => mockBuilder,
          listen: mockListen,
          attributeProductClicksInCampaign: vi.fn(),
          placements: {
            injectCampaigns: vi.fn()
          }
        }
        callback(api)
        return Promise.resolve(api)
      })

      // Create campaign with cart-synced
      campaign = (<nosto-campaign placement="789" cart-synced={true} />) as Campaign

      await campaign.connectedCallback()

      // Verify listener was registered
      expect(mockListen).toHaveBeenCalledWith("cartUpdated", expect.any(Function))

      // Get the registered callback
      const cartUpdateCallback = mockListen.mock.calls[0][1]

      // Mock the load method on the campaign
      campaign.load = vi.fn().mockResolvedValue(undefined)

      // Simulate cart update
      await cartUpdateCallback()

      // Verify the campaign was reloaded
      expect(campaign.load).toHaveBeenCalled()
    })

    it("should work with both cart-synced and lazy loading", async () => {
      const { mockBuilder } = mockNostoRecs({ "789": "content" })

      // Override the mock to add listen method
      global.nostojs = vi.fn((callback: (api: unknown) => void) => {
        const api = {
          createRecommendationRequest: () => mockBuilder,
          listen: mockListen,
          attributeProductClicksInCampaign: vi.fn(),
          placements: {
            injectCampaigns: vi.fn()
          }
        }
        callback(api)
        return Promise.resolve(api)
      })

      // Mock IntersectionObserver
      const mockObserver = {
        observe: vi.fn(),
        disconnect: vi.fn()
      }
      // @ts-expect-error partial mock assignment
      global.IntersectionObserver = vi.fn(() => mockObserver)

      campaign = (<nosto-campaign placement="789" cart-synced={true} lazy={true} />) as Campaign

      await campaign.connectedCallback()

      // Should register cart listener and setup lazy loading
      expect(mockListen).toHaveBeenCalledWith("cartUpdated", expect.any(Function))
      expect(mockObserver.observe).toHaveBeenCalledWith(campaign)
    })

    it("should work with cart-synced and init=false", async () => {
      const { mockBuilder } = mockNostoRecs({ "789": "content" })

      // Override the mock to add listen method
      global.nostojs = vi.fn((callback: (api: unknown) => void) => {
        const api = {
          createRecommendationRequest: () => mockBuilder,
          listen: mockListen,
          attributeProductClicksInCampaign: vi.fn(),
          placements: {
            injectCampaigns: vi.fn()
          }
        }
        callback(api)
        return Promise.resolve(api)
      })

      campaign = (<nosto-campaign placement="789" cart-synced={true} init="false" />) as Campaign

      await campaign.connectedCallback()

      // Should register cart listener but not auto-load
      expect(mockListen).toHaveBeenCalledWith("cartUpdated", expect.any(Function))
      expect(mockBuilder.load).not.toHaveBeenCalled()
    })

    it("should clean up listener reference on disconnect", () => {
      campaign = (<nosto-campaign placement="789" cart-synced={true} />) as Campaign

      // Set up the listener reference
      campaign.cartUpdateListener = vi.fn()

      campaign.disconnectedCallback()

      expect(campaign.cartUpdateListener).toBeUndefined()
    })

    it("should handle disconnectedCallback safely when no listener is set", () => {
      campaign = (<nosto-campaign placement="789" />) as Campaign

      // Should not throw an error
      expect(() => campaign.disconnectedCallback()).not.toThrow()
    })
  })
})
