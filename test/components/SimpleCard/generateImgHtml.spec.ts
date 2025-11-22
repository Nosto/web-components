import { describe, it, expect } from "vitest"
import { generateImgHtml } from "@/components/SimpleCard/markup"
import { ShopifyImage } from "@/shopify/graphql/types"

describe("generateImgHtml", () => {
  function createImage(url: string) {
    return {
      url,
      width: 800,
      height: 800
    } as ShopifyImage
  }

  it("should generate img element with required attributes for non-Shopify image", () => {
    const result = generateImgHtml(createImage("image.jpg"), "Test Alt", "test-class") as HTMLImageElement

    expect(result.alt).toBe("Test Alt")
    expect(result.className).toBe("test-class")
    expect(result.getAttribute("sizes")).toContain("(min-width: 1024px) 25vw")
    expect(result.getAttribute("loading")).toBe("lazy")
    expect(result.getAttribute("decoding")).toBe("async")
    expect(result.src).toContain("image.jpg")
    expect(result.width).toBe(800)
    expect(result.height).toBe(800)
    expect(result.style.objectFit).toBe("cover")
    expect(result.style.maxWidth).toBe("800px")
    expect(result.style.maxHeight).toBe("800px")
    expect(result.style.aspectRatio).toBe("1")
    expect(result.style.width).toBe("100%")
  })

  it("should generate img element with required attributes for Shopify image", () => {
    const src = "https://cdn.shopify.com/s/files/1/1183/1048/products/img.jpg"
    const result = generateImgHtml(createImage(src), "Test Alt", "test-class") as HTMLImageElement

    expect(result.alt).toBe("Test Alt")
    expect(result.className).toBe("test-class")
    expect(result.getAttribute("sizes")).toContain("(min-width: 1024px) 25vw")
    expect(result.getAttribute("loading")).toBe("lazy")
    expect(result.getAttribute("decoding")).toBe("async")
    expect(result.src).toContain("https://cdn.shopify.com/s/files/1/1183/1048/products/img.jpg?width=800")
    expect(result.getAttribute("srcset")).toBeTruthy()
    expect(result.style.objectFit).toBe("cover")
    expect(result.style.maxWidth).toBe("800px")
    expect(result.style.maxHeight).toBe("800px")
    expect(result.style.aspectRatio).toBe("1")
    expect(result.style.width).toBe("100%")
  })
})
