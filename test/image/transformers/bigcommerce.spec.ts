import { describe, it, expect } from "vitest"
import { transform } from "@/image/transformers/bigcommerce"

describe("bigcommerce.transform", () => {
  // Real BigCommerce CDN11 URLs
  const cdn11Base =
    "https://cdn11.bigcommerce.com/s-hm8pjhul3k/products/4055/images/23603/7-15297__04892.1719977920.1280.1280.jpg"
  const cdn11WithParams = cdn11Base + "?c=2"

  const stencilUrl =
    "https://cdn11.bigcommerce.com/s-hm8pjhul3k/images/stencil/{DIMEN}/products/4055/23603/7-15297__04892.1719977920.jpg"
  const stencilUrlWithParams = `${stencilUrl}?c=2`

  it("returns original url if not matching pattern (invalid URL)", () => {
    const invalidUrl = "https://store.example.com/abc/products/123/other/456/image_name.200.300.jpg"
    expect(
      transform({
        imageUrl: invalidUrl,
        width: 100,
        height: 100
      })
    ).toBe(invalidUrl)
    expect(transform({ imageUrl: "not-a-url", width: 100, height: 100 })).toBe("not-a-url")
  })

  it("returns original url if already a CDN11 stencil url", () => {
    expect(transform({ imageUrl: cdn11Base, width: 600, height: 300 })).toBe(stencilUrl.replace("{DIMEN}", "600x300"))
    expect(transform({ imageUrl: cdn11WithParams, width: 800, height: 400 })).toBe(
      stencilUrlWithParams.replace("{DIMEN}", "800x400")
    )
  })
})
