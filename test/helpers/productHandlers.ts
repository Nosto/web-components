import { addHandlers } from "../msw.setup"
import { http, HttpResponse } from "msw"
import type { ShopifyProduct } from "@/shopify/graphql/types"
import { getApiUrl } from "@/shopify/graphql/constants"

export function addProductHandlers(responses: Record<string, { product?: ShopifyProduct; status?: number }>) {
  const graphqlPath = getApiUrl().pathname

  addHandlers(
    http.post(graphqlPath, async ({ request }) => {
      const url = new URL(request.url)
      const body = (await request.json()) as { query: string; variables: { query?: string; first?: number } }

      // Check if this is a batch query with products query by checking the path
      if (url.pathname === graphqlPath && body.variables.query) {
        // Parse the query string to extract handles
        const handleMatches = body.variables.query.match(/handle:([^\s)]+)/g)
        const requestedHandles = handleMatches ? handleMatches.map(m => m.replace("handle:", "")) : []

        const nodes = requestedHandles
          .map(handle => {
            const response = responses[handle]
            if (!response || response.status === 404 || response.status === 500) {
              return null
            }
            const product = (response.product || response) as ShopifyProduct
            return {
              ...product,
              handle,
              images: { nodes: product.images }
            }
          })
          .filter((p): p is NonNullable<typeof p> => p !== null)

        // Check if any of the requested products had error status
        const errorResponse = requestedHandles.find(h => {
          const resp = responses[h]
          return resp && (resp.status === 500 || resp.status === 404)
        })

        if (errorResponse && responses[errorResponse]) {
          return HttpResponse.json(
            { errors: [{ message: "Error" }] },
            { status: responses[errorResponse].status || 500 }
          )
        }

        return HttpResponse.json({ data: { products: { nodes } } })
      }

      return HttpResponse.json({ errors: [{ message: "Invalid query" }] }, { status: 400 })
    })
  )
}
