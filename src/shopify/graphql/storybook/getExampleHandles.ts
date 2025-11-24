import { cached } from "@/utils/cached"
import getExampleHandlesQuery from "@/shopify/graphql/getExampleHandles.graphql?raw"

export const [getExampleHandles, clearCache] = cached(async (shopBaseUrl: string) => {
  const endpoint = `${shopBaseUrl}api/2025-10/graphql.json`
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
})
