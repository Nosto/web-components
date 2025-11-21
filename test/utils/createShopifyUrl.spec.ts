import { describe, it, expect, beforeEach } from "vitest"
import { createShopifyUrl } from "@/utils/createShopifyUrl"

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

describe("createShopifyUrl", () => {
  beforeEach(() => {
    // Reset window.Shopify before each test
    delete (window as unknown as { Shopify?: unknown }).Shopify
    // Mock window.location.href
    mockLocation()
  })

  it("creates URL with default root when Shopify not available", () => {
    const result = createShopifyUrl("/products/test")
    expect(result.toString()).toBe("https://example.com/products/test")
  })

  it("creates URL with Shopify root when available", () => {
    ;(window as unknown as { Shopify: { routes: { root: string } } }).Shopify = { routes: { root: "/shop/" } }
    const result = createShopifyUrl("/products/test")
    expect(result.toString()).toBe("https://example.com/shop/products/test")
  })

  it("handles empty Shopify routes", () => {
    ;(window as unknown as { Shopify: { routes: Record<string, never> } }).Shopify = { routes: {} }
    const result = createShopifyUrl("/products/test")
    expect(result.toString()).toBe("https://example.com/products/test")
  })

  it("handles null Shopify root", () => {
    ;(window as unknown as { Shopify: { routes: { root: null } } }).Shopify = { routes: { root: null } }
    const result = createShopifyUrl("/products/test")
    expect(result.toString()).toBe("https://example.com/products/test")
  })

  it("creates URL correctly when root has query parameters", () => {
    ;(window as unknown as { Shopify: { routes: { root: string } } }).Shopify = {
      routes: { root: "/en-us/" }
    }
    mockLocation({
      href: "https://example.com?ref=test"
    })
    const result = createShopifyUrl("/products/test")
    expect(result.toString()).toBe("https://example.com/en-us/products/test")
  })
})
