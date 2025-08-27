/** @jsx createElement */
import { describe, it, expect, afterEach } from "vitest"
import { NostoCarouselCampaign } from "@/components/NostoCarouselCampaign/NostoCarouselCampaign"
import { mockNostoRecs } from "../mockNostoRecs"
import { addHandlers } from "../msw.setup"
import { createElement } from "../utils/jsx"
import { http, HttpResponse } from "msw"

describe("NostoCarouselCampaign", () => {
  let campaign: NostoCarouselCampaign

  function addProductHandlers() {
    addHandlers(
      http.get("/products/:handle", ({ params }) => {
        const handle = params.handle as string
        return HttpResponse.text(`<div class="product-card">${handle}</div>`, { status: 200 })
      })
    )
  }

  afterEach(() => {
    document.body.innerHTML = ""
    campaign?.remove?.()
  })

  it("should be defined as a custom element", () => {
    expect(customElements.get("nosto-carousel-campaign")).toBeDefined()
  })

  it("should render campaign in carousel mode with Swiper structure", async () => {
    const mockResult = {
      products: [{ name: "Product 1", price: "$10", url: "/products/product-1" }]
    }
    mockNostoRecs({ "test-placement": mockResult })

    campaign = (<nosto-carousel-campaign placement="test-placement" />) as NostoCarouselCampaign
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    expect(campaign.querySelector("swiper-container.nosto-carousel")).toBeTruthy()
    expect(campaign.querySelector("swiper-slide")).toBeTruthy()
    expect(campaign.querySelector(".nosto-grid")).toBeFalsy()
  })

  it("should use NostoDynamicCard in carousel mode when card attribute is provided", async () => {
    addProductHandlers()
    const mockResult = {
      products: [{ name: "Product 1", price: "$10", handle: "test-handle" }]
    }
    mockNostoRecs({ "test-placement": mockResult })

    campaign = (<nosto-carousel-campaign placement="test-placement" card="product-card" />) as NostoCarouselCampaign
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    const dynamicCard = campaign.querySelector("nosto-dynamic-card")
    expect(dynamicCard).toBeTruthy()
    expect(dynamicCard?.getAttribute("handle")).toBe("test-handle")
    expect(dynamicCard?.getAttribute("template")).toBe("product-card")
    expect(campaign.querySelector("swiper-container.nosto-carousel")).toBeTruthy()
  })
})
