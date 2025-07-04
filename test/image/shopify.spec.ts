import { describe, it, expect } from "vitest"
import { transform } from "@/image/shopify"

describe("shopify.transform", () => {
  const base = "https://cdn.shopify.com/s/files/1/1183/1048/products/"

  it("returns original url if not matching pattern", () => {
    const imageUrl = base + "not-an-image-url.txt"
    expect(transform({ imageUrl })).toBe(imageUrl)
  })

  it("transforms url with extracted dimension", () => {
    const imageUrl = base + "image_200x300.jpg"
    const result = transform({ imageUrl })
    expect(result).toBe(`${base}image.jpg?width=200&height=300`)
  })

  it("overrides extracted dimension with provided width/height", () => {
    const imageUrl = base + "image_200x300.jpg"
    const result = transform({ imageUrl, width: 400, height: 500 })
    expect(result).toBe(`${base}image.jpg?width=400&height=500`)
  })

  it("overrides only the provided dimension", () => {
    const imageUrl = base + "image_200x300.jpg"
    const result = transform({ imageUrl, width: 600 })
    expect(result).toBe(`${base}image.jpg?width=600&height=300`)
  })

  it("extracts dimensions and crop from URL", () => {
    const imageUrl = base + "image_200x300_crop_center.jpg"
    const result = transform({ imageUrl })
    expect(result).toBe(`${base}image.jpg?width=200&height=300&crop=center`)
  })

  it("adds crop param if provided", () => {
    const imageUrl = base + "image_200x300.jpg"
    const result = transform({ imageUrl, crop: "center" })
    expect(result).toBe(`${base}image.jpg?width=200&height=300&crop=center`)
  })

  it("overrides dimensions and crop with provided", () => {
    const imageUrl = base + "image_200x300_center.jpg"
    const result = transform({ imageUrl, width: 600, height: 400, crop: "left" })
    expect(result).toBe(`${base}image.jpg?width=600&height=400&crop=left`)
  })

  it("preserves existing query params", () => {
    const imageUrl = base + "image_200x300.jpg?v=1234567&foo=bar"
    const result = transform({ imageUrl, width: 500 })
    expect(result).toBe(`${base}image.jpg?v=1234567&foo=bar&width=500&height=300`)
  })

  it("handles format correctly", () => {
    const imageUrl = base + "image_200x300.webp"
    const result = transform({ imageUrl })
    expect(result).toBe(`${base}image.webp?width=200&height=300`)
  })

  it("handles images with no dimension or crop", () => {
    const imageUrl = base + "image.jpg"
    const result = transform({ imageUrl })
    expect(result).toContain("image.jpg")
  })

  it("considers existing dimensions from query params", () => {
    const imageUrl = base + "image.jpg?width=300&height=200"
    const result = transform({ imageUrl, width: 800 })
    expect(result).toBe(`${base}image.jpg?width=800&height=200`)
  })

  it("handles the legacy size parameters with crop is supplied", () => {
    const sizes = ["pico", "icon", "thumb", "small", "compact", "medium", "large", "grande", "original", "master"]
    sizes.forEach(size => {
      const imageUrl = base + `image_${size}.jpg`
      const result = transform({ imageUrl, crop: "center" })
      expect(result).toBe(`${base}image.jpg?crop=center`)
    })
  })

  it("overwrites the legacy size parameters with dimension is supplied", () => {
    const sizes = ["pico", "icon", "thumb", "small", "compact", "medium", "large", "grande", "original", "master"]
    sizes.forEach(size => {
      const imageUrl = base + `image_${size}.jpg`
      const result = transform({ imageUrl, width: 400, height: 200 })
      expect(result).toBe(`${base}image.jpg?width=400&height=200`)
    })
  })
})
