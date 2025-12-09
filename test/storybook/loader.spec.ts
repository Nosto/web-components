import { describe, it, expect, beforeEach } from "vitest"
import { exampleHandlesLoader, exampleProductsLoader } from "@/storybook/loader"
import { clearCache } from "@/storybook/shopify/graphql/getExampleProducts"
import { addHandlers } from "../msw.setup"
import { http, HttpResponse } from "msw"

type GraphQLRequestBody = { query: string; variables: { first: number } }

const shopifyShop = "example-shop.myshopify.com"
const endpoint = `https://${shopifyShop}/api/2025-10/graphql.json`

const createMockResponse = (products: Array<{ handle: string; title: string }>) => ({
  data: {
    products: {
      edges: products.map(product => ({ node: product }))
    }
  }
})

const createMockProducts = (count: number) =>
  Array.from({ length: count }, (_, i) => ({ handle: `product-${i + 1}`, title: `Product ${i + 1}` }))

const setupMockHandler = (
  products: Array<{ handle: string; title: string }>,
  requestBodyCapture?: (body: unknown) => void
) => {
  addHandlers(
    http.post(endpoint, async ({ request }) => {
      if (requestBodyCapture) {
        const body = await request.json()
        requestBodyCapture(body)
        return HttpResponse.json(createMockResponse(products))
      }
      return HttpResponse.json(createMockResponse(products))
    })
  )
}

describe("exampleProductsLoader", () => {
  beforeEach(() => {
    clearCache()
  })

  it("should fetch default amount when count arg not specified", async () => {
    setupMockHandler(createMockProducts(20))

    const result = await exampleProductsLoader({ args: { shopifyShop } })
    expect(result.products).toHaveLength(12) // default count from loader
    expect(result.products[0]).toHaveProperty("handle")
    expect(result.products[0]).toHaveProperty("title")
  })

  it("should use custom count from args when specified", async () => {
    setupMockHandler(createMockProducts(20))

    const result = await exampleProductsLoader({ args: { shopifyShop, count: 10 } })
    expect(result.products).toHaveLength(10)
  })

  it("should request 20 products from GraphQL API but return specified count", async () => {
    let requestBody: unknown = null

    setupMockHandler(createMockProducts(20), body => {
      requestBody = body
    })

    const result = await exampleProductsLoader({
      args: {
        shopifyShop,
        count: 15
      }
    })

    expect(requestBody).not.toBeNull()
    const body = requestBody as GraphQLRequestBody
    expect(body.variables).toEqual({ first: 20 }) // always fetches 20, then slices
    expect(result.products).toHaveLength(15)
  })
})

describe("exampleHandlesLoader", () => {
  beforeEach(() => {
    clearCache()
  })

  it("should return only handle strings", async () => {
    setupMockHandler(createMockProducts(20))

    const result = await exampleHandlesLoader({ args: { shopifyShop } })
    expect(result.handles).toHaveLength(12)
    expect(typeof result.handles[0]).toBe("string")
    expect(result.handles[0]).toBe("product-1")
  })

  it("should use custom count from args", async () => {
    setupMockHandler(createMockProducts(20))

    const result = await exampleHandlesLoader({ args: { shopifyShop, count: 5 } })
    expect(result.handles).toHaveLength(5)
    expect(result.handles).toEqual(["product-1", "product-2", "product-3", "product-4", "product-5"])
  })
})
