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

    const clickEvent = new MouseEvent("click", { bubbles: true })
    const atcElement = document.createElement("div")
    atcElement.setAttribute("n-atc", "")
    atcElement.setAttribute("n-sku-id", "456")
    element.appendChild(atcElement)
    element.connectedCallback()

    atcElement.dispatchEvent(clickEvent)

    expect(mockAddSkuToCart).toHaveBeenCalledWith({ productId: "123", skuId: "456" }, "789", 1)
  })

  it("should pick up n-sku-id from the closest parent with [n-sku-id]", () => {
    element.setAttribute("product-id", "123")
    element.setAttribute("reco-id", "789")

    const mockAddSkuToCart = vi.fn()
    window.Nosto = { addSkuToCart: mockAddSkuToCart }

    const atcWrapper = document.createElement("div")
    atcWrapper.setAttribute("n-sku-id", "456")
    element.appendChild(atcWrapper)

    const clickEvent = new MouseEvent("click", { bubbles: true })
    const atcElement = document.createElement("div")
    atcElement.setAttribute("n-atc", "")
    atcWrapper.appendChild(atcElement)
    element.connectedCallback()

    atcElement.dispatchEvent(clickEvent)

    expect(mockAddSkuToCart).toHaveBeenCalledWith({ productId: "123", skuId: "456" }, "789", 1)
  })
})
