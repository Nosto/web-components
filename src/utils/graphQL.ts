import { ShopifyProductGraphQL } from "@/shopify/types"

type GenericGraphQLType = {
  data: {
    product: Record<string, unknown>
  }
}

function hasImagesNodes(product: Record<string, unknown>) {
  return "images" in product && product.images && typeof product.images === "object" && "nodes" in product.images
}

// can be improved later to handle more cases
export function flattenResponse(obj: GenericGraphQLType): ShopifyProductGraphQL {
  const product = obj.data.product

  if (hasImagesNodes(product)) {
    const images = product.images as { nodes: unknown }
    product.images = images.nodes
  }

  return product as ShopifyProductGraphQL
}

export function parseId(graphQLId: string): number {
  const parts = graphQLId.split("/")
  return Number(parts[parts.length - 1])
}
