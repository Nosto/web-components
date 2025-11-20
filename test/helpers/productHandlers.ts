import { addHandlers } from "../msw.setup"
import { http, HttpResponse } from "msw"
import type { ShopifyProduct } from "@/shopify/graphql/types"
import { getApiUrl } from "@/shopify/graphql/constants"

export function addProductHandlers(products: (ShopifyProduct & { handle: string })[]) {
  const graphqlPath = getApiUrl().pathname
  const productsByHandle = products.reduce(
    (acc, product) => {
      const handle = product.handle
      if (handle) {
        acc[handle] = product
      }
      return acc
    },
    {} as Record<string, ShopifyProduct>
  )

  addHandlers(
    http.post(graphqlPath, async ({ request }) => {
      const url = new URL(request.url)
      const body = (await request.json()) as {
        query: string
        variables: { query?: string; handle?: string; first?: number; language?: string; country?: string }
      }

      if (url.pathname === graphqlPath && body.variables.handle && !body.variables.query) {
        const handle = body.variables.handle
        const product = productsByHandle[handle]

        if (!product) {
          return HttpResponse.json({ data: { product: null } })
        }

        return HttpResponse.json({
          data: {
            product: {
              ...product,
              handle,
              images: { nodes: product.images }
            }
          }
        })
      }

      if (url.pathname === graphqlPath && body.variables.query) {
        const handleMatches = body.variables.query.match(/handle:([^\s)]+)/g)
        const requestedHandles = handleMatches ? handleMatches.map(m => m.replace("handle:", "")) : []

        const nodes = requestedHandles
          .map(handle => {
            const product = productsByHandle[handle]
            if (!product) {
              return null
            }
            return {
              ...product,
              handle,
              images: { nodes: product.images }
            }
          })
          .filter((p): p is NonNullable<typeof p> => p !== null)

        return HttpResponse.json({ data: { products: { nodes } } })
      }

      console.error("Unmatched GraphQL request:", { pathname: url.pathname, variables: body.variables, graphqlPath })
      return HttpResponse.json({ errors: [{ message: "Invalid query" }] }, { status: 400 })
    })
  )
}
