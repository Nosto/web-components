/** @jsx createElement */
import { describe, it, expect, Mock, vi } from "vitest"
import { SectionCampaign } from "@/components/SectionCampaign/SectionCampaign"
import { RequestBuilder } from "@nosto/nosto-js/client"
import { addHandlers } from "../msw.setup"
import { http, HttpResponse } from "msw"
import { mockNostoRecs } from "../mockNostoRecs"
import { createElement } from "../utils/jsx"

describe("SectionCampaign", () => {
  it("should be defined as a custom element", () => {
    expect(customElements.get("nosto-section-campaign")).toBeDefined()
  })

  it("renders section markup from product handles and attributes product clicks", async () => {
    const products = [{ handle: "product-a" }, { handle: "product-b" }]
    const { attributeProductClicksInCampaign, load, mockBuilder } = mockNostoRecs({ placement1: { products } })

    const sectionHTML = `<div class=\"wrapper\"><div class=\"inner\">Rendered Section</div></div>`
    addHandlers(
      http.get("/search", () => {
        return HttpResponse.text(`<section>${sectionHTML}</section>`)
      })
    )

    const el = (<nosto-section-campaign placement="placement1" section="featured-section" />) as SectionCampaign
    document.body.appendChild(el)

    await el.connectedCallback()

    expect(load).toHaveBeenCalled()
    // Batching may invoke setElements with duplicates; ensure placement present
    const callArg = (mockBuilder.setElements as Mock<RequestBuilder["setElements"]>).mock.calls[0][0]
    expect(callArg).toContain("placement1")

    expect(el.innerHTML).toBe(`<div class=\"wrapper\"><div class=\"inner\">Rendered Section</div></div>`)
    expect(attributeProductClicksInCampaign).toHaveBeenCalledWith(el, { products })
    expect(el.hasAttribute("loading")).toBe(false)
  })

  it("throws when section fetch fails", async () => {
    mockNostoRecs({ placement1: { products: [{ handle: "x" }] } })

    addHandlers(http.get("/search", () => HttpResponse.text("Error", { status: 500 })))

    const el = (<nosto-section-campaign placement="placement1" section="missing-section" />) as SectionCampaign

    await expect(el.connectedCallback()).rejects.toThrow("Failed to fetch http://localhost:3000/search")
    expect(el.hasAttribute("loading")).toBe(false)
  })

  it("replaces title in element with nosto-title attribute", async () => {
    const products = [{ handle: "product-a" }]
    const { attributeProductClicksInCampaign, load } = mockNostoRecs({
      placement1: { products, title: "Custom Title" }
    })

    const sectionHTML = `<div class="wrapper"><h2 nosto-title>Default Title</h2><div class="inner">Rendered Section</div></div>`
    addHandlers(
      http.get("/search", () => {
        return HttpResponse.text(`<section>${sectionHTML}</section>`)
      })
    )

    const el = (<nosto-section-campaign placement="placement1" section="featured-section" />) as SectionCampaign
    document.body.appendChild(el)

    await el.connectedCallback()

    expect(load).toHaveBeenCalled()
    expect(el.innerHTML).toContain("Custom Title")
    expect(el.innerHTML).not.toContain("Default Title")
    expect(attributeProductClicksInCampaign).toHaveBeenCalledWith(el, { products, title: "Custom Title" })
    expect(el.hasAttribute("loading")).toBe(false)
  })

  it("does not replace title in regular heading elements without nosto-title attribute", async () => {
    const products = [{ handle: "product-a" }]
    const { attributeProductClicksInCampaign, load } = mockNostoRecs({
      placement1: { products, title: "Custom Title" }
    })

    const sectionHTML = `<div class="wrapper"><h2>Regular Heading</h2><div class="inner">Rendered Section</div></div>`
    addHandlers(
      http.get("/search", () => {
        return HttpResponse.text(`<section>${sectionHTML}</section>`)
      })
    )

    const el = (<nosto-section-campaign placement="placement1" section="featured-section" />) as SectionCampaign
    document.body.appendChild(el)

    await el.connectedCallback()

    expect(load).toHaveBeenCalled()
    expect(el.innerHTML).toContain("Regular Heading")
    expect(el.innerHTML).not.toContain("Custom Title")
    expect(attributeProductClicksInCampaign).toHaveBeenCalledWith(el, { products, title: "Custom Title" })
    expect(el.hasAttribute("loading")).toBe(false)
  })

  it("uses Shopify routes root when available", async () => {
    // Set up window.Shopify.routes.root
    vi.stubGlobal("Shopify", { routes: { root: "/en-us/" } })

    const products = [{ handle: "product-a" }]
    const { attributeProductClicksInCampaign, load } = mockNostoRecs({
      placement1: { products, title: "Custom Title" }
    })

    const sectionHTML = `<div class="wrapper"><div class="inner">Rendered Section</div></div>`

    // Set up handler for the custom root path
    addHandlers(
      http.get("/en-us/search", () => {
        return HttpResponse.text(`<section>${sectionHTML}</section>`)
      })
    )

    const el = (<nosto-section-campaign placement="placement1" section="featured-section" />) as SectionCampaign
    document.body.appendChild(el)

    await el.connectedCallback()

    expect(load).toHaveBeenCalled()
    expect(el.innerHTML).toBe(`<div class="wrapper"><div class="inner">Rendered Section</div></div>`)
    expect(attributeProductClicksInCampaign).toHaveBeenCalledWith(el, { products, title: "Custom Title" })
    expect(el.hasAttribute("loading")).toBe(false)

    // Restore original globals
    vi.unstubAllGlobals()
  })

  it("falls back to default root when Shopify routes not available", async () => {
    // Ensure window.Shopify is undefined
    vi.stubGlobal("Shopify", undefined)

    const products = [{ handle: "product-a" }]
    const { attributeProductClicksInCampaign, load } = mockNostoRecs({
      placement1: { products, title: "Custom Title" }
    })

    const sectionHTML = `<div class="wrapper"><div class="inner">Rendered Section</div></div>`
    addHandlers(
      http.get("/search", () => {
        return HttpResponse.text(`<section>${sectionHTML}</section>`)
      })
    )

    const el = (<nosto-section-campaign placement="placement1" section="featured-section" />) as SectionCampaign
    document.body.appendChild(el)

    await el.connectedCallback()

    expect(load).toHaveBeenCalled()
    expect(el.innerHTML).toBe(`<div class="wrapper"><div class="inner">Rendered Section</div></div>`)
    expect(attributeProductClicksInCampaign).toHaveBeenCalledWith(el, { products, title: "Custom Title" })
    expect(el.hasAttribute("loading")).toBe(false)

    // Restore original globals
    vi.unstubAllGlobals()
  })
})
