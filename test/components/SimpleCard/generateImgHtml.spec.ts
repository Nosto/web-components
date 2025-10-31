import { describe, it, expect } from "vitest"
import { generateImgHtml } from "@/components/SimpleCard/markup"

describe("generateImgHtml", () => {
  it("should generate img HTML with required attributes for non-Shopify image", () => {
    const result = generateImgHtml("image.jpg", "Test Alt", "test-class").html

    expect(result).toContain('alt="Test Alt"')
    expect(result).toContain('class="test-class"')
    expect(result).toContain('sizes="(min-width: 800px) 800px, 100vw"')
    expect(result).toContain('loading="lazy"')
    expect(result).toContain('decoding="async"')
    expect(result).toContain('src="image.jpg"')
    expect(result).toContain('width="800"')
    expect(result).toContain('style="object-fit: cover; max-width: 800px; width: 100%;"')
  })

  it("should generate img HTML with required attributes for Shopify image", () => {
    const src = "https://cdn.shopify.com/s/files/1/1183/1048/products/img.jpg"
    const result = generateImgHtml(src, "Test Alt", "test-class").html

    expect(result).toContain('alt="Test Alt"')
    expect(result).toContain('class="test-class"')
    expect(result).toContain('sizes="(min-width: 800px) 800px, 100vw"')
    expect(result).toContain('loading="lazy"')
    expect(result).toContain('decoding="async"')
    expect(result).toContain(`src="https://cdn.shopify.com/s/files/1/1183/1048/products/img.jpg?width=800"`)
    expect(result).toContain('style="object-fit: cover; max-width: 800px; width: 100%;"')
  })
})
