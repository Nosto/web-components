import { createShopifyUrl } from "@/utils/createShopifyUrl"
import { getJSON } from "@/utils/fetch"
import { ShopifyProductGraphQL } from "../types"
import getProductByHandle from "@/shopify/graphql/getProductByHandle.graphql"
import { flattenResponse } from "@/utils/graphQL"

export async function fetchProduct(handle: string) {
  // Nosto BE GraphQL version 2025-04 not working for tokenless requests, using 2025-10
  const url = createShopifyUrl(`/api/2025-10/graphql.json`)
  const response = await getJSON<{ data: { product: ShopifyProductGraphQL } }>({
    url: url.href,
    requestInit: {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        query: getProductByHandle,
        variables: {
          country: "US",
          handle
        }
      })
    }
  })
  return flattenResponse(response)
}
