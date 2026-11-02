import { describe, it, expect, beforeEach } from "vitest"
import { getExampleProducts, clearCache, ExampleProduct } from "@/storybook/shopify/graphql/getExampleProducts"
import { apiVersion } from "@/shopify/graphql/apiVersion"
import { addHandlers } from "../../../msw.setup"
import { http, HttpResponse } from "msw"

type GraphQLRequestBody = { query: string; variables: { first: number } }

describe("getExampleProducts", () => {
  const shopifyShop = "example-shop.myshopify.com"
  const endpoint = `https://${shopifyShop}/api/${apiVersion}/graphql.json`

  const createMockResponse = (products: ExampleProduct[]) => ({
    data: {
      products: {
        edges: products.map(product => ({ node: product }))
      }
    }
  })

  beforeEach(() => {
    clearCache()
  })

  const variants = (...ids: string[]) => ({ nodes: ids.map(id => ({ id })) })

  it("should fetch product handles, titles and first variant ids successfully", async () => {
    addHandlers(
      http.post(endpoint, () => {
        return HttpResponse.json(
          createMockResponse([
            { handle: "product-1", title: "Product 1", variants: variants("gid://shopify/ProductVariant/101") },
            { handle: "product-2", title: "Product 2", variants: variants("gid://shopify/ProductVariant/201") },
            { handle: "product-3", title: "Product 3", variants: variants("gid://shopify/ProductVariant/301") }
          ])
        )
      })
    )

    const products = await getExampleProducts(shopifyShop)
    expect(products).toEqual([
      { handle: "product-1", title: "Product 1", variant: "101" },
      { handle: "product-2", title: "Product 2", variant: "201" },
      { handle: "product-3", title: "Product 3", variant: "301" }
    ])
  })

  it("should leave variant undefined when product has no variants", async () => {
    addHandlers(
      http.post(endpoint, () => {
        return HttpResponse.json(
          createMockResponse([
            { handle: "product-1", title: "Product 1" },
            { handle: "product-2", title: "Product 2", variants: variants() }
          ])
        )
      })
    )

    const products = await getExampleProducts(shopifyShop)
    expect(products).toEqual([
      { handle: "product-1", title: "Product 1", variant: undefined },
      { handle: "product-2", title: "Product 2", variant: undefined }
    ])
  })

  it("should leave variant undefined when variant id is not a valid Shopify gid", async () => {
    addHandlers(
      http.post(endpoint, () => {
        return HttpResponse.json(
          createMockResponse([
            { handle: "product-1", title: "Product 1", variants: variants("not-a-gid") },
            { handle: "product-2", title: "Product 2", variants: variants("gid://other/ProductVariant/1") },
            { handle: "product-3", title: "Product 3", variants: variants("gid://shopify/ProductVariant") }
          ])
        )
      })
    )

    const products = await getExampleProducts(shopifyShop)
    expect(products.map(p => p.variant)).toEqual([undefined, undefined, undefined])
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
    expect(body.query).toContain("variants(first: 1)")
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
})
