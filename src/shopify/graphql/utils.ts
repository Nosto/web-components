import { ShopifyProduct } from "./types"

type GenericGraphQLType = {
  data: {
    product: Record<string, unknown>
  }
}

// can be improved later to handle more cases
export function flattenResponse(obj: GenericGraphQLType) {
  const product = obj.data.product

  if (hasImagesNodes(product)) {
    const images = product.images as { nodes: unknown }
    product.images = images.nodes
  }

  return {
    ...product,
    // FXIME
    price: {
      amount: "0",
      currencyCode: "USD"
    },
    // FIXME
    compareAtPrice: {
      amount: "0",
      currencyCode: "USD"
    }
  } as ShopifyProduct
}

function hasImagesNodes(product: Record<string, unknown>) {
  return "images" in product && product.images && typeof product.images === "object" && "nodes" in product.images
}

export function parseId(graphQLId: string): number {
  return Number(graphQLId.split("/").at(-1))
}
