import { cached } from "@/utils/cached"
import getExampleProductsQuery from "./getExampleProducts.graphql?raw"
import { postJSON } from "@/utils/fetch"
import { apiVersion } from "@/shopify/graphql/apiVersion"

export type ExampleData = {
  handle: string
  title: string
  variant?: string
}

export type ExampleProduct = { handle: string; title: string; variants?: { nodes: Array<{ id: string }> } }

type ExampleProductsResponse = {
  data?: {
    products?: {
      edges?: Array<{ node: ExampleProduct }>
    }
  }
}

function parseId(gid: string) {
  try {
    const { protocol, hostname, pathname } = new URL(gid)
    if (protocol !== "gid:" || hostname !== "shopify") {
      return undefined
    }
    const [, resource, id] = pathname.split("/")
    return resource && id ? id : undefined
  } catch {
    return undefined
  }
}

export const [getExampleProducts, clearCache] = cached(async (shopifyDomain: string) => {
  const endpoint = `https://${shopifyDomain}/api/${apiVersion}/graphql.json`
  const data = await postJSON<ExampleProductsResponse>(endpoint, {
    query: getExampleProductsQuery,
    variables: { first: 20 }
  })
  return (
    data?.data?.products?.edges?.map(({ node }): ExampleData => {
      const variantId = node.variants?.nodes[0]?.id
      return {
        handle: node.handle,
        title: node.title,
        variant: variantId ? parseId(variantId) : undefined
      }
    }) ?? []
  )
})
