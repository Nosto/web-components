import { describe, it, expect, beforeEach } from "vitest"
import { getShopifyUrl, setShopifyShop, resetShopifyShop } from "@/shopify/getShopifyUrl"

function mockLocation(mockValue: Partial<Location> = {}) {
  Object.defineProperty(window, "location", {
    value: {
      href: "https://example.com",
      origin: "https://example.com",
      ...mockValue
    },
    writable: true
  })
}

describe("getShopifyUrl", () => {
  beforeEach(() => {
    // Reset window.Shopify before each test
    delete (window as unknown as { Shopify?: unknown }).Shopify
    // Reset shopifyShop to ensure test isolation
    resetShopifyShop()
    // Mock window.location.href
    mockLocation()
  })

  it("creates URL with default root when Shopify not available", () => {
    const result = getShopifyUrl("/products/test")
    expect(result.toString()).toBe("https://example.com/products/test")
  })

  it("creates URL with Shopify root when available", () => {
    window.Shopify = { routes: { root: "/shop/" } }
    const result = getShopifyUrl("/products/test")
    expect(result.toString()).toBe("https://example.com/shop/products/test")
  })

  it("handles empty Shopify routes", () => {
    window.Shopify = { routes: {} }
    const result = getShopifyUrl("/products/test")
    expect(result.toString()).toBe("https://example.com/products/test")
  })

  it("handles null Shopify root", () => {
    // @ts-expect-error Testing null root
    window.Shopify = { routes: { root: null } }
    const result = getShopifyUrl("/products/test")
    expect(result.toString()).toBe("https://example.com/products/test")
  })

  it("creates URL correctly when root has query parameters", () => {
    window.Shopify = {
      routes: { root: "/en-us/" }
    }
    mockLocation({
      href: "https://example.com?ref=test"
    })
    const result = getShopifyUrl("/products/test")
    expect(result.toString()).toBe("https://example.com/en-us/products/test")
  })

  it("uses setShopifyShop to override hostname", () => {
    window.Shopify = {
      routes: { root: "/shop/" }
    }
    setShopifyShop("my-test-store.myshopify.com")
    mockLocation({
      hostname: "localhost"
    })
    const result = getShopifyUrl("/products/test")
    expect(result.toString()).toBe("https://my-test-store.myshopify.com/shop/products/test")
  })
})
