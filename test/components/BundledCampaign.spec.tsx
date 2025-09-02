/** @jsx createElement */
import { describe, it, expect, Mock } from "vitest"
import { BundledCampaign } from "@/components/BundledCampaign/BundledCampaign"
import { RequestBuilder } from "@nosto/nosto-js/client"
import { addHandlers } from "../msw.setup"
import { http, HttpResponse } from "msw"
import { mockNostoRecs } from "../mockNostoRecs"
import { createElement } from "../utils/jsx"

describe("BundledCampaign", () => {
  it("should be defined as a custom element", () => {
    expect(customElements.get("nosto-bundled-campaign")).toBeDefined()
  })

  it("renders bundled section markup from product handles and attributes product clicks", async () => {
    const products = [{ handle: "product-a" }, { handle: "product-b" }]
    const { attributeProductClicksInCampaign, load, mockBuilder } = mockNostoRecs({ placement1: { products } })

    const sectionHTML = `<div class="bundled-wrapper"><div class="bundled-inner">Bundled Section</div></div>`
    addHandlers(
      http.post("/cart/update.js", () => {
        return HttpResponse.text(`<section>${sectionHTML}</section>`)
      })
    )

    const el = (<nosto-bundled-campaign placement="placement1" handles="different-handles" />) as BundledCampaign
    document.body.appendChild(el)

    await el.connectedCallback()

    expect(load).toHaveBeenCalled()
    // Batching may invoke setElements with duplicates; ensure placement present
    const callArg = (mockBuilder.setElements as Mock<RequestBuilder["setElements"]>).mock.calls[0][0]
    expect(callArg).toContain("placement1")

    expect(el.innerHTML).toBe(`<div class="bundled-wrapper"><div class="bundled-inner">Bundled Section</div></div>`)
    expect(attributeProductClicksInCampaign).toHaveBeenCalledWith(el, { products })
    expect(el.hasAttribute("loading")).toBe(false)
  })

  it("does not fetch content when handles match existing handles", async () => {
    const products = [{ handle: "product-a" }, { handle: "product-b" }]
    const { attributeProductClicksInCampaign, load, mockBuilder } = mockNostoRecs({ placement1: { products } })

    // No handlers added since we don't expect any API calls to /cart/update.js

    const el = (<nosto-bundled-campaign placement="placement1" handles="product-a:product-b" />) as BundledCampaign
    document.body.appendChild(el)

    await el.connectedCallback()

    expect(load).toHaveBeenCalled()
    // Batching may invoke setElements with duplicates; ensure placement present
    const callArg = (mockBuilder.setElements as Mock<RequestBuilder["setElements"]>).mock.calls[0][0]
    expect(callArg).toContain("placement1")

    expect(el.innerHTML).toBe("") // No content fetched since handles match
    expect(attributeProductClicksInCampaign).toHaveBeenCalledWith(el, { products })
    expect(el.hasAttribute("loading")).toBe(false)
  })
})
