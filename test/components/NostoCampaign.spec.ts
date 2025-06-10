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

  it("should be defined as a custom element", () => {
    expect(customElements.get("nosto-campaign")).toBeDefined()
  })

  it("should throw in connectedCallback if placement is missing", async () => {
    campaign = new NostoCampaign()
    await expect(campaign.connectedCallback()).rejects.toThrow("Property placement is required.")
  })

  it("should mark element for client injection", async () => {
    const htmlContent = "<div>recommended content</div>"
    const mockBuilder = {
      disableCampaignInjection: () => mockBuilder,
      setElements: () => mockBuilder,
      setResponseMode: () => mockBuilder,
      setProducts: () => mockBuilder,
      load: vi.fn().mockResolvedValue({
        recommendations: {
          "789": { html: htmlContent }
        }
      })
    } as unknown as RequestBuilder

    mockNostojs({
      createRecommendationRequest: () => mockBuilder
    })

    campaign = mount({
      placement: "789",
      product: "123",
      variant: "var1"
    })

    await campaign.connectedCallback()

    expect(campaign.classList.contains("nosto_element")).toBe(true)
    expect(campaign.id).toBe("789")
    expect(mockBuilder.load).toHaveBeenCalled()
    expect(campaign.innerHTML).toBe(htmlContent)
  })

  it("should render templated HTML for each product if template is provided", async () => {
    const templateId = "product-card-template"
    const script = document.createElement("script")
    script.id = templateId
    script.type = "text/x-liquid-template"
    script.textContent = `<div>{{ product.title }}</div>`
    document.body.appendChild(script)

    const mockBuilder = {
      disableCampaignInjection: () => mockBuilder,
      setElements: () => mockBuilder,
      setResponseMode: () => mockBuilder,
      setProducts: () => mockBuilder,
      load: vi.fn().mockResolvedValue({
        recommendations: {
          "789": {
            products: [
              { id: "123", title: "Test Product A" },
              { id: "456", title: "Test Product B" }
            ]
          }
        }
      })
    } as unknown as RequestBuilder

    mockNostojs({
      createRecommendationRequest: () => mockBuilder
    })

    const campaign = new NostoCampaign()
    campaign.placement = "789"
    campaign.product = "123"
    campaign.template = templateId
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    expect(campaign.innerHTML).toContain("Test Product A")
    expect(campaign.innerHTML).toContain("Test Product B")
    expect(mockBuilder.load).toHaveBeenCalled()
  })
})
