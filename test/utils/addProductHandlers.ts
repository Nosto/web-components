import { http, HttpResponse } from "msw"
import { addHandlers } from "../msw.setup"
import { getApiUrl } from "@/shopify/graphql/getApiUrl"
import type { ShopifyProduct } from "@/shopify/graphql/types"

/**
 * Response object for product handler
 */
export interface ProductHandlerResponse {
  product?: ShopifyProduct
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
      const product = (response.product || response) as ShopifyProduct
      // Wrap images and variants in nodes structure for GraphQL response
      const graphqlProduct = {
        ...product,
        images: { nodes: product.images }
      }
      return HttpResponse.json({ data: { product: graphqlProduct } }, { status: response.status || 200 })
    })
  )
}
