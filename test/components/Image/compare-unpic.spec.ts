import { transform } from "@/components/Image/shopify"
import { transform as unpicTransform } from "unpic/providers/shopify"
import { describe, expect, it } from "vitest"

describe("unpic.transformUrl vs custom transform", () => {
  const baseUrl = "https://cdn.shopify.com/s/files/1/1183/1048/products/"

  it("transforms Shopify image URL with dimensions", () => {
    const imageUrl = `${baseUrl}image_200x300.jpg`
    const unpicResult = unpicTransform(imageUrl, { width: 400, height: 500 })
    const customResult = transform(imageUrl, { width: 400, height: 500 })
    expect(unpicResult).toBe(customResult)
  })

  it("transforms Shopify image URL with crop", () => {
    const imageUrl = `${baseUrl}image_200x300.jpg`
    const unpicResult = unpicTransform(imageUrl, { width: 400, height: 500, crop: "center" })
    const customResult = transform(imageUrl, { width: 400, height: 500, crop: "center" })
    expect(unpicResult).toBe(customResult)
  })

  it("clears height in original image URL when only width is supplied", () => {
    const imageUrl = `${baseUrl}image_200x300.jpg`
    const customResult = transform(imageUrl, { width: 400 })
    expect(customResult).toBe(`${baseUrl}image.jpg?width=400`)
  })

  it("clears width in original image URL when only height is supplied", () => {
    const imageUrl = `${baseUrl}image_200x300.jpg`
    const customResult = transform(imageUrl, { height: 500 })
    expect(customResult).toBe(`${baseUrl}image.jpg?height=500`)
  })

  it("returns original URL if no dimensions are provided", () => {
    const imageUrl = `${baseUrl}image.jpg`
    const unpicResult = unpicTransform(imageUrl, {})
    const customResult = transform(imageUrl, {})
    expect(unpicResult).toBe(customResult)
  })

  it("clears height in original image URL when crop is provided with width", () => {
    const imageUrl = `${baseUrl}image_200x300_crop_center.jpg`
    const customResult = transform(imageUrl, { width: 400 })
    expect(customResult).toBe(`${baseUrl}image.jpg?width=400&crop=center`)
  })

  it("retains original size parameters if no dimensions are provided", () => {
    const imageUrl = `${baseUrl}image_grande.jpg?foo=bar`
    const unpicResult = unpicTransform(imageUrl, { crop: "left" })
    const customResult = transform(imageUrl, { crop: "left" })
    expect(unpicResult).toBe(customResult)
  })

  it("clears height from existing query parameters when only width is provided", () => {
    const imageUrl = `${baseUrl}image.jpg?v=1234567&foo=bar&width=200&height=300`
    const customResult = transform(imageUrl, { width: 500 })
    expect(customResult).toBe(`${baseUrl}image.jpg?v=1234567&foo=bar&width=500`)
  })

  it("clears width from existing query parameters when only height is provided", () => {
    const imageUrl = `${baseUrl}image.jpg?v=1234567&foo=bar&width=200&height=300`
    const customResult = transform(imageUrl, { height: 400 })
    expect(customResult).toBe(`${baseUrl}image.jpg?v=1234567&foo=bar&height=400`)
  })

  it("preserves crop from existing query parameters when width and height are provided", () => {
    const imageUrl = `${baseUrl}image.jpg?v=1234567&foo=bar&width=200&height=300&crop=center`
    const customResult = transform(imageUrl, { width: 600, height: 400 })
    expect(customResult).toBe(`${baseUrl}image.jpg?v=1234567&foo=bar&crop=center&width=600&height=400`)
  })
})
