import { createShopifyUrl } from "@/utils/createShopifyUrl"
import { flattenResponse } from "./utils"
import getProductByHandle from "@/shopify/graphql/getProductByHandle.graphql?raw"
import { ShopifyProduct } from "./types"

// TODO add catching
export async function fetchProduct(handle: string) {
  // Shopify Storefront GraphQL version 2025-04 not working for tokenless requests, using 2025-10
  const url = createShopifyUrl(`/api/2025-10/graphql.json`)
  const response = await fetch(url.href, {
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
}
