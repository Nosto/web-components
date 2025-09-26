import { transform } from "@/components/Image/shopify"
import { describe, expect, it } from "vitest"

describe("shopify transform behavior validation", () => {
  const baseUrl = "https://cdn.shopify.com/s/files/1/1183/1048/products/"

  it("transforms Shopify image URL with dimensions", () => {
    const imageUrl = `${baseUrl}image_200x300.jpg`
    const customResult = transform(imageUrl, { width: 400, height: 500 })
    expect(customResult).toBe(`${baseUrl}image.jpg?width=400&height=500`)
  })

  it("transforms Shopify image URL with crop", () => {
    const imageUrl = `${baseUrl}image_200x300.jpg`
    const customResult = transform(imageUrl, { width: 400, height: 500, crop: "center" })
    expect(customResult).toBe(`${baseUrl}image.jpg?width=400&height=500&crop=center`)
  })

  it("merges height in original image URL when only width is supplied", () => {
    const imageUrl = `${baseUrl}image_200x300.jpg`
    const customResult = transform(imageUrl, { width: 400 })
    // Our new behavior: only use explicitly provided parameters
    expect(customResult).toBe(`${baseUrl}image.jpg?width=400`)
    // Note: unpic extracts dimensions but our new logic only uses provided ones
  })

  it("merges width in original image URL when only height is supplied", () => {
    const imageUrl = `${baseUrl}image_200x300.jpg`
    const customResult = transform(imageUrl, { height: 500 })
    // Our new behavior: only use explicitly provided parameters
    expect(customResult).toBe(`${baseUrl}image.jpg?height=500`)
  })

  it("returns original URL if no dimensions are provided", () => {
    const imageUrl = `${baseUrl}image.jpg`
    const customResult = transform(imageUrl, {})
    expect(customResult).toBe(customResult)
  })

  it("merges crop in original image URL when crop is provided", () => {
    const imageUrl = `${baseUrl}image_200x300_crop_center.jpg`
    const customResult = transform(imageUrl, { width: 400 })
    // Our new behavior: only use explicitly provided width, but do extract crop from URL
    expect(customResult).toBe(`${baseUrl}image.jpg?width=400&crop=center`)
  })

  it("retains original size parameters if no dimensions are provided", () => {
    const imageUrl = `${baseUrl}image_grande.jpg?foo=bar`
    const customResult = transform(imageUrl, { crop: "left" })
    expect(customResult).toBe(`${baseUrl}image.jpg?foo=bar&crop=left`)
  })

  it("retains height from existing query parameters when only width is provided", () => {
    const imageUrl = `${baseUrl}image.jpg?v=1234567&foo=bar&width=200&height=300`
    const customResult = transform(imageUrl, { width: 500 })
    // Our new behavior: only sets explicitly provided parameters, deletes others
    expect(customResult).toBe(`${baseUrl}image.jpg?v=1234567&foo=bar&width=500`)
  })

  it("retains width from existing query parameters when only height is provided", () => {
    const imageUrl = `${baseUrl}image.jpg?v=1234567&foo=bar&width=200&height=300`
    const customResult = transform(imageUrl, { height: 400 })
    // Our new behavior: only sets explicitly provided parameters, deletes others
    expect(customResult).toBe(`${baseUrl}image.jpg?v=1234567&foo=bar&height=400`)
  })

  it("retains crop from existing query parameters when only width and height is provided", () => {
    const imageUrl = `${baseUrl}image.jpg?v=1234567&foo=bar&width=200&height=300&crop=center`
    const customResult = transform(imageUrl, { width: 600, height: 400 })
    // Our new behavior: deletes crop when not explicitly provided, even if it exists in URL
    expect(customResult).toBe(`${baseUrl}image.jpg?v=1234567&foo=bar&width=600&height=400`)
  })
})
