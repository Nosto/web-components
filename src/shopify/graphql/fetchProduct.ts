import { flattenResponse } from "./utils"
import getProductByHandle from "@/shopify/graphql/getProductByHandle.graphql?raw"
import { ShopifyProduct } from "./types"
import { apiUrl } from "./constants"
import { createGraphQLClient, GraphQLClient } from "@shopify/graphql-client"

const productCache = new Map<string, ShopifyProduct>()

let client: GraphQLClient | null = null

function getClient() {
  if (!client) {
    client = createGraphQLClient({
      url: apiUrl.href,
      headers: {
        "Content-Type": "application/json"
      }
    })
  }
  return client
}

export async function fetchProduct(handle: string) {
  if (productCache.has(handle)) {
    return productCache.get(handle)!
  }

  const { data, errors } = await getClient().request(getProductByHandle, {
    variables: {
      language: window.Shopify?.locale?.toUpperCase() || "EN",
      country: window.Shopify?.country || "US",
      handle
    }
  })

  if (errors) {
    const statusCode = errors.networkStatusCode ? `${errors.networkStatusCode} ` : ""
    let errorMessage = errors.message || ""
    if (Array.isArray(errors.graphQLErrors) && errors.graphQLErrors.length > 0) {
      errorMessage += errors.graphQLErrors
        .map((e: { message?: string }) => e.message)
        .filter(Boolean)
        .join("; ")
    }
    if (!errorMessage) errorMessage = "Unknown error"
    throw new Error(`Failed to fetch product data: ${statusCode}${errorMessage}`)
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
