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
    await expect(campaign.connectedCallback()).rejects.toThrow("Property placement is required.")
  })

  it("should mark element for client injection", async () => {
    const htmlContent = "<div>recommended content</div>"
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
      variantId: "var1",
      template: "inline-template"
    })

    const script = document.createElement("script")
    script.id = "inline-template"
    script.type = "text/x-liquid-template"
    script.textContent = "{{ html }}"
    document.body.appendChild(script)

    await campaign.connectedCallback()

    expect(mockBuilder.load).toHaveBeenCalledWith({ skipEvents: false, skipPageViews: true })
    expect(campaign.innerHTML).toBe(htmlContent)
  })

  it("should render campaign-level templated HTML if template is provided", async () => {
    const templateId = "campaign-template"
    const script = document.createElement("script")
    script.id = templateId
    script.type = "text/x-liquid-template"
    script.textContent = `
    <section>
      {% for product in products %}
        <div class="product">{{ product.title }}</div>
      {% endfor %}
    </section>
  `
    document.body.appendChild(script)

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
