import { describe, it, expect, beforeEach, vi } from "vitest"
import { NostoShopify } from "../../src/components/NostoShopify"

describe("NostoShopify", () => {
  let element: NostoShopify

  beforeEach(() => {
    element = new NostoShopify()
    document.body.innerHTML = ""
  })

  it("should throw an exception if not wrapped in a nosto_element", () => {
    expect(() => element.connectedCallback()).toThrow("Found no wrapper element with class 'nosto_element'")
  })

  it("should call window.Nosto.migrateToShopifyMarket with correct parameters", () => {
    const mockNosto = {
      migrateToShopifyMarket: vi.fn()
    }
    window.Nosto = mockNosto

    const wrapper = document.createElement("div")
    wrapper.classList.add("nosto_element")
    wrapper.id = "test-campaign"
    document.body.replaceChildren(wrapper)

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
  })

  it("should use mapping overrides in migrateToShopifyMarket call", () => {
    const mockNosto = {
      migrateToShopifyMarket: vi.fn()
    }
    window.Nosto = mockNosto

    const wrapper = document.createElement("div")
    wrapper.classList.add("nosto_element")
    wrapper.id = "test-campaign"
    document.body.replaceChildren(wrapper)

    element.product = "custom-product-selector"
    element.url = "custom-url-selector"
    element.title = "custom-title-selector"
    element.handle = "custom-handle-selector"
    element.price = "custom-price-selector"
    element.listPrice = "custom-list-price-selector"
    element.defaultVariantId = "custom-variant-id-selector"
    element.description = "custom-description-selector"

    element.setAttribute("markets", "")
    wrapper.appendChild(element)

    expect(mockNosto.migrateToShopifyMarket).toHaveBeenCalledWith({
      productSectionElement: "#test-campaign custom-product-selector",
      productUrlElement: "custom-url-selector",
      productTitleElement: "custom-title-selector",
      productHandleAttribute: "custom-handle-selector",
      priceElement: "custom-price-selector",
      listPriceElement: "custom-list-price-selector",
      defaultVariantIdAttribute: "custom-variant-id-selector",
      descriptionElement: "custom-description-selector"
    })
  })
})
