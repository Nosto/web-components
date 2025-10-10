import { describe, it, expect } from "vitest"
import { transform } from "@/components/Image/transform"

describe("NostoImage/transform", () => {
  it("throws error for unknown provider", () => {
    const unknownUrl = "https://example.com/images/image.jpg"
    expect(() => transform({ src: unknownUrl, width: 300, height: 400 })).toThrowError(
      "Unsupported image provider for URL: https://example.com/images/image.jpg"
    )
  })

  describe("shopify transform", () => {
    const baseUrl = "https://cdn.shopify.com/s/files/1/0000/0001/products/"
    const imageUrl = `${baseUrl}image_200x300.jpg`

    it("transforms shopify url and returns correct props and style", () => {
      const result = transform({ src: imageUrl, width: 400, height: 200 })
      expect(result.src).toBe(`${baseUrl}image.jpg?width=400&height=200`)
      expect(result.src).toContain("shopify")
      expect(result.srcset).toBeDefined()
      expect(typeof result.style).toBe("object")
    })

    it("handles missing width/height gracefully by using default breakpoint", () => {
      const result = transform({ src: imageUrl })
      expect(result.src).toBe(`${baseUrl}image.jpg?width=320&height=300`)
      expect(result.srcset).toBeDefined()
      expect(result.src).toContain("shopify")
    })

    it("handles width and height correctly", () => {
      const result = transform({ src: imageUrl, width: 300, height: 200 })
      expect(result.src).toBe(`${baseUrl}image.jpg?width=300&height=200`)
      expect(result.srcset).toBeDefined()
      expect(typeof result.style).toBe("object")
    })

    it("generates srcset and applies responsive styles", () => {
      const result = transform({ src: imageUrl, width: 100, height: 200 })
      expect(result.src).toBe(`${baseUrl}image.jpg?width=100&height=200`)
      expect(result.srcset).toBeDefined()
      expect(result.style).toBeDefined()
      expect(result.style.maxWidth).toBe("100%")
      expect(result.style.height).toBe("auto")
    })

    it("preserves existing query params", () => {
      const imageUrlWithParams = `${baseUrl}image_200x300.jpg?foo=bar&baz=qux`
      const result = transform({ src: imageUrlWithParams, width: 120, height: 80 })
      expect(result.src).toBe(`${baseUrl}image.jpg?foo=bar&baz=qux&width=120&height=80`)
      expect(result.src).toContain("foo=bar")
      expect(result.src).toContain("baz=qux")
      expect(result.src).toContain("width=120")
      expect(result.src).toContain("height=80")
    })

    it("handles crop in filename for Shopify images", () => {
      const imageUrlWithCrop = `${baseUrl}image_200x300_crop_center.jpg`
      const result = transform({ src: imageUrlWithCrop, width: 100, height: 200 })
      expect(result.src).toBe(`${baseUrl}image.jpg?width=100&height=200`)
      expect(result.srcset).toBeDefined()
    })

    it("handles named dimensions like master/original", () => {
      const imageUrlMaster = `${baseUrl}image_master.jpg`
      const result = transform({ src: imageUrlMaster })
      expect(result.src).toBe(`${baseUrl}image.jpg?width=320`)
      expect(result.srcset).toBeDefined()
    })

    it("prioritizes provided width/height over named dimensions", () => {
      const imageUrlWithDim = `${baseUrl}image_grande.jpg`
      const result = transform({ src: imageUrlWithDim, width: 500, height: 400 })
      expect(result.src).toBe(`${baseUrl}image.jpg?width=500&height=400`)
      expect(result.srcset).toBeDefined()
    })

    it("handles images with no dimension or crop", () => {
      const imageUrlNoDim = `${baseUrl}image.jpg`
      const result = transform({ src: imageUrlNoDim })
      expect(result.src).toContain("image.jpg")
    })
  })

  describe("bigcommerce transform", () => {
    const bigcommerceUrl =
      "https://cdn11.bigcommerce.com/s-abcde12345/products/123/images/456/7-15297__04892.1719977920.1280.1280.jpg"
    const stencilUrl =
      "https://cdn11.bigcommerce.com/s-abcde12345/images/stencil/{DIMEN}/products/123/456/7-15297__04892.1719977920.jpg"

    it("transforms bigcommerce url and returns correct props and style", () => {
      const result = transform({ src: bigcommerceUrl, width: 650, height: 250 })
      expect(result.src).toBe(stencilUrl.replace("{DIMEN}", "650x250"))
      expect(typeof result.style).toBe("object")
    })

    it("handles only width provided for bigcommerce", () => {
      const result = transform({ src: bigcommerceUrl, width: 500 })
      expect(result.src).toBe(stencilUrl.replace("{DIMEN}", "500x1280"))
      expect(typeof result.style).toBe("object")
    })

    it("handles only height provided for bigcommerce", () => {
      const result = transform({ src: bigcommerceUrl, height: 600 })
      expect(result.src).toBe(stencilUrl.replace("{DIMEN}", "1280x600"))
      expect(typeof result.style).toBe("object")
    })

    it("handles breakpoints with bigcommerce", () => {
      const breakpoints = [200, 400, 800]
      const result = transform({ src: bigcommerceUrl, width: 400, height: 300, breakpoints })

      expect(result.src).toBeDefined()
      expect(result.srcset).toBeDefined()
      expect(typeof result.style).toBe("object")
    })
  })

  describe("alt and sizes attribute handling", () => {
    const shopifyUrl = "https://cdn.shopify.com/s/files/1/0000/0001/products/image.jpg"

    it("passes through alt attribute correctly", () => {
      const altText = "Test image description"
      const result = transform({ src: shopifyUrl, width: 400, height: 300, alt: altText })
      expect(result.alt).toBe(altText)
    })

    it("passes through sizes attribute correctly", () => {
      const sizesValue = "(max-width: 768px) 100vw, 50vw"
      const result = transform({ src: shopifyUrl, width: 400, height: 300, sizes: sizesValue })
      expect(result.sizes).toBe(sizesValue)
    })

    it("passes through breakpoints correctly", () => {
      const breakpoints = [320, 640, 768, 1024, 1280]
      const result = transform({ src: shopifyUrl, width: 400, height: 300, breakpoints })

      // Verify that the transform returns a result (the breakpoints are processed internally by unpic)
      expect(result.src).toBeDefined()
      expect(result.srcset).toBeDefined()
      expect(typeof result.style).toBe("object")
    })

    it("works with breakpoints and other props together", () => {
      const sizesValue = "(max-width: 768px) 100vw, 50vw"
      const breakpoints = [400, 800, 1200]
      const result = transform({
        src: shopifyUrl,
        width: 400,
        height: 300,
        sizes: sizesValue,
        breakpoints,
        alt: "Test image"
      })

      expect(result.sizes).toBe(sizesValue)
      expect(result.alt).toBe("Test image")
      expect(result.src).toBeDefined()
      expect(result.srcset).toBeDefined()
      expect(typeof result.style).toBe("object")
    })
  })
})
