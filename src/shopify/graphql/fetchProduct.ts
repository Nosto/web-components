import { flattenResponse } from "./utils"
import getProductsByHandles from "@/shopify/graphql/getProductsByHandles.graphql?raw"
import { getApiUrl } from "./constants"
import { cached } from "@/utils/cached"
import { ShopifyProduct } from "./types"

type PendingRequest = {
  handle: string
  resolve: (product: ShopifyProduct) => void
  reject: (error: Error) => void
}

const state = {
  pendingRequests: new Map<string, PendingRequest[]>(),
  scheduledFlush: null as number | null
}

async function fetchBatch(handles: string[], requestsMap: Map<string, PendingRequest[]>) {
  // Build query string to match products by handle
  const queryString = handles.map(h => `handle:${h}`).join(" OR ")

  const response = await fetch(getApiUrl().href, {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({
      query: getProductsByHandles,
      variables: {
        language: window.Shopify?.locale?.toUpperCase() || "EN",
        country: window.Shopify?.country || "US",
        query: queryString,
        first: handles.length
      }
    })
  })

  if (!response.ok) {
    const error = new Error(`Failed to fetch product data: ${response.status} ${response.statusText}`)
    Array.from(requestsMap.values())
      .flatMap(requests => requests)
      .forEach(request => request.reject(error))
    return
  }

  const responseData = await response.json()

  // Create a map of handle to product
  const productsByHandle = new Map<string, ShopifyProduct>()
  if (responseData.data?.products?.nodes) {
    responseData.data.products.nodes.forEach((productNode: { handle: string }) => {
      const product = flattenResponse({ data: { product: productNode } })
      productsByHandle.set(productNode.handle, product)
    })
  }

  // Resolve or reject each request
  for (const handle of handles) {
    const requests = requestsMap.get(handle)
    if (!requests) continue

    const product = productsByHandle.get(handle)
    if (product) {
      requests.forEach(request => request.resolve(product))
    } else {
      const error = new Error(`Product not found: ${handle}`)
      requests.forEach(request => request.reject(error))
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
    await fetchBatch(handles, requestsMap)
  } catch (error) {
    // Reject all pending requests with the error
    Array.from(requestsMap.values())
      .flatMap(requests => requests)
      .forEach(request => request.reject(error instanceof Error ? error : new Error(String(error))))
  }
}

function requestProduct(handle: string): Promise<ShopifyProduct> {
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

export const [fetchProduct, clearProductCache] = cached(requestProduct)
