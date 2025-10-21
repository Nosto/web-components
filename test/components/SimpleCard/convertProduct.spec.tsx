import { describe, it, expect } from "vitest"
import { convertProduct } from "@/components/SimpleCard/convertProduct"
import type { JSONProduct } from "@nosto/nosto-js/client"

describe("convertProduct", () => {
  it("maps primary and alternate images into media array", () => {
    const product = {
      image_url: "https://example.com/primary.jpg",
      alternate_image_urls: ["https://example.com/alt-1.jpg", "https://example.com/alt-2.jpg"],
      name: "Sample Product",
      brand: "Sample Brand",
      url: "https://example.com/product",
      list_price: 200,
      price: 150
    } as JSONProduct

    const result = convertProduct(product)

    expect(result.media).toEqual([
      { src: "https://example.com/primary.jpg" },
      { src: "https://example.com/alt-1.jpg" },
      { src: "https://example.com/alt-2.jpg" }
    ])
    expect(result.title).toBe("Sample Product")
    expect(result.vendor).toBe("Sample Brand")
    expect(result.url).toBe("https://example.com/product")
    expect(result.images).toEqual([])
    expect(result.compare_at_price).toBe(20000)
    expect(result.price).toBe(15000)
  })

  it("falls back when optional fields are missing", () => {
    const product = {
      image_url: "https://example.com/primary.jpg",
      alternate_image_urls: undefined,
      name: "Fallback Product",
      brand: "Fallback Brand",
      url: "https://example.com/fallback",
      list_price: undefined,
      price: 9900
    } as unknown as JSONProduct

    const result = convertProduct(product)

    expect(result.media).toEqual([{ src: "https://example.com/primary.jpg" }])
    expect(result.compare_at_price).toBeUndefined()
  })
})
