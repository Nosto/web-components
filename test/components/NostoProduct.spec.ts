import { describe, it, expect, beforeEach, vi } from "vitest"
import { NostoProduct } from "../../src/components/NostoProduct"

describe("NostoProduct", () => {
  let element: NostoProduct

  beforeEach(() => {
    element = new NostoProduct()
    document.body.innerHTML = ""
  })

  function checkATC(skuId: string, skuATC: boolean = false) {
    const atcSelector = skuATC ? `[n-sku-id="${skuId}"] > [n-atc]` : "[n-atc]"
    const atc = element.querySelector<HTMLElement>(atcSelector)

    const clickEvent = new MouseEvent("click", { bubbles: true })
    atc?.dispatchEvent(clickEvent)

    expect(window.Nosto?.addSkuToCart).toHaveBeenCalledWith({ productId: "123", skuId }, "789", 1)
  }

  describe("NostoProduct - verify setup & validation", () => {
    it("should be defined as a custom element", () => {
      expect(customElements.get("nosto-product")).toBe(NostoProduct)
    })

    it("should have observed attributes", () => {
      expect(NostoProduct.observedAttributes).toEqual(["product-id", "reco-id"])
    })

    it("should throw an error if no attribute is provided", () => {
      expect(() => element.connectedCallback()).toThrow("Product ID is required.")
    })

    it("should throw an error if product-id is not provided", () => {
      element.setAttribute("reco-id", "123")
      expect(() => element.connectedCallback()).toThrow("Product ID is required.")
    })

    it("should throw an error if reco-id is not provided", () => {
      element.setAttribute("product-id", "123")
      expect(() => element.connectedCallback()).toThrow("Slot ID is required.")
    })
  })

  describe("NostoProduct - verify ATC", () => {
    beforeEach(() => {
      element.setAttribute("product-id", "123")
      element.setAttribute("reco-id", "789")
    })

    it("should not throw an error if all required attributes are provided", () => {
      expect(() => element.connectedCallback()).not.toThrow()
    })

    it("should call addSkuToCart when clicked on an element with [n-atc]", () => {
      const mockAddSkuToCart = vi.fn()
      window.Nosto = { addSkuToCart: mockAddSkuToCart }

      element.innerHTML = `
      <div n-sku-id="456">
        <div n-atc>ATC</div>
      </div>
    `
      element.connectedCallback()

      checkATC("456", true)
    })

    it("should handle [n-atc] on every individual sku option", () => {
      const mockAddSkuToCart = vi.fn()
      window.Nosto = { addSkuToCart: mockAddSkuToCart }

      element.innerHTML = `
      <div n-sku-id="456">
        <div n-atc>ATC</div>
      </div>
      <div n-sku-id="101">
        <div n-atc>ATC</div>
      </div>
    `
      element.connectedCallback()

      checkATC("456", true)
      checkATC("101", true)
    })

    it("should pick n-sku-selector change events", () => {
      const mockAddSkuToCart = vi.fn()
      window.Nosto = { addSkuToCart: mockAddSkuToCart }

      element.innerHTML = `
    <select n-sku-selector>
      <option value="456">SKU 1</option>
      <option value="457" selected>SKU 2</option>
    </select>
    <div n-atc>ATC</div>
    `
      element.connectedCallback()

      element.querySelector("[n-sku-selector]")!.dispatchEvent(new InputEvent("change", { bubbles: true }))
      checkATC("457")
    })

    it("should pick up [n-sku-id] clicks", () => {
      const mockAddSkuToCart = vi.fn()
      window.Nosto = { addSkuToCart: mockAddSkuToCart }

      element.innerHTML = `
    <div n-sku-id="234">1st sku</div>
    <div n-sku-id="345">end sku</div>
    <div n-atc>ATC</div>
    `
      element.connectedCallback()

      element.querySelector("[n-sku-id='345']")!.dispatchEvent(new MouseEvent("click", { bubbles: true }))
      checkATC("345")
    })
  })
})
