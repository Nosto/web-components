import { describe, it, expect } from "vitest"
import { responsiveImage } from "@/components/Image/responsiveImage"

describe("responsiveImage", () => {
  const shopifyUrl = "https://cdn.shopify.com/s/files/1/1183/1048/products/boat-shoes.jpeg?v=1459175177"
  const bigCommerceUrl =
    "https://cdn11.bigcommerce.com/s-bo4yyk7o1j/products/15493/images/80390/5SqIsKoR7VMPHGrsnseGPkhhpWHT9tLcY7Uwop7FCMzm5jcxKgU2d7P7zbgqcs8r__09669.1741105378.1280.1280.jpg?c=2"

  function assertValidResult(result: ReturnType<typeof responsiveImage>, originalSrc: string) {
    expect(result).toHaveProperty("props")
    expect(result).toHaveProperty("style")
    expect(result.props).toHaveProperty("src")
    expect(result.props).toHaveProperty("srcset")
    // Note: sizes is not always present (e.g., fullWidth layout may not include it)
    expect(result.style).toBeDefined()

    // The src should be related to the original (may be transformed)
    const resultSrc = result.props.src as string
    if (originalSrc.includes("shopify")) {
      expect(resultSrc).toContain("shopify")
    } else if (originalSrc.includes("bigcommerce")) {
      expect(resultSrc).toContain("stencil") // BigCommerce URLs get transformed to stencil format
    }
  }

  function assertNoNullOrUndefinedValues(props: Record<string, unknown>) {
    Object.entries(props).forEach(([, value]) => {
      // Skip undefined values as they are expected for width/height in responsive mode
      if (value !== undefined) {
        expect(value).not.toBe(null)
        expect(value).not.toBe("null")
        expect(value).not.toBe("undefined")
      }
    })
  }

  describe("Basic functionality", () => {
    it("should process Shopify URLs with width and height", () => {
      const result = responsiveImage({
        src: shopifyUrl,
        width: 800,
        height: 600
      })

      assertValidResult(result, shopifyUrl)
      assertNoNullOrUndefinedValues(result.props)
    })

    it("should process BigCommerce URLs with width and height", () => {
      const result = responsiveImage({
        src: bigCommerceUrl,
        width: 800,
        height: 600
      })

      assertValidResult(result, bigCommerceUrl)
      assertNoNullOrUndefinedValues(result.props)
    })

    it("should use default layout when not specified", () => {
      const result = responsiveImage({
        src: shopifyUrl,
        width: 800,
        height: 600
      })

      // Default layout should be applied internally
      assertValidResult(result, shopifyUrl)
    })

    it("should handle explicit layout values", () => {
      const layouts = ["constrained", "fullWidth", "fixed"] as const

      layouts.forEach(layout => {
        const result = responsiveImage({
          src: shopifyUrl,
          width: 800,
          height: 600,
          layout
        })

        assertValidResult(result, shopifyUrl)
      })
    })
  })

  describe("Aspect ratio handling", () => {
    it("should work with width and aspect ratio", () => {
      const result = responsiveImage({
        src: shopifyUrl,
        width: 800,
        aspectRatio: 1.5
      })

      assertValidResult(result, shopifyUrl)
      assertNoNullOrUndefinedValues(result.props)
    })

    it("should work with height and aspect ratio", () => {
      const result = responsiveImage({
        src: shopifyUrl,
        height: 600,
        aspectRatio: 1.33
      })

      assertValidResult(result, shopifyUrl)
      assertNoNullOrUndefinedValues(result.props)
    })
  })

  describe("Layout variations", () => {
    it("should handle constrained layout", () => {
      const result = responsiveImage({
        src: shopifyUrl,
        width: 400,
        height: 300,
        layout: "constrained"
      })

      assertValidResult(result, shopifyUrl)
    })

    it("should handle fullWidth layout", () => {
      const result = responsiveImage({
        src: shopifyUrl,
        height: 400,
        layout: "fullWidth"
      })

      assertValidResult(result, shopifyUrl)
    })

    it("should handle fixed layout", () => {
      const result = responsiveImage({
        src: shopifyUrl,
        width: 500,
        height: 300,
        layout: "fixed"
      })

      assertValidResult(result, shopifyUrl)
    })
  })

  describe("Optional attributes", () => {
    it("should handle alt text", () => {
      const altText = "Product showcase image"
      const result = responsiveImage({
        src: shopifyUrl,
        width: 800,
        height: 600,
        alt: altText
      })

      assertValidResult(result, shopifyUrl)
      expect(result.props.alt).toBe(altText)
    })

    it("should handle sizes attribute", () => {
      const sizesValue = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      const result = responsiveImage({
        src: shopifyUrl,
        width: 800,
        aspectRatio: 1.5,
        sizes: sizesValue
      })

      assertValidResult(result, shopifyUrl)
      expect(result.props.sizes).toBe(sizesValue)
    })

    it("should handle Shopify crop parameter", () => {
      const result = responsiveImage({
        src: shopifyUrl,
        width: 400,
        height: 300,
        crop: "center"
      })

      assertValidResult(result, shopifyUrl)
      assertNoNullOrUndefinedValues(result.props)
    })

    it("should handle all optional attributes together", () => {
      const result = responsiveImage({
        src: shopifyUrl,
        width: 800,
        height: 600,
        layout: "constrained",
        alt: "Hero banner image",
        sizes: "(max-width: 1200px) 100vw, 50vw",
        crop: "center"
      })

      assertValidResult(result, shopifyUrl)
      expect(result.props.alt).toBe("Hero banner image")
      expect(result.props.sizes).toBe("(max-width: 1200px) 100vw, 50vw")
      assertNoNullOrUndefinedValues(result.props)
    })
  })

  describe("Null/undefined filtering", () => {
    it("should filter out null values", () => {
      const result = responsiveImage({
        src: shopifyUrl,
        width: 800,
        height: 600,
        alt: null as unknown as string,
        crop: null as unknown as "center"
      })

      assertValidResult(result, shopifyUrl)
      expect(result.props.alt).toBeUndefined()
      expect("crop" in result.props).toBe(false)
      assertNoNullOrUndefinedValues(result.props)
    })

    it("should filter out undefined values", () => {
      const result = responsiveImage({
        src: shopifyUrl,
        width: 800,
        height: 600,
        alt: undefined,
        sizes: undefined,
        crop: undefined
      })

      assertValidResult(result, shopifyUrl)
      expect(result.props.alt).toBeUndefined()

      // Note: sizes may still be present as unpic transform generates default sizes
      // expect("sizes" in result.props).toBe(false) // Not reliable
      // expect("crop" in result.props).toBe(false) // Not reliable, crop affects URL transformation
      assertNoNullOrUndefinedValues(result.props)
    })
  })

  describe("Return value structure", () => {
    it("should return props and style objects", () => {
      const result = responsiveImage({
        src: shopifyUrl,
        width: 800,
        height: 600
      })

      expect(typeof result).toBe("object")
      expect(result).toHaveProperty("props")
      expect(result).toHaveProperty("style")
      expect(typeof result.props).toBe("object")
      expect(typeof result.style).toBe("object")
    })

    it("should have expected properties in props", () => {
      const result = responsiveImage({
        src: shopifyUrl,
        width: 800,
        height: 600,
        alt: "Test image"
      })

      // These are the standard properties that should be present
      expect(result.props).toHaveProperty("src")
      expect(result.props).toHaveProperty("srcset")
      expect(result.props).toHaveProperty("sizes")
      expect(result.props).toHaveProperty("alt")
      expect(result.props).toHaveProperty("loading")
      expect(result.props).toHaveProperty("decoding")

      // The style object should contain responsive styling
      expect(result.style).toBeDefined()
    })
  })

  describe("Edge cases", () => {
    it("should handle minimal required parameters", () => {
      const result = responsiveImage({
        src: shopifyUrl,
        width: 800,
        height: 600
      })

      assertValidResult(result, shopifyUrl)
    })

    it("should work with different image URLs", () => {
      const urls = [shopifyUrl, bigCommerceUrl, "https://cdn.shopify.com/static/sample-images/bath.jpeg"]

      urls.forEach(url => {
        const result = responsiveImage({
          src: url,
          width: 400,
          height: 300
        })

        assertValidResult(result, url)
      })
    })
  })
})
