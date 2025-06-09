import { describe, it, beforeEach, expect, vi } from "vitest"
import { mockNostojs } from "@nosto/nosto-js/testing"
import "@/components/NostoCampaign"
import { NostoCampaign } from "@/components/NostoCampaign"
import { RequestBuilder } from "@nosto/nosto-js/client"

describe("NostoCampaign", () => {
  let campaign: NostoCampaign

  beforeEach(() => {
    document.body.innerHTML = ""
  })

  function mount(attrs: Record<string, string> = {}) {
    campaign = new NostoCampaign()
    Object.assign(campaign, attrs)
    document.body.appendChild(campaign)
    return campaign
  }

  it("should be defined as a custom element", () => {
    expect(customElements.get("nosto-campaign")).toBeDefined()
  })

  it("should throw in connectedCallback if placement is missing", async () => {
    campaign = new NostoCampaign()
    await expect(campaign.connectedCallback()).rejects.toThrow("Property placement is required.")
  })

  it("should call loadCampaign() with placement, product, and variant", async () => {
    campaign = mount({
      placement: "789",
      product: "123",
      variant: "var1"
    })

    const spy = vi.spyOn(campaign, "loadCampaign").mockImplementation(async () => Promise.resolve())

    await campaign.connectedCallback()

    expect(campaign.placement).toBe("789")
    expect(campaign.product).toBe("123")
    expect(campaign.variant).toBe("var1")
    expect(spy).toHaveBeenCalled()

    spy.mockRestore()
  })

  it("should inject string HTML from recommendation result", async () => {
    const mockBuilder = {
      disableCampaignInjection: () => mockBuilder,
      setElements: () => mockBuilder,
      setResponseMode: () => mockBuilder,
      setProducts: () => mockBuilder,
      load: () =>
        Promise.resolve({
          recommendations: {
            "test-placement": "<div>Mocked HTML</div>"
          }
        })
    } as unknown as RequestBuilder

    mockNostojs({
      createRecommendationRequest: () => mockBuilder
    })

    campaign = mount({
      placement: "test-placement",
      product: "p1",
      variant: "v1"
    })

    await campaign.connectedCallback()
    expect(campaign.innerHTML).toContain("Mocked HTML")
  })

  it("should inject HTML from recommendation result object", async () => {
    const mockBuilder = {
      disableCampaignInjection: () => mockBuilder,
      setElements: () => mockBuilder,
      setResponseMode: () => mockBuilder,
      setProducts: () => mockBuilder,
      load: () =>
        Promise.resolve({
          recommendations: {
            "test-placement": {
              html: "<div>Mocked HTML from object</div>"
            }
          }
        })
    } as unknown as RequestBuilder

    mockNostojs({
      createRecommendationRequest: () => mockBuilder
    })

    campaign = mount({
      placement: "test-placement",
      product: "p2"
    })

    await campaign.connectedCallback()
    expect(campaign.innerHTML).toContain("Mocked HTML from object")
  })
})
