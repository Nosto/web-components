/** @jsx createElement */
import { describe, it, expect, beforeAll } from "vitest"
import { Bundle } from "@/components/Bundle/Bundle"
import { createElement } from "./jsx"
import type { JSONProduct } from "@nosto/nosto-js/client"

describe("JSX createElement", () => {
  beforeAll(() => {
    if (!customElements.get("nosto-bundle")) {
      customElements.define("nosto-bundle", Bundle)
    }
  })

  describe("Property binding syntax", () => {
    it("should set JavaScript properties using .property syntax in createElement", () => {
      const products = [
        { handle: "a", price: 10, price_currency_code: "USD" },
        { handle: "b", price: 5, price_currency_code: "USD" }
      ] as JSONProduct[]

      const bundle = createElement("nosto-bundle", { ".products": products }) as Bundle

      expect(bundle.products).toBe(products)
      expect(bundle.products).toHaveLength(2)
      expect(bundle.products[0].handle).toBe("a")
    })

    it("should work with both properties and attributes", () => {
      const products = [{ handle: "test", price: 20, price_currency_code: "USD" }] as JSONProduct[]

      const bundle = createElement("nosto-bundle", { ".products": products, id: "test-bundle" }) as Bundle

      expect(bundle.products).toBe(products)
      expect(bundle.getAttribute("id")).toBe("test-bundle")
    })

    it("should handle multiple property bindings", () => {
      const products = [{ handle: "a", price: 10, price_currency_code: "USD" }] as JSONProduct[]
      const selectedProducts = [products[0]]

      const bundle = createElement("nosto-bundle", {
        ".products": products,
        ".selectedProducts": selectedProducts
      }) as Bundle

      expect(bundle.products).toBe(products)
      expect(bundle.selectedProducts).toBe(selectedProducts)
    })

    it("should set properties with complex objects", () => {
      const complexProducts = [
        {
          handle: "complex",
          price: 99.99,
          price_currency_code: "EUR",
          tags1: ["tag1", "tag2"],
          image_url: "https://example.com/image.jpg"
        }
      ] as JSONProduct[]

      const bundle = createElement("nosto-bundle", { ".products": complexProducts }) as Bundle

      expect(bundle.products).toBe(complexProducts)
      expect(bundle.products[0].tags1).toEqual(["tag1", "tag2"])
    })
  })

  describe("Traditional attribute binding", () => {
    it("should still work with traditional attribute syntax", () => {
      const bundle = (<nosto-bundle id="traditional" data-test="value" />) as Bundle

      expect(bundle.getAttribute("id")).toBe("traditional")
      expect(bundle.getAttribute("data-test")).toBe("value")
    })
  })
})
