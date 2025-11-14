import { flattenResponse } from "./utils"
import getProductByHandle from "@/shopify/graphql/getProductByHandle.graphql?raw"
import { ShopifyProduct } from "./types"
import { getApiUrl } from "./constants"
import { cached } from "@/utils/cached"

export const [fetchProduct, clearProductCache] = cached(async (handle: string) => {
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
    throw new Error(`Failed to fetch product data: ${response.status} ${response.statusText}`)
  }
  const responseData = await response.json()
  return flattenResponse(responseData) as ShopifyProduct
})
