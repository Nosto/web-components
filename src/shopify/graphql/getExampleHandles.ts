import ky, { HTTPError } from "ky"
import { cached } from "@/utils/cached"
import getExampleHandlesQuery from "@/shopify/graphql/getExampleHandles.graphql?raw"

// Create a GraphQL client with ky
const graphqlClient = ky.create({
  headers: {
    "Content-Type": "application/json"
  },
  retry: 2,
  timeout: 10000,
  throwHttpErrors: true
})

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
