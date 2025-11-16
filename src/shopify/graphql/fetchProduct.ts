import { flattenResponse } from "./utils"
import getProductByHandle from "@/shopify/graphql/getProductByHandle.graphql?raw"
import getProductsByHandles from "@/shopify/graphql/getProductsByHandles.graphql?raw"
import { getApiUrl } from "./constants"
import { cached } from "@/utils/cached"
import { ShopifyProduct } from "./types"

type PendingRequest = {
  handle: string
  resolve: (product: ShopifyProduct) => void
  reject: (error: Error) => void
}

function createProductBatcher() {
  const state = {
    pendingRequests: new Map<string, PendingRequest[]>(),
    scheduledFlush: null as number | null
  }

  async function fetchSingle(handle: string, requests: PendingRequest[]) {
    const response = await fetch(getApiUrl().href, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        query: getProductByHandle,
        variables: {
          language: window.Shopify?.locale?.toUpperCase() || "EN",
          country: window.Shopify?.country || "US",
          handle
        }
      })
    })

    if (!response.ok) {
      const error = new Error(`Failed to fetch product data: ${response.status} ${response.statusText}`)
      for (const request of requests) {
        request.reject(error)
      }
      return
    }

    const responseData = await response.json()
    const product = flattenResponse(responseData)

    for (const request of requests) {
      request.resolve(product)
    }
  }

  async function fetchBatch(handles: string[], requestsMap: Map<string, PendingRequest[]>) {
    // Build variables for batch query (up to 10 handles)
    const batchSize = Math.min(handles.length, 10)
    const variables: Record<string, string> = {
      language: window.Shopify?.locale?.toUpperCase() || "EN",
      country: window.Shopify?.country || "US"
    }

    for (let i = 0; i < batchSize; i++) {
      variables[`handle${i + 1}`] = handles[i]
    }

    const response = await fetch(getApiUrl().href, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        query: getProductsByHandles,
        variables
      })
    })

    if (!response.ok) {
      const error = new Error(`Failed to fetch product data: ${response.status} ${response.statusText}`)
      for (const requests of requestsMap.values()) {
        for (const request of requests) {
          request.reject(error)
        }
      }
      return
    }

    const responseData = await response.json()

    // Process each product in the batch response
    for (let i = 0; i < batchSize; i++) {
      const productKey = `product${i + 1}`
      const handle = handles[i]
      const requests = requestsMap.get(handle)

      if (!requests) continue

      if (responseData.data?.[productKey]) {
        try {
          const product = flattenResponse({ data: { product: responseData.data[productKey] } })
          for (const request of requests) {
            request.resolve(product)
          }
        } catch (error) {
          for (const request of requests) {
            request.reject(error instanceof Error ? error : new Error(String(error)))
          }
        }
      } else {
        const error = new Error(`Product not found: ${handle}`)
        for (const request of requests) {
          request.reject(error)
        }
      }
    }

    // Handle any remaining handles beyond batch size (shouldn't happen but safety check)
    if (handles.length > 10) {
      for (let i = 10; i < handles.length; i++) {
        const handle = handles[i]
        const requests = requestsMap.get(handle)
        if (requests) {
          const error = new Error(`Batch size exceeded for handle: ${handle}`)
          for (const request of requests) {
            request.reject(error)
          }
        }
      }
    }
  }

  async function flush() {
    state.scheduledFlush = null

    // Get unique handles from pending requests
    const handles = Array.from(state.pendingRequests.keys())
    const requestsMap = new Map(state.pendingRequests)
    state.pendingRequests.clear()

    if (handles.length === 0) {
      return
    }

    try {
      if (handles.length === 1) {
        // Single request - use original query
        await fetchSingle(handles[0], requestsMap.get(handles[0])!)
      } else {
        // Batch request - use batch query
        await fetchBatch(handles, requestsMap)
      }
    } catch (error) {
      // Reject all pending requests with the error
      for (const requests of requestsMap.values()) {
        for (const request of requests) {
          request.reject(error instanceof Error ? error : new Error(String(error)))
        }
      }
    }
  }

  function request(handle: string): Promise<ShopifyProduct> {
    return new Promise((resolve, reject) => {
      // Get or create array for this handle
      const requests = state.pendingRequests.get(handle) || []
      requests.push({ handle, resolve, reject })
      state.pendingRequests.set(handle, requests)

      // Schedule flush if not already scheduled
      if (state.scheduledFlush === null) {
        state.scheduledFlush = requestAnimationFrame(() => flush())
      }
    })
  }

  return { request }
}

const batcher = createProductBatcher()

async function fetchProductUncached(handle: string): Promise<ShopifyProduct> {
  return batcher.request(handle)
}

export const [fetchProduct, clearProductCache] = cached(fetchProductUncached)
