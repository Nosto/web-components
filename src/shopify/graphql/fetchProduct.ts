import { flattenResponse } from "./utils"
import getProductByHandle from "@/shopify/graphql/getProductByHandle.graphql?raw"
import { ShopifyProduct } from "./types"
import { apiUrl } from "./constants"
import { createGraphQLClient } from "@shopify/graphql-client"

const productCache = new Map<string, ShopifyProduct>()

export async function fetchProduct(handle: string) {
  if (productCache.has(handle)) {
    return productCache.get(handle)!
  }

  const client = createGraphQLClient({
    url: apiUrl.href,
    headers: {
      "Content-Type": "application/json"
    }
  })

  const { data, errors } = await client.request(getProductByHandle, {
    variables: {
      language: window.Shopify?.locale?.toUpperCase() || "EN",
      country: window.Shopify?.country || "US",
      handle
    }
  })

  if (errors?.networkStatusCode) {
    throw new Error(`Failed to fetch product data: ${errors.networkStatusCode} ${errors.message || "Unknown error"}`)
  }

  if (!data) {
    throw new Error("No data returned from GraphQL query")
  }

  const flattened = flattenResponse({ data }) as ShopifyProduct
  productCache.set(handle, flattened)
  return flattened
}

export function clearProductCache() {
  productCache.clear()
}
