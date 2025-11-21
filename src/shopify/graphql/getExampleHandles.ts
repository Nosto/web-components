import { cached } from "@/utils/cached"
import getExampleHandlesQuery from "@/shopify/graphql/getExampleHandles.graphql?raw"
import { graphqlClient } from "./client"

type GetExampleHandlesResponse = {
  data?: {
    products?: {
      edges?: Array<{ node: { handle: string } }>
    }
  }
}

export const [getExampleHandles, clearCache] = cached(async (root: string, amount = 12) => {
  const endpoint = `${root}api/2025-10/graphql.json`
  const data = await graphqlClient
    .post(endpoint, {
      json: {
        query: getExampleHandlesQuery,
        variables: { first: amount }
      }
    })
    .json<GetExampleHandlesResponse>()
  return data?.data?.products?.edges?.map((edge: { node: { handle: string } }) => edge.node.handle) ?? []
})
