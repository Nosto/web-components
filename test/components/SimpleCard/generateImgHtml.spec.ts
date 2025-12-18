import { describe, it, expect } from "vitest"
import { generateImgHtml } from "@/components/SimpleCard/markup.tsx"
import { ShopifyImage } from "@/shopify/graphql/types"

describe("generateImgHtml", () => {
  function createImage(url: string) {
    return {
      url,
      width: 800,
      height: 800
    } as ShopifyImage
  }

  it("should generate img HTML with required attributes for non-Shopify image", () => {
    const result = generateImgHtml(createImage("image.jpg"), "Test Alt", "test-class").outerHTML

    expect(result).toContain('alt="Test Alt"')
    expect(result).toContain('class="test-class"')
    expect(result).toContain('sizes="(min-width: 1024px) 25vw')
    expect(result).toContain('loading="lazy"')
    expect(result).toContain('decoding="async"')
    expect(result).toContain('src="image.jpg"')
    expect(result).toContain('width="800"')
    expect(result).toContain('height="800"')
    expect(result).toContain("object-fit: cover;")
    expect(result).toContain("max-width: 800px;")
    expect(result).toContain("max-height: 800px;")
    expect(result).toContain("aspect-ratio: 1;")
    expect(result).toContain("width: 100%;")
  })

  it("should generate img HTML with required attributes for Shopify image", () => {
    const src = "https://cdn.shopify.com/s/files/1/1183/1048/products/img.jpg"
    const result = generateImgHtml(createImage(src), "Test Alt", "test-class").outerHTML

    expect(result).toContain('alt="Test Alt"')
    expect(result).toContain('class="test-class"')
    expect(result).toContain('sizes="(min-width: 1024px) 25vw')
    expect(result).toContain('loading="lazy"')
    expect(result).toContain('decoding="async"')
    expect(result).toContain('src="https://cdn.shopify.com/s/files/1/1183/1048/products/img.jpg?width=800')
    expect(result).toContain("srcset=")
    expect(result).toContain("object-fit: cover;")
    expect(result).toContain("max-width: 800px;")
    expect(result).toContain("max-height: 800px;")
    expect(result).toContain("aspect-ratio: 1;")
    expect(result).toContain("width: 100%;")
  })
})
