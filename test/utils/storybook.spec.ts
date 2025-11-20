import { describe, it, expect, beforeEach } from "vitest"
import { exampleHandlesLoader, updateShopifyRoot } from "@/utils/storybook"
import { clearExampleHandlesCache } from "@/shopify/graphql/getExampleHandles"
import { addHandlers } from "../msw.setup"
import { http, HttpResponse } from "msw"

describe("storybook utilities", () => {
  describe("updateShopifyRoot", () => {
    it("should update window.Shopify.routes.root", () => {
      const testRoot = "https://test-store.myshopify.com/"
      updateShopifyRoot(testRoot)
      expect(window.Shopify?.routes?.root).toBe(testRoot)
    })
  })

  describe("exampleHandlesLoader", () => {
    const defaultRoot = "https://default-store.myshopify.com/"
    const endpoint = `${defaultRoot}api/2025-10/graphql.json`

    const createMockResponse = (handles: string[]) => ({
      data: {
        products: {
          edges: handles.map(handle => ({ node: { handle } }))
        }
      }
    })

    beforeEach(() => {
      clearExampleHandlesCache()
    })

    it("should fetch handles using default root when no root arg provided", async () => {
      addHandlers(
        http.post(endpoint, () => {
          return HttpResponse.json(createMockResponse(["product-1", "product-2"]))
        })
      )

      const context = { args: {} }
      const result = await exampleHandlesLoader(context, defaultRoot)

      expect(result.handles).toEqual(["product-1", "product-2"])
    })

    it("should use root from args when provided", async () => {
      const customRoot = "https://custom-store.myshopify.com/"
      const customEndpoint = `${customRoot}api/2025-10/graphql.json`

      addHandlers(
        http.post(customEndpoint, () => {
          return HttpResponse.json(createMockResponse(["custom-product"]))
        })
      )

      const context = { args: { root: customRoot } }
      const result = await exampleHandlesLoader(context, defaultRoot)

      expect(result.handles).toEqual(["custom-product"])
    })

    it("should use products count from args when provided", async () => {
      let requestBody: unknown = null

      addHandlers(
        http.post(endpoint, async ({ request }) => {
          requestBody = await request.json()
          return HttpResponse.json(createMockResponse(["product-1"]))
        })
      )

      const context = { args: { products: 20 } }
      await exampleHandlesLoader(context, defaultRoot)

      expect(requestBody).not.toBeNull()
      expect((requestBody as { query: string }).query).toContain("products(first: 20)")
    })

    it("should clear cache on error", async () => {
      addHandlers(
        http.post(endpoint, () => {
          return HttpResponse.json({ error: "Server Error" }, { status: 500 })
        })
      )

      const context = { args: {} }

      await expect(exampleHandlesLoader(context, defaultRoot)).rejects.toThrow()

      // Verify cache was cleared by checking that a subsequent request doesn't use cached error
      addHandlers(
        http.post(endpoint, () => {
          return HttpResponse.json(createMockResponse(["product-1"]))
        })
      )

      const result = await exampleHandlesLoader(context, defaultRoot)
      expect(result.handles).toEqual(["product-1"])
    })

    it("should clear cache when result is empty", async () => {
      let callCount = 0

      addHandlers(
        http.post(endpoint, () => {
          callCount++
          if (callCount === 1) {
            return HttpResponse.json({ data: { products: { edges: [] } } })
          }
          return HttpResponse.json(createMockResponse(["product-1"]))
        })
      )

      const context = { args: {} }

      const result1 = await exampleHandlesLoader(context, defaultRoot)
      expect(result1.handles).toEqual([])

      const result2 = await exampleHandlesLoader(context, defaultRoot)
      expect(result2.handles).toEqual(["product-1"])
      expect(callCount).toBe(2)
    })

    it("should clear cache when handles is null or undefined", async () => {
      let callCount = 0

      addHandlers(
        http.post(endpoint, () => {
          callCount++
          if (callCount === 1) {
            return HttpResponse.json({ data: {} })
          }
          return HttpResponse.json(createMockResponse(["product-1"]))
        })
      )

      const context = { args: {} }

      const result1 = await exampleHandlesLoader(context, defaultRoot)
      expect(result1.handles).toEqual([])

      const result2 = await exampleHandlesLoader(context, defaultRoot)
      expect(result2.handles).toEqual(["product-1"])
      expect(callCount).toBe(2)
    })

    it("should not clear cache when result is valid and non-empty", async () => {
      let callCount = 0

      addHandlers(
        http.post(endpoint, () => {
          callCount++
          return HttpResponse.json(createMockResponse(["product-1", "product-2"]))
        })
      )

      const context = { args: {} }

      await exampleHandlesLoader(context, defaultRoot)
      await exampleHandlesLoader(context, defaultRoot)

      expect(callCount).toBe(1) // Cache should have been used for second call
    })
  })
})
