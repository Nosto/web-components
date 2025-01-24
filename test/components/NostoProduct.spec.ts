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
    expect(NostoProduct.observedAttributes).toEqual(["productId", "skuId", "slotId"])
  })

  it("should throw an error if productId is not provided", () => {
    expect(() => element.connectedCallback()).toThrow("Product ID is required.")
  })

  it("should throw an error if skuId is not provided", () => {
    element.setAttribute("productId", "123")
    expect(() => element.connectedCallback()).toThrow("Sku ID is required.")
  })

  it("should throw an error if slotId is not provided", () => {
    element.setAttribute("productId", "123")
    element.setAttribute("skuId", "456")
    expect(() => element.connectedCallback()).toThrow("Slot ID is required.")
  })

  it("should not throw an error if all required attributes are provided", () => {
    element.setAttribute("productId", "123")
    element.setAttribute("skuId", "456")
    element.setAttribute("slotId", "789")
    expect(() => element.connectedCallback()).not.toThrow()
  })

  it("should call addSkuToCart when clicked on an element with [n-atc]", () => {
    element.setAttribute("productId", "123")
    element.setAttribute("skuId", "456")
    element.setAttribute("slotId", "789")
    element.connectedCallback()

    const mockAddSkuToCart = vi.fn()
    window.Nosto = { addSkuToCart: mockAddSkuToCart }

    const clickEvent = new MouseEvent("click", { bubbles: true })
    const atcElement = document.createElement("div")
    atcElement.setAttribute("n-atc", "")
    element.appendChild(atcElement)
    atcElement.dispatchEvent(clickEvent)

    expect(mockAddSkuToCart).toHaveBeenCalledWith({ productId: "123", skuId: "456" }, "789", 1)
  })
})
