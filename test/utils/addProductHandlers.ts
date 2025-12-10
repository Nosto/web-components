import { http, HttpResponse } from "msw"
import { addHandlers } from "../msw.setup"
import { getApiUrl } from "@/shopify/graphql/getApiUrl"
import type { GraphQLProduct, ShopifyProduct } from "@/shopify/graphql/types"

/**
 * Response object for product handler
 */
export interface ProductHandlerResponse {
  product?: GraphQLProduct
  status?: number
}

/**
 * Adds MSW handlers for mocking Shopify GraphQL product API responses.
 *
 * @param responses - Record of product handles mapped to their response data
 *
 * @example
 * ```typescript
 * addProductHandlers({
 *   "test-product": { product: mockProduct },
 *   "error-product": { status: 404 }
 * })
 * ```
 */
export function addProductHandlers(responses: Record<string, ProductHandlerResponse>) {
  const graphqlPath = getApiUrl().pathname

  addHandlers(
    http.post(graphqlPath, async ({ request }) => {
      const body = (await request.json()) as { variables: { handle: string } }
      const handle = body.variables.handle
      const response = responses[handle]
      if (!response) {
        return HttpResponse.json({ errors: [{ message: "Not Found" }] }, { status: 404 })
      }
      if (!response.product && response.status) {
        return HttpResponse.json({ errors: [{ message: "Failed to fetch product" }] }, { status: response.status })
      }
      const product = (response.product || response) as ShopifyProduct
      // Wrap images in nodes structure for GraphQL response
      return HttpResponse.json({ data: { product } }, { status: response.status || 200 })
    })
  )
}
