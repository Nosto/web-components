import { flattenResponse } from "./utils"
import getProductByHandle from "@/shopify/graphql/getProductByHandle.graphql?raw"
import { ShopifyProduct } from "./types"
import { apiUrl } from "./constants"

const productCache = new Map<string, ShopifyProduct>()

export async function fetchProduct(handle: string) {
  if (productCache.has(handle)) {
    return productCache.get(handle)!
  }

  // Shopify Storefront GraphQL version 2025-04 not working for tokenless requests, using 2025-10
  const response = await fetch(apiUrl.href, {
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
    throw new Error(`Failed to fetch product data: ${response.status} ${response.statusText}`)
  }
  const responseData = await response.json()
  const flattened = flattenResponse(responseData) as ShopifyProduct
  productCache.set(handle, flattened)
  return flattened
}

export function clearProductCache() {
  productCache.clear()
}