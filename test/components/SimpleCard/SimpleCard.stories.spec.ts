import { describe, it, expect, beforeEach, vi, afterEach } from "vitest"
import { addHandlers } from "../../msw.setup"
import { http, HttpResponse } from "msw"

// Import the fetchProductHandles function - we need to make it accessible for testing
describe("SimpleCard Stories", () => {
  beforeEach(() => {
    // Reset window.Shopify before each test
    delete (window as unknown as { Shopify?: unknown }).Shopify
    // Mock window.location.href
    Object.defineProperty(window, "location", {
      value: { href: "https://example.com" },
      writable: true
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("fetchProductHandles", () => {
    // We'll test the fetch functionality by mocking the API endpoint
    it("should fetch product handles from collections/all endpoint", async () => {
      // Mock the collections/all?view=handles.json endpoint
      addHandlers(
        http.get("*/collections/all", ({ request }) => {
          const url = new URL(request.url)
          if (url.searchParams.get("view") === "handles.json") {
            return HttpResponse.json({
              handles: [
                "product-1",
                "product-2", 
                "product-3",
                "product-4",
                "product-5",
                "product-6",
                "product-7",
                "product-8",
                "product-9",
                "product-10",
                "product-11",
                "product-12",
                "product-13",
                "product-14",
                "product-15"
              ]
            })
          }
          return HttpResponse.json({ error: "Not Found" }, { status: 404 })
        })
      )

      // Set up Shopify root
      ;(window as unknown as { Shopify: { routes: { root: string } } }).Shopify = { 
        routes: { root: "https://nosto-shopify1.myshopify.com/" } 
      }

      // Import the function dynamically to avoid module loading issues
      const { fetchProductHandles } = await import("@/components/SimpleCard/SimpleCard.stories")
      
      const result = await fetchProductHandles()
      
      expect(result).toEqual([
        "product-1",
        "product-2", 
        "product-3",
        "product-4",
        "product-5",
        "product-6",
        "product-7",
        "product-8",
        "product-9",
        "product-10",
        "product-11",
        "product-12"
      ])
      expect(result.length).toBe(12) // Should limit to 12 products
    })

    it("should fallback to default handles on API error", async () => {
      // Use a different store to avoid cache conflicts
      const errorStoreRoot = "https://error-store.myshopify.com/"
      
      // Mock API to return an error
      addHandlers(
        http.get("*/collections/all", ({ request }) => {
          const url = new URL(request.url)
          if (url.href.includes("error-store")) {
            return HttpResponse.json({ error: "Server Error" }, { status: 500 })
          }
          // Fall through to default handler
          return HttpResponse.json({ error: "Not Found" }, { status: 404 })
        })
      )

      const { fetchProductHandles } = await import("@/components/SimpleCard/SimpleCard.stories")
      
      const result = await fetchProductHandles(errorStoreRoot)
      
      // Should fallback to default handles
      expect(result).toEqual([
        "awesome-sneakers", 
        "good-ol-shoes", 
        "old-school-kicks", 
        "insane-shoes"
      ])
    })

    it("should handle invalid response format gracefully", async () => {
      // Use a different store to avoid cache conflicts
      const invalidStoreRoot = "https://invalid-store.myshopify.com/"
      
      // Mock API to return invalid format
      addHandlers(
        http.get("*/collections/all", ({ request }) => {
          const url = new URL(request.url)
          if (url.href.includes("invalid-store")) {
            return HttpResponse.json({ invalid: "response" })
          }
          // Fall through to default handler
          return HttpResponse.json({ error: "Not Found" }, { status: 404 })
        })
      )

      const { fetchProductHandles } = await import("@/components/SimpleCard/SimpleCard.stories")
      
      const result = await fetchProductHandles(invalidStoreRoot)
      
      // Should fallback to default handles
      expect(result).toEqual([
        "awesome-sneakers", 
        "good-ol-shoes", 
        "old-school-kicks", 
        "insane-shoes"
      ])
    })

    it("should use custom root URL when provided", async () => {
      const customRoot = "https://custom-store.myshopify.com/"
      
      addHandlers(
        http.get("*/collections/all", ({ request }) => {
          const url = new URL(request.url)
          // Verify the request is made to the custom root
          expect(url.origin + url.pathname).toContain("custom-store")
          if (url.searchParams.get("view") === "handles.json") {
            return HttpResponse.json({
              handles: ["custom-product-1", "custom-product-2"]
            })
          }
          return HttpResponse.json({ error: "Not Found" }, { status: 404 })
        })
      )

      const { fetchProductHandles } = await import("@/components/SimpleCard/SimpleCard.stories")
      
      const result = await fetchProductHandles(customRoot)
      
      expect(result).toEqual(["custom-product-1", "custom-product-2"])
    })
  })
})