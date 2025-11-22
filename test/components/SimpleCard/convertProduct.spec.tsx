/** @jsx createElement */
import { describe, it, expect } from "vitest"
import { convertProduct } from "@/components/SimpleCard/convertProduct"
import type { JSONProduct } from "@nosto/nosto-js/client"

describe("convertProduct", () => {
  it("maps primary and alternate images into images array", () => {
    const product = {
      image_url: "https://example.com/primary.jpg",
      alternate_image_urls: ["https://example.com/alt-1.jpg", "https://example.com/alt-2.jpg"],
      name: "Sample Product",
      brand: "Sample Brand",
      url: "https://example.com/product",
      list_price: 200,
      price: 150,
      price_currency_code: "USD"
    } as JSONProduct

    const result = convertProduct(product)

    expect(result.images).toEqual([
      { url: "https://example.com/primary.jpg" },
      { url: "https://example.com/alt-1.jpg" },
      { url: "https://example.com/alt-2.jpg" }
    ])
    expect(result.title).toBe("Sample Product")
    expect(result.vendor).toBe("Sample Brand")
    expect(result.compareAtPrice).toEqual({
      amount: "200",
      currencyCode: "USD"
    })
    expect(result.price).toEqual({
      amount: "150",
      currencyCode: "USD"
    })
  })

  it("falls back when optional fields are missing", () => {
    const product = {
      image_url: "https://example.com/primary.jpg",
      alternate_image_urls: undefined,
      name: "Fallback Product",
      brand: "Fallback Brand",
      url: "https://example.com/fallback",
      list_price: undefined,
      price: 9900,
      price_currency_code: "USD"
    } as unknown as JSONProduct

    const result = convertProduct(product)

    expect(result.images).toEqual([{ url: "https://example.com/primary.jpg" }])
    expect(result.compareAtPrice).toEqual({
      amount: "undefined",
      currencyCode: "USD"
    })
  })
})
