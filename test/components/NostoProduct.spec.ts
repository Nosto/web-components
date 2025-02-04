import { describe, it, expect, beforeEach, vi } from "vitest"
import { NostoProduct } from "../../src/components/NostoProduct"

describe("NostoProduct", () => {
  let element: NostoProduct

  beforeEach(() => {
    element = new NostoProduct()
    document.body.innerHTML = ""
  })

  describe("verify setup & validation", () => {
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

  describe("verify ATC", () => {
    beforeEach(() => {
      element.setAttribute("product-id", "123")
      element.setAttribute("reco-id", "789")
      window.Nosto = { addSkuToCart: vi.fn() }
    })

    function checkSkuAtc(skuId: string) {
      const atc = element.querySelector<HTMLElement>(`[n-sku-id="${skuId}"] > [n-atc]`)
      checkATC(atc!)
    }

    function checkProductAtc() {
      const atc = element.querySelector<HTMLElement>("[n-atc]")
      checkATC(atc!)
    }

    function checkATC(atcElement: Element) {
      const clickEvent = new MouseEvent("click", { bubbles: true })
      atcElement.dispatchEvent(clickEvent)

      expect(window.Nosto!.addSkuToCart).toHaveBeenCalledWith(
        { productId: "123", skuId: element.selectedSkuId },
        "789",
        1
      )
    }

    it("should not throw an error if all required attributes are provided", () => {
      expect(() => element.connectedCallback()).not.toThrow()
    })

    it("should call addSkuToCart when clicked on an element with [n-atc]", () => {
      element.innerHTML = `
      <div n-sku-id="456">
        <div n-atc>ATC</div>
      </div>
    `
      element.connectedCallback()

      checkSkuAtc("456")
    })

    it("should handle [n-atc] on every individual sku option", () => {
      element.innerHTML = `
      <div n-sku-id="456">
        <span n-atc>Blue</span>
      </div>
      <div n-sku-id="101">
        <span n-atc>Black</span>
      </div>
    `
      element.connectedCallback()

      checkSkuAtc("456")
      checkSkuAtc("101")
    })

    it("should pick n-sku-selector change events", () => {
      element.innerHTML = `
      <select n-sku-selector>
        <option value="456">SKU 1</option>
        <option value="457" selected>SKU 2</option>
      </select>
      <div n-atc>ATC</div>
      `
      element.connectedCallback()

      element.querySelector("[n-sku-selector]")!.dispatchEvent(new InputEvent("change", { bubbles: true }))
      checkProductAtc()
    })

    it("should pick up [n-sku-id] clicks", () => {
      element.innerHTML = `
      <div n-sku-id="234">1st sku</div>
      <div n-sku-id="345">end sku</div>
      <div n-atc>ATC</div>
    `
      element.connectedCallback()

      element.querySelector("[n-sku-id='345']")!.dispatchEvent(new MouseEvent("click", { bubbles: true }))
      checkProductAtc()
    })
  })
})
