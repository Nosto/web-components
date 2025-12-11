import { flattenResponse } from "./utils"
import getProductByHandle from "@/shopify/graphql/getProductByHandle.graphql?raw"
import { getApiUrl } from "./getApiUrl"
import { cached } from "@/utils/cached"
import { postJSON } from "@/utils/fetch"
import { GraphQLResponse } from "./types"
import { ProductByHandleQuery } from "./generated/storefront.generated"

export const [fetchProduct, clearProductCache] = cached(async (handle: string) => {
  const responseData = await postJSON<GraphQLResponse<ProductByHandleQuery>>(getApiUrl().href, {
    query: getProductByHandle,
    variables: {
      language: window.Shopify?.locale?.toUpperCase() || "EN",
      country: window.Shopify?.country || "US",
      handle
    }
  })
  return flattenResponse(responseData)
})
