import { transform } from "@/image/shopify"
import { describe } from "node:test"
import { transform as unpicTransform } from "unpic/providers/shopify"
import { expect, it } from "vitest"

describe("unpic.transformUrl vs custom transform", () => {
  const baseUrl = "https://cdn.shopify.com/s/files/1/1183/1048/products/"

  it("transforms Shopify image URL with dimensions", () => {
    const imageUrl = `${baseUrl}image_200x300.jpg`
    const unpicResult = unpicTransform(imageUrl, { width: 400, height: 500 })
    const customResult = transform({ imageUrl: imageUrl, width: 400, height: 500 })
    expect(unpicResult).toBe(customResult)
  })

  it("transforms Shopify image URL with crop", () => {
    const imageUrl = `${baseUrl}image_200x300.jpg`
    const unpicResult = unpicTransform(imageUrl, { width: 400, height: 500, crop: "center" })
    const customResult = transform({ imageUrl: imageUrl, width: 400, height: 500, crop: "center" })
    expect(unpicResult).toBe(customResult)
  })

  it("merges height in original image URL when only width is supplied", () => {
    const imageUrl = `${baseUrl}image_200x300.jpg`
    const unpicResult = unpicTransform(imageUrl, { width: 400 })
    const customResult = transform({ imageUrl: imageUrl, width: 400 })
    expect(unpicResult).toBe(customResult)
  })

  it("merges width in original image URL when only height is supplied", () => {
    const imageUrl = `${baseUrl}image_200x300.jpg`
    const unpicResult = unpicTransform(imageUrl, { height: 500 })
    const customResult = transform({ imageUrl: imageUrl, height: 500 })
    expect(unpicResult).toBe(customResult)
  })

  it("returns original URL if no dimensions are provided", () => {
    const imageUrl = `${baseUrl}image.jpg`
    const unpicResult = unpicTransform(imageUrl, {})
    const customResult = transform({ imageUrl: imageUrl })
    expect(unpicResult).toBe(customResult)
  })

  it("merges crop in original image URL when crop is provided", () => {
    const imageUrl = `${baseUrl}image_200x300_crop_center.jpg`
    const unpicResult = unpicTransform(imageUrl, { width: 400 })
    const customResult = transform({ imageUrl: imageUrl, width: 400 })
    expect(unpicResult).toBe(customResult)
  })

  it("retains original size parameters if no dimensions are provided", () => {
    const imageUrl = `${baseUrl}image_grande.jpg?foo=bar`
    const unpicResult = unpicTransform(imageUrl, { crop: "left" })
    const customResult = transform({ imageUrl: imageUrl, crop: "left" })
    expect(unpicResult).toBe(customResult)
  })

  it("retains height from existing query parameters when only width is provided", () => {
    const imageUrl = `${baseUrl}image.jpg?v=1234567&foo=bar&width=200&height=300`
    const unpicResult = unpicTransform(imageUrl, { width: 500 })
    const customResult = transform({ imageUrl: imageUrl, width: 500 })
    expect(unpicResult).toBe(customResult)
  })

  it("retains width from existing query parameters when only height is provided", () => {
    const imageUrl = `${baseUrl}image.jpg?v=1234567&foo=bar&width=200&height=300`
    const unpicResult = unpicTransform(imageUrl, { height: 400 })
    const customResult = transform({ imageUrl: imageUrl, height: 400 })
    expect(unpicResult).toBe(customResult)
  })

  it("retains crop from existing query parameters when only width and height is provided", () => {
    const imageUrl = `${baseUrl}image.jpg?v=1234567&foo=bar&width=200&height=300&crop=center`
    const unpicResult = unpicTransform(imageUrl, { width: 600, height: 400 })
    const customResult = transform({ imageUrl: imageUrl, width: 600, height: 400 })
    expect(unpicResult).toBe(customResult)
  })
})
