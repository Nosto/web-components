import { describe, it, expect, beforeEach } from "vitest"
import { createShopifyUrl } from "@/utils/shopify"

describe("shopify utils", () => {
  describe("createShopifyUrl", () => {
    beforeEach(() => {
      // Reset window.Shopify before each test
      // @ts-expect-error - Deleting property that may not exist for test cleanup
      delete window.Shopify
      // Mock window.location.href
      Object.defineProperty(window, "location", {
        value: { href: "https://example.com" },
        writable: true
      })
    })

    it("creates URL with default root when Shopify not available", () => {
      const result = createShopifyUrl("products/test")
      expect(result.toString()).toBe("https://example.com/products/test")
    })

    it("creates URL with Shopify root when available", () => {
      // @ts-expect-error - Assigning to global window object for testing
      window.Shopify = { routes: { root: "/shop/" } }
      const result = createShopifyUrl("products/test")
      expect(result.toString()).toBe("https://example.com/shop/products/test")
    })

    it("handles empty Shopify routes", () => {
      // @ts-expect-error - Assigning to global window object for testing
      window.Shopify = { routes: {} }
      const result = createShopifyUrl("products/test")
      expect(result.toString()).toBe("https://example.com/products/test")
    })

    it("handles null Shopify root", () => {
      // @ts-expect-error - Assigning to global window object for testing
      window.Shopify = { routes: { root: null } }
      const result = createShopifyUrl("products/test")
      expect(result.toString()).toBe("https://example.com/products/test")
    })
  })
})
