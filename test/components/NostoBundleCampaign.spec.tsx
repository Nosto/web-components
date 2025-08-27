/** @jsx createElement */
import { describe, it, expect, afterEach } from "vitest"
import { NostoBundleCampaign } from "@/components/NostoBundleCampaign/NostoBundleCampaign"
import { mockNostoRecs } from "../mockNostoRecs"
import { addHandlers } from "../msw.setup"
import { createElement } from "../utils/jsx"
import { http, HttpResponse } from "msw"

describe("NostoBundleCampaign", () => {
  let campaign: NostoBundleCampaign

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
    expect(customElements.get("nosto-bundle-campaign")).toBeDefined()
  })

  it("should render campaign in bundle mode", async () => {
    const mockResult = {
      products: [{ name: "Product 1", price: "$10", url: "/products/product-1" }]
    }
    mockNostoRecs({ "test-placement": mockResult })

    campaign = (<nosto-bundle-campaign placement="test-placement" />) as NostoBundleCampaign
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    expect(campaign.querySelector(".nosto-bundle")).toBeTruthy()
    expect(campaign.querySelector(".nosto-grid")).toBeFalsy()
  })

  it("should use NostoDynamicCard in bundle mode when card attribute is provided", async () => {
    addProductHandlers()
    const mockResult = {
      products: [{ name: "Product 1", price: "$10", handle: "test-handle" }]
    }
    mockNostoRecs({ "test-placement": mockResult })

    campaign = (<nosto-bundle-campaign placement="test-placement" card="product-card" />) as NostoBundleCampaign
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    const dynamicCard = campaign.querySelector("nosto-dynamic-card")
    expect(dynamicCard).toBeTruthy()
    expect(dynamicCard?.getAttribute("handle")).toBe("test-handle")
    expect(dynamicCard?.getAttribute("template")).toBe("product-card")
    expect(campaign.querySelector(".nosto-bundle")).toBeTruthy()
  })
})
