/** @jsx createElement */
import { describe, it, expect, Mock } from "vitest"
import { SectionCampaign } from "@/components/SectionCampaign/SectionCampaign"
import { RequestBuilder } from "@nosto/nosto-js/client"
import { addHandlers } from "../../msw.setup"
import { http, HttpResponse } from "msw"
import { mockNostoRecs } from "../../mockNostoRecs"
import { createElement } from "@/utils/jsx"

describe("SectionCampaign", () => {
  it("should be defined as a custom element", () => {
    expect(customElements.get("nosto-section-campaign")).toBeDefined()
  })

  it("renders section markup from product handles and attributes product clicks", async () => {
    const products = [{ handle: "product-a" }, { handle: "product-b" }]
    const { attributeProductClicksInCampaign, load, mockBuilder } = mockNostoRecs({ placement1: { products } })

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
    // Batching may invoke setElements with duplicates; ensure placement present
    const callArg = (mockBuilder.setElements as Mock<RequestBuilder["setElements"]>).mock.calls[0][0]
    expect(callArg).toContain("placement1")

    expect(el.innerHTML).toBe(`<div class="wrapper"><div class="inner">Rendered Section</div></div>`)
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

  it("does not replace title when title-selector is not provided", async () => {
    const products = [{ handle: "product-a" }]
    const { attributeProductClicksInCampaign, load } = mockNostoRecs({
      placement1: { products, title: "Custom Title" }
    })

    const sectionHTML = `<div class="wrapper"><h2 class="nosto-title">Default Title</h2><div class="inner">Rendered Section</div></div>`
    addHandlers(
      http.get("/search", () => {
        return HttpResponse.text(`<section>${sectionHTML}</section>`)
      })
    )

    const el = (<nosto-section-campaign placement="placement1" section="featured-section" />) as SectionCampaign
    document.body.appendChild(el)

    await el.connectedCallback()

    expect(load).toHaveBeenCalled()
    expect(el.innerHTML).toContain("Default Title")
    expect(el.innerHTML).not.toContain("Custom Title")
    expect(attributeProductClicksInCampaign).toHaveBeenCalledWith(el, { products, title: "Custom Title" })
    expect(el.hasAttribute("loading")).toBe(false)
  })

  it("does not replace title in regular heading elements without nosto-title class", async () => {
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

  it("joins product handles with ' OR ' separator for search query", async () => {
    const products = [{ handle: "product-a" }, { handle: "product-b" }, { handle: "product-c" }]
    mockNostoRecs({ placement1: { products } })

    let capturedUrl = ""
    const sectionHTML = `<div class="wrapper">Products</div>`
    addHandlers(
      http.get("/search", ({ request }) => {
        capturedUrl = request.url
        return HttpResponse.text(`<section>${sectionHTML}</section>`)
      })
    )

    const el = (<nosto-section-campaign placement="placement1" section="featured-section" />) as SectionCampaign
    document.body.appendChild(el)

    await el.connectedCallback()

    const url = new URL(capturedUrl)
    expect(url.searchParams.get("q")).toBe("product-a OR product-b OR product-c")
    expect(url.searchParams.get("section_id")).toBe("featured-section")
  })

  it("returns inner HTML of nosto-section-campaign element when present in section body", async () => {
    const products = [{ handle: "product-a" }]
    const { attributeProductClicksInCampaign, load } = mockNostoRecs({ placement1: { products } })

    const sectionHTML = `<div class="wrapper"><nosto-section-campaign placement="placement1"><div class="campaign-content">Campaign Content</div></nosto-section-campaign></div>`
    addHandlers(
      http.get("/search", () => {
        return HttpResponse.text(`<section>${sectionHTML}</section>`)
      })
    )

    const el = (<nosto-section-campaign placement="placement1" section="featured-section" />) as SectionCampaign
    document.body.appendChild(el)

    await el.connectedCallback()

    expect(load).toHaveBeenCalled()
    expect(el.innerHTML).toBe(`<div class="campaign-content">Campaign Content</div>`)
    expect(attributeProductClicksInCampaign).toHaveBeenCalledWith(el, { products })
    expect(el.hasAttribute("loading")).toBe(false)
  })

  it("does not replace title in nested nosto-section-campaign when title-selector is not provided", async () => {
    const products = [{ handle: "product-a" }]
    const { attributeProductClicksInCampaign, load } = mockNostoRecs({
      placement1: { products, title: "Custom Title" }
    })

    const sectionHTML = `<div class="wrapper"><nosto-section-campaign placement="placement1"><h2 class="nosto-title">Default Title</h2><div class="campaign-content">Campaign Content</div></nosto-section-campaign></div>`
    addHandlers(
      http.get("/search", () => {
        return HttpResponse.text(`<section>${sectionHTML}</section>`)
      })
    )

    const el = (<nosto-section-campaign placement="placement1" section="featured-section" />) as SectionCampaign
    document.body.appendChild(el)

    await el.connectedCallback()

    expect(load).toHaveBeenCalled()
    expect(el.innerHTML).toContain("Default Title")
    expect(el.innerHTML).not.toContain("Custom Title")
    expect(attributeProductClicksInCampaign).toHaveBeenCalledWith(el, { products, title: "Custom Title" })
    expect(el.hasAttribute("loading")).toBe(false)
  })

  it("returns first element's inner HTML when nosto-section-campaign is not present", async () => {
    const products = [{ handle: "product-a" }]
    const { attributeProductClicksInCampaign, load } = mockNostoRecs({ placement1: { products } })

    const sectionHTML = `<div class="wrapper"><div class="inner">Regular Content</div></div>`
    addHandlers(
      http.get("/search", () => {
        return HttpResponse.text(`<section>${sectionHTML}</section>`)
      })
    )

    const el = (<nosto-section-campaign placement="placement1" section="featured-section" />) as SectionCampaign
    document.body.appendChild(el)

    await el.connectedCallback()

    expect(load).toHaveBeenCalled()
    expect(el.innerHTML).toBe(`<div class="wrapper"><div class="inner">Regular Content</div></div>`)
    expect(attributeProductClicksInCampaign).toHaveBeenCalledWith(el, { products })
    expect(el.hasAttribute("loading")).toBe(false)
  })

  it("returns first element's inner HTML when nosto-section-campaign has different placement", async () => {
    const products = [{ handle: "product-a" }]
    const { attributeProductClicksInCampaign, load } = mockNostoRecs({ placement1: { products } })

    const sectionHTML = `<div class="wrapper"><nosto-section-campaign placement="placement2"><div class="other">Other Placement</div></nosto-section-campaign></div>`
    addHandlers(
      http.get("/search", () => {
        return HttpResponse.text(`<section>${sectionHTML}</section>`)
      })
    )

    const el = (<nosto-section-campaign placement="placement1" section="featured-section" />) as SectionCampaign
    document.body.appendChild(el)

    await el.connectedCallback()

    expect(load).toHaveBeenCalled()
    expect(el.innerHTML).toContain(`<nosto-section-campaign placement="placement2"`)
    expect(el.innerHTML).toContain(`<div class="other">Other Placement</div>`)
    expect(attributeProductClicksInCampaign).toHaveBeenCalledWith(el, { products })
    expect(el.hasAttribute("loading")).toBe(false)
  })

  it("uses custom title-selector when provided", async () => {
    const products = [{ handle: "product-a" }]
    const { attributeProductClicksInCampaign, load } = mockNostoRecs({
      placement1: { products, title: "Custom Title" }
    })

    const sectionHTML = `<div class="wrapper"><h2 class="custom-heading">Default Title</h2><div class="inner">Rendered Section</div></div>`
    addHandlers(
      http.get("/search", () => {
        return HttpResponse.text(`<section>${sectionHTML}</section>`)
      })
    )

    const el = (
      <nosto-section-campaign placement="placement1" section="featured-section" title-selector=".custom-heading" />
    ) as SectionCampaign
    document.body.appendChild(el)

    await el.connectedCallback()

    expect(load).toHaveBeenCalled()
    expect(el.innerHTML).toContain("Custom Title")
    expect(el.innerHTML).not.toContain("Default Title")
    expect(attributeProductClicksInCampaign).toHaveBeenCalledWith(el, { products, title: "Custom Title" })
    expect(el.hasAttribute("loading")).toBe(false)
  })

  it("does not inject title when title-selector is not provided", async () => {
    const products = [{ handle: "product-a" }]
    const { attributeProductClicksInCampaign, load } = mockNostoRecs({
      placement1: { products, title: "Custom Title" }
    })

    const sectionHTML = `<div class="wrapper"><h2 class="nosto-title">Default Title</h2><h3 class="custom-heading">Should Not Change</h3></div>`
    addHandlers(
      http.get("/search", () => {
        return HttpResponse.text(`<section>${sectionHTML}</section>`)
      })
    )

    const el = (<nosto-section-campaign placement="placement1" section="featured-section" />) as SectionCampaign
    document.body.appendChild(el)

    await el.connectedCallback()

    expect(load).toHaveBeenCalled()
    expect(el.innerHTML).toContain("Default Title")
    expect(el.innerHTML).not.toContain("Custom Title")
    expect(el.innerHTML).toContain("Should Not Change")
    expect(attributeProductClicksInCampaign).toHaveBeenCalledWith(el, { products, title: "Custom Title" })
    expect(el.hasAttribute("loading")).toBe(false)
  })
})
