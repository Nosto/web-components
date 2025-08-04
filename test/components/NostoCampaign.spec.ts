import { describe, it, beforeEach, expect, vi } from "vitest"
import { mockNostojs } from "@nosto/nosto-js/testing"
import { NostoCampaign } from "@/components/NostoCampaign/NostoCampaign"
import { RequestBuilder } from "@nosto/nosto-js/client"

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

  function getMockBuilder(overrides: Partial<RequestBuilder> = {}): RequestBuilder {
    const base: Partial<RequestBuilder> = {
      disableCampaignInjection: () => base as RequestBuilder,
      setElements: () => base as RequestBuilder,
      setResponseMode: () => base as RequestBuilder,
      setProducts: () => base as RequestBuilder,
      ...overrides
    }
    return base as RequestBuilder
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
    const mockBuilder = getMockBuilder({
      load: vi.fn().mockResolvedValue({
        recommendations: {
          "123": {}
        }
      })
    })

    mockNostojs({
      createRecommendationRequest: () => mockBuilder
    })

    campaign = new NostoCampaign()
    campaign.placement = "123"
    campaign.template = "my-template"
    await expect(campaign.connectedCallback()).rejects.toThrow('Template with id "my-template" not found.')
  })

  it("should mark element for client injection", async () => {
    const htmlContent = "recommended content"
    const mockBuilder = getMockBuilder({
      load: vi.fn().mockResolvedValue({
        recommendations: {
          "789": { html: htmlContent }
        }
      })
    })

    mockNostojs({
      createRecommendationRequest: () => mockBuilder,
      placements: {
        injectCampaigns: vi.fn(async (campaigns, targets) => {
          const target = targets["789"]
          target.innerHTML = campaigns["789"]
        })
      },
      attributeProductClicksInCampaign: vi.fn()
    })

    campaign = mount({
      placement: "789",
      productId: "123",
      variantId: "var1"
    })

    const template = document.createElement("template")
    template.innerHTML = "<span>{{ html }}</span>"
    campaign.appendChild(template)

    await campaign.connectedCallback()

    expect(mockBuilder.load).toHaveBeenCalledWith({ skipEvents: false, skipPageViews: true })
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

    const mockBuilder = getMockBuilder({
      load: vi.fn().mockResolvedValue({
        recommendations: {
          "789": {
            title: "Recommended for you",
            products: [
              { id: "123", title: "Test Product A" },
              { id: "456", title: "Test Product B" }
            ]
          }
        }
      })
    })

    mockNostojs({
      createRecommendationRequest: () => mockBuilder,
      placements: {
        injectCampaigns: vi.fn(async (campaigns, targets) => {
          const target = targets["789"]
          target.innerHTML = campaigns["789"]
        })
      },
      attributeProductClicksInCampaign: vi.fn()
    })

    const campaign = new NostoCampaign()
    campaign.placement = "789"
    campaign.productId = "123"
    campaign.template = templateId
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    expect(campaign.innerHTML).toContain("Test Product A")
    expect(campaign.innerHTML).toContain("Test Product B")
    expect(mockBuilder.load).toHaveBeenCalledWith({ skipEvents: false, skipPageViews: true })

    // support for re-rendering
    const markup = campaign.innerHTML
    await campaign.connectedCallback()
    expect(campaign.innerHTML).toBe(markup)
  })

  it('should not auto-load campaign if init="false"', async () => {
    const mockBuilder = getMockBuilder({
      load: vi.fn()
    })

    const injectCampaigns = vi.fn()

    mockNostojs({
      createRecommendationRequest: () => mockBuilder,
      placements: {
        injectCampaigns
      }
    })

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
})
