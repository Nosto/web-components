import { describe, it, expect } from "vitest"
import { transform } from "@/components/Image/bigcommerce"

describe("NostoImage/bigcommerce.transform", () => {
  // Real BigCommerce CDN11 URLs
  const cdn11Base =
    "https://cdn11.bigcommerce.com/s-hm8pjhul3k/products/4055/images/23603/7-15297__04892.1719977920.1280.1280.jpg"
  const cdn11WithParams = cdn11Base + "?c=2"

  const stencilUrl =
    "https://cdn11.bigcommerce.com/s-hm8pjhul3k/images/stencil/{DIMEN}/products/4055/23603/7-15297__04892.1719977920.jpg"
  const stencilUrlWithParams = `${stencilUrl}?c=2`

  it("returns original url if not matching pattern (invalid URL)", () => {
    const invalidUrl = "https://store.example.com/abc/products/123/other/456/image_name.200.300.jpg"
    expect(transform(invalidUrl, { width: 100, height: 100 })).toBe(invalidUrl)
  })

  it("returns original url if already a CDN11 stencil url", () => {
    expect(transform(cdn11Base, { width: 600, height: 300 })).toBe(stencilUrl.replace("{DIMEN}", "600x300"))
    expect(transform(cdn11WithParams, { width: 800, height: 400 })).toBe(
      stencilUrlWithParams.replace("{DIMEN}", "800x400")
    )
  })

  it("returns transformed stencil URL", () => {
    const input = stencilUrlWithParams.replace("{DIMEN}", "300x200")
    const output = stencilUrlWithParams.replace("{DIMEN}", "600x400")
    expect(transform(input, { width: 600, height: 400 })).toBe(output)
  })

  it("supports urls starting with //", () => {
    const input = stencilUrlWithParams.replace("https:", "").replace("{DIMEN}", "300x200")
    const output = stencilUrlWithParams.replace("https:", "").replace("{DIMEN}", "600x400")
    expect(transform(input, { width: 600, height: 400 })).toBe(output)
  })
})
