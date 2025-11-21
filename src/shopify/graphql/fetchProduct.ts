import { flattenResponse } from "./utils"
import getProductByHandle from "@/shopify/graphql/getProductByHandle.graphql?raw"
import { getApiUrl } from "./getApiUrl"
import { cached } from "@/utils/cached"
import { graphqlClient } from "./client"

type GenericGraphQLType = {
  data: {
    product: Record<string, unknown>
  }
}

export const [fetchProduct, clearProductCache] = cached(async (handle: string) => {
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
})
