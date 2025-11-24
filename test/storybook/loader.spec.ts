import { describe, it, expect, beforeEach } from "vitest"
import { exampleHandlesLoader } from "@/storybook/loader"
import { clearCache } from "@/storybook/shopify/graphql/getExampleHandles"
import { addHandlers } from "../msw.setup"
import { http, HttpResponse } from "msw"

type GraphQLRequestBody = { query: string; variables: { first: number } }

describe("exampleHandlesLoader", () => {
  const shopifyShop = "example-shop.myshopify.com"
  const endpoint = `https://${shopifyShop}/api/2025-10/graphql.json`

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

  it("should fetch default amount when count arg not specified", async () => {
    addHandlers(
      http.post(endpoint, () => {
        return HttpResponse.json(createMockResponse(Array.from({ length: 20 }, (_, i) => `product-${i + 1}`)))
      })
    )

    const result = await exampleHandlesLoader({ args: { root: shopifyShop } })
    expect(result.handles).toHaveLength(12) // default count from loader
  })

  it("should use custom count from args when specified", async () => {
    addHandlers(
      http.post(endpoint, () => {
        return HttpResponse.json(createMockResponse(Array.from({ length: 20 }, (_, i) => `product-${i + 1}`)))
      })
    )

    const result = await exampleHandlesLoader({ args: { root: shopifyShop, count: 10 } })
    expect(result.handles).toHaveLength(10)
  })

  it("should request 20 products from GraphQL API but return specified count", async () => {
    let requestBody: unknown = null

    addHandlers(
      http.post(endpoint, async ({ request }) => {
        requestBody = await request.json()
        return HttpResponse.json(createMockResponse(Array.from({ length: 20 }, (_, i) => `product-${i + 1}`)))
      })
    )

    const result = await exampleHandlesLoader({
      args: {
        root: shopifyShop,
        count: 15
      }
    })

    expect(requestBody).not.toBeNull()
    const body = requestBody as GraphQLRequestBody
    expect(body.variables).toEqual({ first: 20 }) // always fetches 20, then slices
    expect(result.handles).toHaveLength(15)
  })
})
