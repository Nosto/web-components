import { flattenResponse } from "./utils"
import getProductByHandle from "@/shopify/graphql/getProductByHandle.graphql?raw"
import { getApiUrl } from "./getApiUrl"
import { cached } from "@/utils/cached"
import { postJSON } from "@/utils/fetch"

type GenericGraphQLType = {
  data: {
    product: Record<string, unknown>
  }
}

export const [fetchProduct, clearProductCache] = cached(async (handle: string) => {
  const responseData = await postJSON<GenericGraphQLType>(getApiUrl().href, {
    query: getProductByHandle,
    variables: {
      language: window.Shopify?.locale?.toUpperCase() || "EN",
      country: window.Shopify?.country || "US",
      handle
    }
  })
  return flattenResponse(responseData)
})
