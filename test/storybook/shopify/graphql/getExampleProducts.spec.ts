import { describe, it, expect, beforeEach } from "vitest"
import { getExampleProducts, getExampleHandles, clearCache } from "@/storybook/shopify/graphql/getExampleProducts"
import { addHandlers } from "../../../msw.setup"
import { http, HttpResponse } from "msw"

type GraphQLRequestBody = { query: string; variables: { first: number } }

describe("getExampleProducts", () => {
  const shopifyShop = "example-shop.myshopify.com"
  const endpoint = `https://${shopifyShop}/api/2025-10/graphql.json`

  const createMockResponse = (products: Array<{ handle: string; title: string }>) => ({
    data: {
      products: {
        edges: products.map(product => ({ node: product }))
      }
    }
  })

  beforeEach(() => {
    clearCache()
  })

  it("should fetch product handles and titles successfully", async () => {
    addHandlers(
      http.post(endpoint, () => {
        return HttpResponse.json(
          createMockResponse([
            { handle: "product-1", title: "Product 1" },
            { handle: "product-2", title: "Product 2" },
            { handle: "product-3", title: "Product 3" }
          ])
        )
      })
    )

    const products = await getExampleProducts(shopifyShop)
    expect(products).toEqual([
      { handle: "product-1", title: "Product 1" },
      { handle: "product-2", title: "Product 2" },
      { handle: "product-3", title: "Product 3" }
    ])
  })

  it("should throw error when fetch fails with 404", async () => {
    addHandlers(
      http.post(endpoint, () => {
        return HttpResponse.json({ error: "Not Found" }, { status: 404 })
      })
    )

    await expect(getExampleProducts(shopifyShop)).rejects.toThrow(`Failed to fetch ${endpoint}: 404 Not Found`)
  })

  it("should return empty array when products data is missing", async () => {
    addHandlers(
      http.post(endpoint, () => {
        return HttpResponse.json({
          data: {}
        })
      })
    )

    const products = await getExampleProducts(shopifyShop)
    expect(products).toEqual([])
  })

  it("should cache results for the same parameters", async () => {
    let callCount = 0

    addHandlers(
      http.post(endpoint, () => {
        callCount++
        return HttpResponse.json(createMockResponse([{ handle: "product-1", title: "Product 1" }]))
      })
    )

    const result1 = await getExampleProducts(shopifyShop)
    const result2 = await getExampleProducts(shopifyShop)

    expect(result1).toEqual([{ handle: "product-1", title: "Product 1" }])
    expect(result2).toEqual([{ handle: "product-1", title: "Product 1" }])
    expect(callCount).toBe(1)
  })

  it("should clear cache when clearCache is called", async () => {
    let callCount = 0

    addHandlers(
      http.post(endpoint, () => {
        callCount++
        return HttpResponse.json(createMockResponse([{ handle: "product-1", title: "Product 1" }]))
      })
    )

    await getExampleProducts(shopifyShop)
    clearCache()
    await getExampleProducts(shopifyShop)

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
        return HttpResponse.json(createMockResponse([{ handle: "product-1", title: "Product 1" }]))
      })
    )

    await expect(getExampleProducts(shopifyShop)).rejects.toThrow()
    const result = await getExampleProducts(shopifyShop)

    expect(result).toEqual([{ handle: "product-1", title: "Product 1" }])
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

    await getExampleProducts(shopifyShop)

    expect(requestBody).not.toBeNull()
    const body = requestBody as GraphQLRequestBody
    expect(body.query).toContain("query ExampleHandles($first: Int!)")
    expect(body.query).toContain("products(first: $first)")
    expect(body.query).toContain("edges")
    expect(body.query).toContain("node")
    expect(body.query).toContain("handle")
    expect(body.query).toContain("title")
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

    await getExampleProducts(shopifyShop)

    expect(contentType).toBe("application/json")
  })

  describe("getExampleHandles (deprecated wrapper)", () => {
    it("should return only handles from getExampleProducts", async () => {
      addHandlers(
        http.post(endpoint, () => {
          return HttpResponse.json(
            createMockResponse([
              { handle: "product-1", title: "Product 1" },
              { handle: "product-2", title: "Product 2" }
            ])
          )
        })
      )

      const handles = await getExampleHandles(shopifyShop)
      expect(handles).toEqual(["product-1", "product-2"])
    })
  })
})
