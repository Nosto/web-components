import ky, { HTTPError } from "ky"
import { cached } from "@/utils/cached"
import getExampleHandlesQuery from "@/shopify/graphql/getExampleHandles.graphql?raw"
import { graphqlClient } from "@/shopify/graphql/client"
export const [getExampleHandles, clearCache] = cached(async (root: string, amount = 12) => {
  const endpoint = `${root}api/2025-10/graphql.json`
  try {
    const data = await graphqlClient
      .post(endpoint, {
        json: {
          query: getExampleHandlesQuery,
          variables: { first: amount }
        }
      })
      .json<{ data?: { products?: { edges?: Array<{ node: { handle: string } }> } } }>()
    return data?.data?.products?.edges?.map((edge: { node: { handle: string } }) => edge.node.handle) ?? []
  } catch (error) {
    if (error instanceof HTTPError) {
      const response = error.response
      throw new Error(`Failed to fetch example handles from ${endpoint}: ${response.status} ${response.statusText}`)
    }
    throw error
  }
})
