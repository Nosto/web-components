import { describe, it, expect, beforeEach } from "vitest"
import { getExampleHandles, clearCache } from "@/shopify/graphql/getExampleHandles"
import { addHandlers } from "../../msw.setup"
import { http, HttpResponse } from "msw"

describe("getExampleHandles", () => {
  const testRoot = "https://example-shop.myshopify.com/"
  const endpoint = `${testRoot}api/2025-10/graphql.json`

  beforeEach(() => {
    clearCache()
  })

  it("should fetch product handles successfully", async () => {
    const mockResponse = {
      data: {
        products: {
          edges: [
            { node: { handle: "product-1" } },
            { node: { handle: "product-2" } },
            { node: { handle: "product-3" } }
          ]
        }
      }
    }

    addHandlers(
      http.post(endpoint, () => {
        return HttpResponse.json(mockResponse)
      })
    )

    const handles = await getExampleHandles(testRoot)
    expect(handles).toEqual(["product-1", "product-2", "product-3"])
  })

  it("should fetch specified amount of product handles", async () => {
    const mockResponse = {
      data: {
        products: {
          edges: [
            { node: { handle: "product-1" } },
            { node: { handle: "product-2" } },
            { node: { handle: "product-3" } },
            { node: { handle: "product-4" } },
            { node: { handle: "product-5" } }
          ]
        }
      }
    }

    addHandlers(
      http.post(endpoint, () => {
        return HttpResponse.json(mockResponse)
      })
    )

    const handles = await getExampleHandles(testRoot, 5)
    expect(handles).toEqual(["product-1", "product-2", "product-3", "product-4", "product-5"])
  })

  it("should use default amount of 12 when not specified", async () => {
    let requestBody: unknown = null

    addHandlers(
      http.post(endpoint, async ({ request }) => {
        requestBody = await request.json()
        return HttpResponse.json({
          data: {
            products: {
              edges: []
            }
          }
        })
      })
    )

    await getExampleHandles(testRoot)

    expect(requestBody).not.toBeNull()
    expect((requestBody as { query: string }).query).toContain("products(first: 12)")
  })

  it("should use custom amount when specified", async () => {
    let requestBody: unknown = null

    addHandlers(
      http.post(endpoint, async ({ request }) => {
        requestBody = await request.json()
        return HttpResponse.json({
          data: {
            products: {
              edges: []
            }
          }
        })
      })
    )

    await getExampleHandles(testRoot, 20)

    expect(requestBody).not.toBeNull()
    expect((requestBody as { query: string }).query).toContain("products(first: 20)")
  })

  it("should throw error when fetch fails with 404", async () => {
    addHandlers(
      http.post(endpoint, () => {
        return HttpResponse.json({ error: "Not Found" }, { status: 404 })
      })
    )

    await expect(getExampleHandles(testRoot)).rejects.toThrow(
      `Failed to fetch example handles from ${endpoint}: 404 Not Found`
    )
  })

  it("should throw error when fetch fails with 500", async () => {
    addHandlers(
      http.post(endpoint, () => {
        return HttpResponse.json({ error: "Server Error" }, { status: 500 })
      })
    )

    await expect(getExampleHandles(testRoot)).rejects.toThrow(
      `Failed to fetch example handles from ${endpoint}: 500 Internal Server Error`
    )
  })

  it("should return empty array when products data is missing", async () => {
    addHandlers(
      http.post(endpoint, () => {
        return HttpResponse.json({
          data: {}
        })
      })
    )

    const handles = await getExampleHandles(testRoot)
    expect(handles).toEqual([])
  })

  it("should return empty array when edges are missing", async () => {
    addHandlers(
      http.post(endpoint, () => {
        return HttpResponse.json({
          data: {
            products: {}
          }
        })
      })
    )

    const handles = await getExampleHandles(testRoot)
    expect(handles).toEqual([])
  })

  it("should cache results for the same parameters", async () => {
    let callCount = 0

    addHandlers(
      http.post(endpoint, () => {
        callCount++
        return HttpResponse.json({
          data: {
            products: {
              edges: [{ node: { handle: "product-1" } }]
            }
          }
        })
      })
    )

    const result1 = await getExampleHandles(testRoot)
    const result2 = await getExampleHandles(testRoot)

    expect(result1).toEqual(["product-1"])
    expect(result2).toEqual(["product-1"])
    expect(callCount).toBe(1)
  })

  it("should maintain separate cache for different roots", async () => {
    const testRoot2 = "https://another-shop.myshopify.com/"
    const endpoint2 = `${testRoot2}api/2025-10/graphql.json`

    addHandlers(
      http.post(endpoint, () => {
        return HttpResponse.json({
          data: {
            products: {
              edges: [{ node: { handle: "product-1" } }]
            }
          }
        })
      }),
      http.post(endpoint2, () => {
        return HttpResponse.json({
          data: {
            products: {
              edges: [{ node: { handle: "product-2" } }]
            }
          }
        })
      })
    )

    const result1 = await getExampleHandles(testRoot)
    const result2 = await getExampleHandles(testRoot2)

    expect(result1).toEqual(["product-1"])
    expect(result2).toEqual(["product-2"])
  })

  it("should maintain separate cache for different amounts", async () => {
    let callCount = 0

    addHandlers(
      http.post(endpoint, () => {
        callCount++
        return HttpResponse.json({
          data: {
            products: {
              edges: [{ node: { handle: "product-1" } }]
            }
          }
        })
      })
    )

    await getExampleHandles(testRoot, 12)
    await getExampleHandles(testRoot, 20)

    expect(callCount).toBe(2)
  })

  it("should clear cache when clearCache is called", async () => {
    let callCount = 0

    addHandlers(
      http.post(endpoint, () => {
        callCount++
        return HttpResponse.json({
          data: {
            products: {
              edges: [{ node: { handle: "product-1" } }]
            }
          }
        })
      })
    )

    await getExampleHandles(testRoot)
    clearCache()
    await getExampleHandles(testRoot)

    expect(callCount).toBe(2)
  })

  it("should remove failed requests from cache", async () => {
    let callCount = 0

    addHandlers(
      http.post(endpoint, () => {
        callCount++
        if (callCount === 1) {
          return HttpResponse.json({ error: "Server Error" }, { status: 500 })
        }
        return HttpResponse.json({
          data: {
            products: {
              edges: [{ node: { handle: "product-1" } }]
            }
          }
        })
      })
    )

    await expect(getExampleHandles(testRoot)).rejects.toThrow()
    const result = await getExampleHandles(testRoot)

    expect(result).toEqual(["product-1"])
    expect(callCount).toBe(2)
  })

  it("should send correct GraphQL query structure", async () => {
    let requestBody: unknown = null

    addHandlers(
      http.post(endpoint, async ({ request }) => {
        requestBody = await request.json()
        return HttpResponse.json({
          data: {
            products: {
              edges: []
            }
          }
        })
      })
    )

    await getExampleHandles(testRoot)

    expect(requestBody).not.toBeNull()
    expect((requestBody as { query: string }).query).toContain("products(first:")
    expect((requestBody as { query: string }).query).toContain("edges")
    expect((requestBody as { query: string }).query).toContain("node")
    expect((requestBody as { query: string }).query).toContain("handle")
  })

  it("should send correct Content-Type header", async () => {
    let contentType: string | null = null

    addHandlers(
      http.post(endpoint, ({ request }) => {
        contentType = request.headers.get("Content-Type")
        return HttpResponse.json({
          data: {
            products: {
              edges: []
            }
          }
        })
      })
    )

    await getExampleHandles(testRoot)

    expect(contentType).toBe("application/json")
  })
})
