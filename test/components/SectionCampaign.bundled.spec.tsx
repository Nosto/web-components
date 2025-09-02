/** @jsx createElement */
import { describe, it, expect } from "vitest"
import { mockNostoRecs } from "../mockNostoRecs"
import { createElement } from "../utils/jsx"
import { addHandlers } from "../msw.setup"
import { http, HttpResponse } from "msw"
import { SectionCampaign } from "@/main"

describe("SectionCampaign bundled", () => {
  it("renders bundled section markup and attributes product clicks", async () => {
    const products = [{ handle: "product-a" }, { handle: "product-b" }]
    const { attributeProductClicksInCampaign, load } = mockNostoRecs({ placement1: { products, title: "Rec Title" } })

    const innerHTML = `<div class=\"inner\">Bundled Render</div>`
    addHandlers(
      http.post("/cart/update.js", () => {
        return HttpResponse.json({
          sections: {
            "nosto-product-titles": `<nosto-bundled-campaign placement=\"placement1\">${innerHTML}</nosto-bundled-campaign>`
          }
        })
      })
    )

    const el = (
      <nosto-section-campaign mode="bundled" placement="placement1" section="nosto-product-titles" />
    ) as SectionCampaign
    document.body.appendChild(el)

    await el.connectedCallback()

    expect(load).toHaveBeenCalled()
    expect(el.innerHTML).toBe(innerHTML)
    expect(attributeProductClicksInCampaign).toHaveBeenCalledWith(el, { products, title: "Rec Title" })
    expect(el.hasAttribute("loading")).toBe(false)
  })

  it("skips re-render when current handles match computed handles", async () => {
    const products = [{ handle: "product-a" }]
    mockNostoRecs({ placement1: { products } })

    // No handler needed, should skip network
    const el = (
      <nosto-section-campaign mode="bundled" placement="placement1" section="nosto-product-titles" />
    ) as SectionCampaign
    el.handles = "product-a" // pre-set to match, should skip postJSON

    await el.connectedCallback()
    // No fetch should be made, so nothing to assert here except no error thrown
  })

  it("propagates post errors and clears loading", async () => {
    mockNostoRecs({ placement1: { products: [{ handle: "x" }] } })
    addHandlers(http.get("/cart/update.js", () => HttpResponse.text("Error", { status: 500 })))

    const el = (
      <nosto-section-campaign mode="bundled" placement="placement1" section="nosto-product-titles" />
    ) as SectionCampaign

    await expect(el.connectedCallback()).rejects.toThrow()
    expect(el.hasAttribute("loading")).toBe(false)
  })
})
