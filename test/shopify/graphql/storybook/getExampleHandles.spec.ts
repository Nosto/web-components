import { describe, it, expect, beforeEach } from "vitest"
import { getExampleHandles, clearCache } from "@/shopify/graphql/storybook/getExampleHandles"
import { addHandlers } from "../../../msw.setup"
import { http, HttpResponse } from "msw"

type GraphQLRequestBody = { query: string; variables: { first: number } }

describe("getExampleHandles", () => {
  const shopifyTestBaseUrl = "https://example-shop.myshopify.com/"
  const endpoint = `${shopifyTestBaseUrl}api/2025-10/graphql.json`

  const createMockResponse = (handles: string[]) => ({
    data: {
      products: {
        edges: handles.map(handle => ({ node: { handle } }))
      }
    }
  })

  beforeEach(() => {
    clearCache()
  })

  it("should fetch product handles successfully", async () => {
    addHandlers(
      http.post(endpoint, () => {
        return HttpResponse.json(createMockResponse(["product-1", "product-2", "product-3"]))
      })
    )

    const handles = await getExampleHandles(shopifyTestBaseUrl)
    expect(handles).toEqual(["product-1", "product-2", "product-3"])
  })

  it("should fetch specified amount of product handles", async () => {
    addHandlers(
      http.post(endpoint, () => {
        return HttpResponse.json(createMockResponse(["product-1", "product-2", "product-3", "product-4", "product-5"]))
      })
    )

    const handles = await getExampleHandles(shopifyTestBaseUrl, 5)
    expect(handles).toEqual(["product-1", "product-2", "product-3", "product-4", "product-5"])
  })

  it("should fetch all 20 products when count not specified", async () => {
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

    await getExampleHandles(shopifyTestBaseUrl)

    expect(requestBody).not.toBeNull()
    const body = requestBody as GraphQLRequestBody
    expect(body.variables).toEqual({ first: 20 })
    expect(body.query).toContain("$first: Int!")
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

    await getExampleHandles(shopifyTestBaseUrl)

    expect(requestBody).not.toBeNull()
    const body = requestBody as GraphQLRequestBody
    expect(body.variables).toEqual({ first: 20 })
    expect(body.query).toContain("$first: Int!")
  })

  it("should throw error when fetch fails with 404", async () => {
    addHandlers(
      http.post(endpoint, () => {
        return HttpResponse.json({ error: "Not Found" }, { status: 404 })
      })
    )

    await expect(getExampleHandles(shopifyTestBaseUrl)).rejects.toThrow(
      `Failed to fetch example handles from ${endpoint}: 404 Not Found`
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

    const handles = await getExampleHandles(shopifyTestBaseUrl)
    expect(handles).toEqual([])
  })

  it("should cache results for the same parameters", async () => {
    let callCount = 0

    addHandlers(
      http.post(endpoint, () => {
        callCount++
        return HttpResponse.json(createMockResponse(["product-1"]))
      })
    )

    const result1 = await getExampleHandles(shopifyTestBaseUrl)
    const result2 = await getExampleHandles(shopifyTestBaseUrl)

    expect(result1).toEqual(["product-1"])
    expect(result2).toEqual(["product-1"])
    expect(callCount).toBe(1)
  })

  it("should clear cache when clearCache is called", async () => {
    let callCount = 0

    addHandlers(
      http.post(endpoint, () => {
        callCount++
        return HttpResponse.json(createMockResponse(["product-1"]))
      })
    )

    await getExampleHandles(shopifyTestBaseUrl)
    clearCache()
    await getExampleHandles(shopifyTestBaseUrl)

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
        return HttpResponse.json(createMockResponse(["product-1"]))
      })
    )

    await expect(getExampleHandles(shopifyTestBaseUrl)).rejects.toThrow()
    const result = await getExampleHandles(shopifyTestBaseUrl)

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

    await getExampleHandles(shopifyTestBaseUrl)

    expect(requestBody).not.toBeNull()
    const body = requestBody as GraphQLRequestBody
    expect(body.query).toContain("query ExampleHandles($first: Int!)")
    expect(body.query).toContain("products(first: $first)")
    expect(body.query).toContain("edges")
    expect(body.query).toContain("node")
    expect(body.query).toContain("handle")
    expect(body.variables).toEqual({ first: 20 })
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

    await getExampleHandles(shopifyTestBaseUrl)

    expect(contentType).toBe("application/json")
  })
})
