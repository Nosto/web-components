import { describe, it, expect, beforeEach } from "vitest"
import { addProductHandlers } from "./addProductHandlers"
import { clearProductCache, fetchProduct } from "@/shopify/graphql/fetchProduct"
import { mockSimpleCardProduct } from "@/mock/products"
import type { ShopifyProduct } from "@/shopify/graphql/types"

describe("addProductHandlers", () => {
  beforeEach(() => {
    clearProductCache()
  })

  it("should mock product responses for GraphQL requests", async () => {
    addProductHandlers({
      "test-product": { product: mockSimpleCardProduct }
    })

    const result = await fetchProduct("test-product")

    expect(result).toBeDefined()
    expect(result.title).toBe("Awesome Test Product")
    expect(result.vendor).toBe("Test Brand")
  })

  it("should handle multiple product mocks", async () => {
    const product1: ShopifyProduct = { ...mockSimpleCardProduct, title: "Product 1" }
    const product2: ShopifyProduct = { ...mockSimpleCardProduct, title: "Product 2" }

    addProductHandlers({
      "product-1": { product: product1 },
      "product-2": { product: product2 }
    })

    const result1 = await fetchProduct("product-1")
    const result2 = await fetchProduct("product-2")

    expect(result1.title).toBe("Product 1")
    expect(result2.title).toBe("Product 2")
  })

  it("should return 404 for unmocked products", async () => {
    addProductHandlers({
      "existing-product": { product: mockSimpleCardProduct }
    })

    await expect(fetchProduct("nonexistent-product")).rejects.toThrow()
  })

  it("should handle custom status codes", async () => {
    addProductHandlers({
      "error-product": { status: 500 }
    })

    await expect(fetchProduct("error-product")).rejects.toThrow()
  })

  it("should support product as ProductHandlerResponse", async () => {
    // Test that the function handles a ShopifyProduct treated as ProductHandlerResponse
    const response = mockSimpleCardProduct as ProductHandlerResponse
    addProductHandlers({
      "test-product": response
    })

    const result = await fetchProduct("test-product")

    expect(result).toBeDefined()
    expect(result.title).toBe("Awesome Test Product")
  })
})
