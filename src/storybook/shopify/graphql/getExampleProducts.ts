import { cached } from "@/utils/cached"
import getExampleProductsQuery from "./getExampleProducts.graphql?raw"
import { postJSON } from "@/utils/fetch"

type ExampleProductsResponse = {
  data?: {
    products?: {
      edges?: Array<{ node: { handle: string; title: string } }>
    }
  }
}

export const [getExampleProducts, clearCache] = cached(async (shopifyDomain: string) => {
  const endpoint = `https://${shopifyDomain}/api/2025-10/graphql.json`
  const data = await postJSON<ExampleProductsResponse>(endpoint, {
    query: getExampleProductsQuery,
    variables: { first: 20 }
  })
  return (
    data?.data?.products?.edges?.map((edge: { node: { handle: string; title: string } }) => ({
      handle: edge.node.handle,
      title: edge.node.title
    })) ?? []
  )
})

/**
 * Get example product handles from Shopify
 * @deprecated Use getExampleProducts instead to get both handle and title
 */
export const getExampleHandles = async (shopifyDomain: string): Promise<string[]> => {
  const products = await getExampleProducts(shopifyDomain)
  return products.map(p => p.handle)
}
