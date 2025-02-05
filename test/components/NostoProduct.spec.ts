import { describe, it, expect, beforeEach, vi } from "vitest"
import { NostoProduct } from "../../src/components/NostoProduct"

describe("NostoProduct", () => {
  let element: NostoProduct

  beforeEach(() => {
    element = new NostoProduct()
    document.body.innerHTML = ""
  })

  it("should be defined as a custom element", () => {
    expect(customElements.get("nosto-product")).toBe(NostoProduct)
  })

  it("should have observed attributes", () => {
    expect(NostoProduct.observedAttributes).toEqual(["product-id", "reco-id"])
  })

  it("should throw an error if product-id is not provided", () => {
    expect(() => element.connectedCallback()).toThrow("Product ID is required.")
  })

  it("should throw an error if reco-id is not provided", () => {
    element.setAttribute("product-id", "123")
    expect(() => element.connectedCallback()).toThrow("Slot ID is required.")
  })

  it("should not throw an error if all required attributes are provided", () => {
    element.setAttribute("product-id", "123")
    element.setAttribute("reco-id", "789")
    expect(() => element.connectedCallback()).not.toThrow()
  })

  it("should call addSkuToCart when clicked on an element with [n-atc]", () => {
    element.setAttribute("product-id", "123")
    element.setAttribute("reco-id", "789")

    const mockAddSkuToCart = vi.fn()
    window.Nosto = { addSkuToCart: mockAddSkuToCart }

    element.innerHTML = `
      <div n-sku-id="456">
        <div n-atc>ATC</div>
      </div>
    `
    element.connectedCallback()

    element.querySelector<HTMLElement>("[n-atc]")!.click()

    expect(mockAddSkuToCart).toHaveBeenCalledWith({ productId: "123", skuId: "456" }, "789", 1)
  })

  it("should pick up n-sku-id from the closest parent with [n-sku-id]", () => {
    element.setAttribute("product-id", "123")
    element.setAttribute("reco-id", "789")

    const mockAddSkuToCart = vi.fn()
    window.Nosto = { addSkuToCart: mockAddSkuToCart }

    element.innerHTML = `
      <div n-sku-id="456">
        <div n-atc>ATC</div>
      </div>
    `
    element.connectedCallback()

    element.querySelector<HTMLElement>("[n-atc]")!.click()

    expect(mockAddSkuToCart).toHaveBeenCalledWith({ productId: "123", skuId: "456" }, "789", 1)
  })

  it("should pick n-sku-selector change events", () => {
    element.setAttribute("product-id", "123")
    element.setAttribute("reco-id", "789")

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
    element.querySelector<HTMLElement>("[n-atc]")!.click()

    expect(mockAddSkuToCart).toHaveBeenCalledWith({ productId: "123", skuId: "457" }, "789", 1)
  })

  it("should pick up [n-sku-id] clicks", () => {
    element.setAttribute("product-id", "123")
    element.setAttribute("reco-id", "789")

    const mockAddSkuToCart = vi.fn()
    window.Nosto = { addSkuToCart: mockAddSkuToCart }

    element.innerHTML = `
    <div n-sku-id="234">1st sku</div>
    <div n-sku-id="345">end sku</div>
    <div n-atc>ATC</div>
    `
    element.connectedCallback()

    element.querySelector<HTMLElement>("[n-sku-id='345']")!.click()
    element.querySelector<HTMLElement>("[n-atc]")!.click()

    expect(mockAddSkuToCart).toHaveBeenCalledWith({ productId: "123", skuId: "345" }, "789", 1)
  })
})
