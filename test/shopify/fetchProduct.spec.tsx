/** @jsx createElement */
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest"
import { fetchProduct, clearProductCache } from "@/shopify/graphql/fetchProduct"
import { addHandlers } from "../msw.setup"
import { http, HttpResponse } from "msw"
import { getApiUrl } from "@/shopify/graphql/constants"
import type { ShopifyProduct } from "@/shopify/graphql/types"

describe("fetchProduct", () => {
  beforeEach(() => {
    clearProductCache()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const mockProduct1: ShopifyProduct = {
    id: "gid://shopify/Product/1",
    title: "Product 1",
    vendor: "Vendor 1",
    description: "Description 1",
    encodedVariantExistence: "",
    onlineStoreUrl: "/products/product-1",
    availableForSale: true,
    adjacentVariants: [],
    images: [
      {
        altText: "Image 1",
        height: 400,
        width: 400,
        thumbhash: null,
        url: "https://example.com/image1.jpg"
      }
    ],
    featuredImage: {
      altText: "Image 1",
      height: 400,
      width: 400,
      thumbhash: null,
      url: "https://example.com/image1.jpg"
    },
    options: [],
    price: { currencyCode: "USD", amount: "10.00" },
    compareAtPrice: null,
    variants: []
  }

  const mockProduct2: ShopifyProduct = {
    id: "gid://shopify/Product/2",
    title: "Product 2",
    vendor: "Vendor 2",
    description: "Description 2",
    encodedVariantExistence: "",
    onlineStoreUrl: "/products/product-2",
    availableForSale: true,
    adjacentVariants: [],
    images: [
      {
        altText: "Image 2",
        height: 400,
        width: 400,
        thumbhash: null,
        url: "https://example.com/image2.jpg"
      }
    ],
    featuredImage: {
      altText: "Image 2",
      height: 400,
      width: 400,
      thumbhash: null,
      url: "https://example.com/image2.jpg"
    },
    options: [],
    price: { currencyCode: "USD", amount: "20.00" },
    compareAtPrice: null,
    variants: []
  }

  const mockProduct3: ShopifyProduct = {
    id: "gid://shopify/Product/3",
    title: "Product 3",
    vendor: "Vendor 3",
    description: "Description 3",
    encodedVariantExistence: "",
    onlineStoreUrl: "/products/product-3",
    availableForSale: true,
    adjacentVariants: [],
    images: [
      {
        altText: "Image 3",
        height: 400,
        width: 400,
        thumbhash: null,
        url: "https://example.com/image3.jpg"
      }
    ],
    featuredImage: {
      altText: "Image 3",
      height: 400,
      width: 400,
      thumbhash: null,
      url: "https://example.com/image3.jpg"
    },
    options: [],
    price: { currencyCode: "USD", amount: "30.00" },
    compareAtPrice: null,
    variants: []
  }

  function wrapProduct(product: ShopifyProduct, handle: string) {
    return {
      ...product,
      handle,
      images: { nodes: product.images }
    }
  }

  function setupBatchProductHandler(products: Record<string, ShopifyProduct>) {
    const graphqlPath = getApiUrl().pathname

    addHandlers(
      http.post(graphqlPath, async ({ request }) => {
        const body = (await request.json()) as {
          query: string
          variables: { query?: string; handle?: string; first?: number }
        }

        // Check if this is a single product query
        if (body.query.includes("ProductByHandle") && body.variables.handle) {
          const handle = body.variables.handle
          const product = products[handle]

          if (!product) {
            return HttpResponse.json({ data: { product: null } })
          }

          return HttpResponse.json({
            data: {
              product: wrapProduct(product, handle)
            }
          })
        }

        // Check if this is a batch query with products query
        if (body.query.includes("ProductsByHandles") && body.variables.query) {
          // Parse the query string to extract handles
          const handleMatches = body.variables.query.match(/handle:([^\s)]+)/g)
          const requestedHandles = handleMatches ? handleMatches.map(m => m.replace("handle:", "")) : []

          const nodes = requestedHandles
            .map(handle => (products[handle] ? wrapProduct(products[handle], handle) : null))
            .filter((p): p is ReturnType<typeof wrapProduct> => p !== null)

          return HttpResponse.json({ data: { products: { nodes } } })
        }

        return HttpResponse.json({ errors: [{ message: "Invalid query" }] }, { status: 400 })
      })
    )
  }

  it("should fetch a single product", async () => {
    setupBatchProductHandler({
      "product-1": mockProduct1
    })

    const product = await fetchProduct("product-1")

    expect(product.id).toBe("gid://shopify/Product/1")
    expect(product.title).toBe("Product 1")
  })

  it("should batch multiple product requests into a single GraphQL call", async () => {
    const fetchSpy = vi.spyOn(global, "fetch")

    setupBatchProductHandler({
      "product-1": mockProduct1,
      "product-2": mockProduct2,
      "product-3": mockProduct3
    })

    // Request multiple products at the same time
    const promises = [fetchProduct("product-1"), fetchProduct("product-2"), fetchProduct("product-3")]

    const [product1, product2, product3] = await Promise.all(promises)

    // Verify products were fetched correctly
    expect(product1.title).toBe("Product 1")
    expect(product2.title).toBe("Product 2")
    expect(product3.title).toBe("Product 3")

    // Wait for any pending requests to complete
    await new Promise(resolve => setTimeout(resolve, 50))

    // Verify only one fetch call was made (batch request)
    expect(fetchSpy).toHaveBeenCalledTimes(1)

    // Verify the batch query was used
    const fetchCall = fetchSpy.mock.calls[0]
    const requestBody = JSON.parse(fetchCall[1]?.body as string)
    expect(requestBody.query).toContain("ProductsByHandles")
  })

  it("should deduplicate requests for the same product handle", async () => {
    const fetchSpy = vi.spyOn(global, "fetch")

    setupBatchProductHandler({
      "product-1": mockProduct1
    })

    // Request the same product multiple times
    const promises = [fetchProduct("product-1"), fetchProduct("product-1"), fetchProduct("product-1")]

    const [product1, product2, product3] = await Promise.all(promises)

    // All should return the same product
    expect(product1.title).toBe("Product 1")
    expect(product2.title).toBe("Product 1")
    expect(product3.title).toBe("Product 1")

    // Wait for any pending requests
    await new Promise(resolve => setTimeout(resolve, 50))

    // Should only make one request even with deduplication
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it("should handle single product request using single product query", async () => {
    const fetchSpy = vi.spyOn(global, "fetch")

    setupBatchProductHandler({
      "product-1": mockProduct1
    })

    const product = await fetchProduct("product-1")

    expect(product.title).toBe("Product 1")

    // Wait for any pending requests
    await new Promise(resolve => setTimeout(resolve, 50))

    // Should use single product query for single product
    expect(fetchSpy).toHaveBeenCalledTimes(1)
    const fetchCall = fetchSpy.mock.calls[0]
    const requestBody = JSON.parse(fetchCall[1]?.body as string)
    expect(requestBody.query).toContain("ProductByHandle")
  })

  it("should use cache for subsequent requests", async () => {
    const fetchSpy = vi.spyOn(global, "fetch")

    setupBatchProductHandler({
      "product-1": mockProduct1
    })

    // First request
    const product1 = await fetchProduct("product-1")
    expect(product1.title).toBe("Product 1")

    // Second request should use cache
    const product2 = await fetchProduct("product-1")
    expect(product2.title).toBe("Product 1")

    // Wait for any pending requests
    await new Promise(resolve => setTimeout(resolve, 50))

    // Should only fetch once due to caching
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it("should handle errors for individual products in batch", async () => {
    setupBatchProductHandler({
      "product-1": mockProduct1,
      "product-2": mockProduct2
      // product-3 missing - will return null from server
    })

    const promises = [fetchProduct("product-1"), fetchProduct("product-2"), fetchProduct("product-3")]

    // First two should succeed, third should fail
    const results = await Promise.allSettled(promises)

    expect(results[0].status).toBe("fulfilled")
    expect((results[0] as PromiseFulfilledResult<ShopifyProduct>).value.title).toBe("Product 1")

    expect(results[1].status).toBe("fulfilled")
    expect((results[1] as PromiseFulfilledResult<ShopifyProduct>).value.title).toBe("Product 2")

    expect(results[2].status).toBe("rejected")
    expect((results[2] as PromiseRejectedResult).reason.message).toContain("Product not found")
  })

  it("should handle network errors", async () => {
    const graphqlPath = getApiUrl().pathname

    addHandlers(
      http.post(graphqlPath, () => {
        return HttpResponse.json({ error: "Network error" }, { status: 500 })
      })
    )

    await expect(fetchProduct("product-1")).rejects.toThrow("Failed to fetch product data")
  })

  it("should batch requests made in separate frames differently", async () => {
    const fetchSpy = vi.spyOn(global, "fetch")

    setupBatchProductHandler({
      "product-1": mockProduct1,
      "product-2": mockProduct2
    })

    // First batch
    const product1Promise = fetchProduct("product-1")

    // Wait for the first batch to complete
    await product1Promise
    await new Promise(resolve => setTimeout(resolve, 50))

    // Second batch in a different frame
    const product2Promise = fetchProduct("product-2")
    await product2Promise

    // Should have made two separate requests (one for each frame)
    expect(fetchSpy).toHaveBeenCalledTimes(2)
  })

  it("should handle up to 10 products in a single batch", async () => {
    const fetchSpy = vi.spyOn(global, "fetch")

    const products: Record<string, ShopifyProduct> = {}
    for (let i = 1; i <= 10; i++) {
      products[`product-${i}`] = {
        ...mockProduct1,
        id: `gid://shopify/Product/${i}`,
        title: `Product ${i}`
      }
    }

    setupBatchProductHandler(products)

    const promises = Object.keys(products).map(handle => fetchProduct(handle))
    const results = await Promise.all(promises)

    // Verify all products were fetched
    expect(results).toHaveLength(10)
    for (let i = 0; i < 10; i++) {
      expect(results[i].title).toBe(`Product ${i + 1}`)
    }

    // Wait for any pending requests
    await new Promise(resolve => setTimeout(resolve, 50))

    // Should make only one batch request
    expect(fetchSpy).toHaveBeenCalledTimes(1)
    const fetchCall = fetchSpy.mock.calls[0]
    const requestBody = JSON.parse(fetchCall[1]?.body as string)
    expect(requestBody.query).toContain("ProductsByHandles")
  })

  it("should clear cache when clearProductCache is called", async () => {
    const fetchSpy = vi.spyOn(global, "fetch")

    setupBatchProductHandler({
      "product-1": mockProduct1
    })

    // First request
    await fetchProduct("product-1")

    // Clear cache
    clearProductCache()

    // Second request should fetch again
    await fetchProduct("product-1")

    // Wait for any pending requests
    await new Promise(resolve => setTimeout(resolve, 50))

    // Should fetch twice
    expect(fetchSpy.mock.calls.length).toBeGreaterThanOrEqual(2)
  })
})
