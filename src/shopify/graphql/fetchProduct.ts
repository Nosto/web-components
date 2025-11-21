import ky, { HTTPError } from "ky"
import { flattenResponse } from "./utils"
import getProductByHandle from "@/shopify/graphql/getProductByHandle.graphql?raw"
import { getApiUrl } from "./getApiUrl"
import { cached } from "@/utils/cached"

type GenericGraphQLType = {
  data: {
    product: Record<string, unknown>
  }
}

// Create a GraphQL client with ky
const graphqlClient = ky.create({
  headers: {
    "Content-Type": "application/json"
  },
  retry: 2,
  timeout: 10000,
  throwHttpErrors: true
})

export const [fetchProduct, clearProductCache] = cached(async (handle: string) => {
  try {
    const responseData = await graphqlClient
      .post(getApiUrl().href, {
        json: {
          query: getProductByHandle,
          variables: {
            language: window.Shopify?.locale?.toUpperCase() || "EN",
            country: window.Shopify?.country || "US",
            handle
          }
        }
      })
      .json<GenericGraphQLType>()
    return flattenResponse(responseData)
  } catch (error) {
    if (error instanceof HTTPError) {
      const response = error.response
      throw new Error(`Failed to fetch product data: ${response.status} ${response.statusText}`)
    }
    throw error
  }
})
