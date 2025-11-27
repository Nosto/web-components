import { cached } from "@/utils/cached"
import getExampleHandlesQuery from "./getExampleHandles.graphql?raw"
import { postJSON } from "@/utils/fetch"

type ExampleHandlesResponse = {
  data?: {
    products?: {
      edges?: Array<{ node: { handle: string } }>
    }
  }
}

export const [getExampleHandles, clearCache] = cached(async (shopifyDomain: string) => {
  const endpoint = `https://${shopifyDomain}/api/2025-10/graphql.json`
  const data = await postJSON<ExampleHandlesResponse>(endpoint, {
    query: getExampleHandlesQuery,
    variables: { first: 20 }
  })
  return data?.data?.products?.edges?.map((edge: { node: { handle: string } }) => edge.node.handle) ?? []
})
