/** @jsx createElement */
import { describe, it, expect, vi, Mock, beforeEach, afterEach } from "vitest"
import { Campaign } from "@/components/Campaign/Campaign"
import { mockNostojs, restoreNostojs } from "@nosto/nosto-js/testing"
import { mockNostoRecs } from "../../mockNostoRecs"
import { createElement } from "../../utils/jsx"
import { createMockIntersectionObserver } from "../../utils/mockIntersectionObserver"

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

  it("should remove loading attribute even when error occurs", async () => {
    mockNostoRecs({ "123": {} })

    campaign = (<nosto-campaign placement="123" template="missing-template" />) as Campaign

    // The component should throw on error, but loading state should be cleaned up
    await expect(campaign.connectedCallback()).rejects.toThrow()
    expect(campaign.hasAttribute("loading")).toBe(false)
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
    const mockObserve = vi.fn()
    const mockDisconnect = vi.fn()
    let observerCallback: IntersectionObserverCallback | null = null

    const MockIntersectionObserver = createMockIntersectionObserver({
      observe: mockObserve,
      disconnect: mockDisconnect,
      onCallback: callback => {
        observerCallback = callback
      }
    })

    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver)

    campaign = (<nosto-campaign placement="456" productId="123" lazy={true} />) as Campaign

    await campaign.connectedCallback()

    // Should not load immediately
    expect(mockBuilder.load).not.toHaveBeenCalled()
    expect(mockObserve).toHaveBeenCalledWith(campaign)

    // Simulate intersection
    await observerCallback!([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)

    expect(mockBuilder.load).toHaveBeenCalled()
    expect(mockDisconnect).toHaveBeenCalled()
    expect(campaign.innerHTML).toBe(htmlContent)

    vi.unstubAllGlobals()
  })

  it("should not load campaign lazily when intersection is false", async () => {
    const { mockBuilder } = mockNostoRecs({ "456": {} })

    // Mock IntersectionObserver
    const mockObserve = vi.fn()
    const mockDisconnect = vi.fn()
    let observerCallback: IntersectionObserverCallback | null = null

    const MockIntersectionObserver = createMockIntersectionObserver({
      observe: mockObserve,
      disconnect: mockDisconnect,
      onCallback: callback => {
        observerCallback = callback
      }
    })

    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver)

    campaign = (<nosto-campaign placement="456" productId="123" lazy={true} />) as Campaign

    await campaign.connectedCallback()

    // Simulate no intersection
    await observerCallback!([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver)

    expect(mockBuilder.load).not.toHaveBeenCalled()
    expect(mockDisconnect).not.toHaveBeenCalled()

    vi.unstubAllGlobals()
  })

  it('should respect init="false" even when lazy is set', async () => {
    const { mockBuilder } = mockNostoRecs({ "456": {} })

    // Mock IntersectionObserver
    const mockObserve = vi.fn()
    const mockDisconnect = vi.fn()

    const MockIntersectionObserver = createMockIntersectionObserver({
      observe: mockObserve,
      disconnect: mockDisconnect
    })

    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver)

    campaign = (<nosto-campaign placement="456" productId="123" init="false" lazy={true} />) as Campaign

    await campaign.connectedCallback()

    // Should not create observer or load when init="false"
    expect(mockObserve).not.toHaveBeenCalled()
    expect(mockBuilder.load).not.toHaveBeenCalled()

    vi.unstubAllGlobals()
  })

  describe("cart-synced functionality", () => {
    let mockListen: Mock
    let mockUnlisten: Mock

    beforeEach(() => {
      mockListen = vi.fn()
      mockUnlisten = vi.fn()
    })

    afterEach(() => {
      restoreNostojs()
      vi.clearAllMocks()
    })

    it("should register cart update listener when cart-synced is true", async () => {
      const { mockBuilder } = mockNostoRecs({ "789": "content" })

      // Use mockNostojs to add listen method
      mockNostojs({
        createRecommendationRequest: () => mockBuilder,
        listen: mockListen,
        unlisten: mockUnlisten,
        attributeProductClicksInCampaign: vi.fn(),
        placements: {
          injectCampaigns: vi.fn()
        }
      })

      campaign = (<nosto-campaign placement="789" cart-synced />) as Campaign

      await campaign.connectedCallback()

      expect(mockListen).toHaveBeenCalledWith("cartupdated", expect.any(Function))
    })

    it("should reload campaign when cart update event is triggered", async () => {
      const { mockBuilder } = mockNostoRecs({ "789": "original content" })

      // Use mockNostojs to add listen method
      mockNostojs({
        createRecommendationRequest: () => mockBuilder,
        listen: mockListen,
        unlisten: mockUnlisten,
        attributeProductClicksInCampaign: vi.fn(),
        placements: {
          injectCampaigns: vi.fn()
        }
      })

      Campaign.prototype.load = vi.fn().mockResolvedValue(undefined)

      // Create campaign with cart-synced
      campaign = (<nosto-campaign placement="789" cart-synced={true} />) as Campaign

      await campaign.connectedCallback()

      // Verify listener was registered
      expect(mockListen).toHaveBeenCalledWith("cartupdated", expect.any(Function))

      // Get the registered callback
      const cartUpdateCallback = mockListen.mock.calls[0][1]

      // Simulate cart update
      await cartUpdateCallback()

      // Verify the campaign was reloaded
      expect(campaign.load).toHaveBeenCalled()

      await campaign.disconnectedCallback()

      // Verify unlisten was called on disconnect
      expect(mockUnlisten).toHaveBeenCalledWith("cartupdated", expect.any(Function))
    })
  })

  describe("nav-synced functionality", () => {
    let mockNavigation: {
      addEventListener: Mock
      removeEventListener: Mock
    }

    beforeEach(() => {
      // Mock Navigation API
      mockNavigation = {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }
      // @ts-expect-error partial mock assignment
      global.navigation = mockNavigation
    })

    afterEach(() => {
      // @ts-expect-error cleanup
      delete global.navigation
      restoreNostojs()
      vi.clearAllMocks()
    })

    it("should register navigation listener when nav-synced is true", async () => {
      mockNostoRecs({ "789": "content" })

      campaign = (<nosto-campaign placement="789" nav-synced />) as Campaign

      await campaign.connectedCallback()

      expect(mockNavigation.addEventListener).toHaveBeenCalledWith("navigatesuccess", expect.any(Function))
    })

    it("should not register navigation listener when Navigation API is not supported", async () => {
      // @ts-expect-error cleanup
      delete global.navigation

      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

      mockNostoRecs({ "789": "content" })

      campaign = (<nosto-campaign placement="789" nav-synced />) as Campaign

      await campaign.connectedCallback()

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Navigation API is not supported in this browser. The nav-synced feature will not work."
      )

      consoleWarnSpy.mockRestore()
    })

    it("should reload campaign when navigation success event is triggered", async () => {
      mockNostoRecs({ "789": "original content" })

      Campaign.prototype.load = vi.fn().mockResolvedValue(undefined)

      campaign = (<nosto-campaign placement="789" nav-synced={true} />) as Campaign

      await campaign.connectedCallback()

      expect(mockNavigation.addEventListener).toHaveBeenCalledWith("navigatesuccess", expect.any(Function))

      const navigationCallback = mockNavigation.addEventListener.mock.calls[0][1]

      await navigationCallback()

      expect(campaign.load).toHaveBeenCalled()

      await campaign.disconnectedCallback()

      expect(mockNavigation.removeEventListener).toHaveBeenCalledWith("navigatesuccess", expect.any(Function))
    })
  })
})
