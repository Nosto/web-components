import { cached } from "@/utils/cached"
import getExampleHandlesQuery from "./getExampleHandles.graphql?raw"
import { getApiUrl } from "@/shopify/graphql/getApiUrl"

export const [getExampleHandles, clearCache] = cached(
  async (
    /** @internal Used for cache key generation only */
    _shopifyShopBaseUrl: string
  ) => {
    const endpoint = getApiUrl()
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: getExampleHandlesQuery,
        variables: { first: 20 }
      })
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch example handles from ${endpoint}: ${response.status} ${response.statusText}`)
    }
    const data = await response.json()
    return data?.data?.products?.edges?.map((edge: { node: { handle: string } }) => edge.node.handle) ?? []
  }
)
