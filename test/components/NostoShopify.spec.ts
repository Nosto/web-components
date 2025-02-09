import { describe, it, expect, beforeEach, vi } from "vitest"
import { NostoShopify } from "../../src/components/NostoShopify"

describe("NostoShopify", () => {
  let element: NostoShopify

  beforeEach(() => {
    element = new NostoShopify()
    document.body.innerHTML = ""
  })

  it("should throw an exception if not wrapped in a nosto-element", () => {
    expect(() => element.connectedCallback()).toThrow("Found no wrapper element with class 'nosto-element'")
  })

  it("should call window.Nosto.migrateToShopifyMarket with correct parameters", () => {
    const mockNosto = {
      migrateToShopifyMarket: vi.fn()
    }
    window.Nosto = mockNosto

    const wrapper = document.createElement("div")
    wrapper.classList.add("nosto-element")
    wrapper.id = "test-campaign"
    document.body.appendChild(wrapper)

    element.setAttribute("markets", "")
    wrapper.appendChild(element)

    expect(mockNosto.migrateToShopifyMarket).toHaveBeenCalledWith({
      productSectionElement: "#test-campaign nosto-product",
      productUrlElement: "[n-url]",
      productTitleElement: "[n-title]",
      productHandleAttribute: "[n-handle]",
      priceElement: "[n-price]",
      listPriceElement: "[n-list-price]",
      defaultVariantIdAttribute: "[n-variant-id]",
      descriptionElement: "[n-description]"
    })

    document.body.removeChild(wrapper)
  })
})
