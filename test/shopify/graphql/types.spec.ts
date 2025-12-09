import { describe, it, expect } from "vitest"
import { Simplify, ShopifyProduct, ShopifyOption } from "@/shopify/graphql/types"

describe("Simplify utility type", () => {
  it("should simplify intersection types", () => {
    // Type test: Simplify should flatten intersection types
    type Complex = { a: string } & { b: number }
    type Simple = Simplify<Complex>

    const value: Simple = { a: "test", b: 123 }
    expect(value).toEqual({ a: "test", b: 123 })
  })

  it("should work with ShopifyProduct type", () => {
    // This test verifies that ShopifyProduct is correctly typed
    // and can be used in type assertions
    const product = {
      id: "gid://shopify/Product/1",
      title: "Test Product",
      handle: "test-product",
      vendor: "Test Vendor",
      description: "Test Description",
      encodedVariantExistence: "",
      onlineStoreUrl: "https://example.com/products/test-product",
      availableForSale: true,
      featuredImage: { url: "https://example.com/image.jpg", width: 100, height: 100 },
      adjacentVariants: [],
      images: [],
      options: [],
      price: { amount: "10.00", currencyCode: "USD" },
      compareAtPrice: null,
      variants: []
    } as ShopifyProduct

    expect(product.title).toBe("Test Product")
    expect(product.price.amount).toBe("10.00")
  })

  it("should work with ShopifyOption type", () => {
    // This test verifies that ShopifyOption is correctly typed
    const option = {
      name: "Color",
      optionValues: [
        {
          name: "Red",
          firstSelectableVariant: null,
          swatch: null
        }
      ]
    } as ShopifyOption

    expect(option.name).toBe("Color")
    expect(option.optionValues).toHaveLength(1)
  })
})
