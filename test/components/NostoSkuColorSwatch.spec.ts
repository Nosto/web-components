import { beforeEach, describe, expect, it } from "vitest"
import { NostoSkuColorSwatch } from "@/components/sku/NostoSkuColorSwatch"

describe("NostoSkuColorSwatch", () => {
  let element: NostoSkuColorSwatch

  beforeEach(() => {
    element = new NostoSkuColorSwatch()
    document.body.innerHTML = ""
  })

  it("should be defined as a custom element", () => {
    expect(customElements.get("nosto-color-swatch")).toBe(NostoSkuColorSwatch)
  })

  it("should have observed attributes", () => {
    expect(NostoSkuColorSwatch.observedAttributes).toEqual(["mode", "sku-colors"])
  })

  it("should be loaded with defaults on load", () => {
    const expected = /<div class="_colorDotsTemplate_\w+"><\/div>/g

    element.connectedCallback()
    expect(element.mode).toBe("dots")
    expect(element.innerHTML).toMatch(expected)
  })

  it("should load sku color swatches for pink", () => {
    const expected =
      /<div class="_colorDotsTemplate_\w+"><span key="#ffc0cb" style="background-color: rgb\(255, 192, 203\);"><\/span><\/div>/g

    element.setAttribute("sku-colors", '["pink"]')
    element.connectedCallback()

    expect(element.mode).toBe("dots")
    expect(element.innerHTML).toMatch(expected)
  })
})
