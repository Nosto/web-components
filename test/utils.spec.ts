import { describe, it, expect, beforeEach } from "vitest"
import { intersectionOf, assertRequired, toCamelCase, createShopifyUrl } from "@/utils"

describe("utils", () => {
  describe("intersectionOf", () => {
    it("returns empty array when no arrays provided", () => {
      expect(intersectionOf()).toEqual([])
    })

    it("returns intersection of two arrays", () => {
      const result = intersectionOf(["a", "b", "c"], ["b", "c", "d"])
      expect(result).toEqual(["b", "c"])
    })

    it("returns intersection of multiple arrays", () => {
      const result = intersectionOf(["a", "b", "c"], ["b", "c", "d"], ["c", "d", "e"])
      expect(result).toEqual(["c"])
    })

    it("returns empty array when no intersection", () => {
      const result = intersectionOf(["a", "b"], ["c", "d"])
      expect(result).toEqual([])
    })

    it("handles single array", () => {
      const result = intersectionOf(["a", "b", "c"])
      expect(result).toEqual(["a", "b", "c"])
    })
  })

  describe("assertRequired", () => {
    it("throws error when required property is undefined", () => {
      const obj = { a: "value", b: undefined }
      expect(() => assertRequired(obj, "b")).toThrow("Property b is required.")
    })

    it("throws error when required property is null", () => {
      const obj = { a: "value", b: null }
      expect(() => assertRequired(obj, "b")).toThrow("Property b is required.")
    })

    it("does not throw when all required properties are present", () => {
      const obj = { a: "value", b: "another value" }
      expect(() => assertRequired(obj, "a", "b")).not.toThrow()
    })

    it("throws error for multiple missing properties", () => {
      const obj = { a: "value", b: undefined, c: null }
      expect(() => assertRequired(obj, "b")).toThrow("Property b is required.")
      expect(() => assertRequired(obj, "c")).toThrow("Property c is required.")
    })
  })

  describe("toCamelCase", () => {
    it("converts kebab-case to camelCase", () => {
      expect(toCamelCase("hello-world")).toBe("helloWorld")
    })

    it("converts multiple dashes", () => {
      expect(toCamelCase("hello-world-test")).toBe("helloWorldTest")
    })

    it("returns same string if no dashes", () => {
      expect(toCamelCase("hello")).toBe("hello")
    })

    it("handles empty string", () => {
      expect(toCamelCase("")).toBe("")
    })

    it("only converts lowercase letters after dash", () => {
      expect(toCamelCase("hello-World")).toBe("hello-World")
    })
  })

  describe("createShopifyUrl", () => {
    beforeEach(() => {
      // Reset window.Shopify before each test
      delete (window as unknown as { Shopify?: unknown }).Shopify
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
      ;(window as unknown as { Shopify: { routes: { root: string } } }).Shopify = { routes: { root: "/shop/" } }
      const result = createShopifyUrl("products/test")
      expect(result.toString()).toBe("https://example.com/shop/products/test")
    })

    it("handles empty Shopify routes", () => {
      ;(window as unknown as { Shopify: { routes: Record<string, never> } }).Shopify = { routes: {} }
      const result = createShopifyUrl("products/test")
      expect(result.toString()).toBe("https://example.com/products/test")
    })

    it("handles null Shopify root", () => {
      ;(window as unknown as { Shopify: { routes: { root: null } } }).Shopify = { routes: { root: null } }
      const result = createShopifyUrl("products/test")
      expect(result.toString()).toBe("https://example.com/products/test")
    })
  })
})
