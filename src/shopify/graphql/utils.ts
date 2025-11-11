import { ShopifyProduct, ShopifyVariant } from "./types"

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

  const productTyped = product as ShopifyProduct

  // Collect all unique variants from adjacentVariants across all option values
  const variantsMap = new Map<string, ShopifyVariant>()

  for (const option of productTyped.options) {
    for (const optionValue of option.optionValues) {
      if (optionValue.adjacentVariants) {
        for (const variant of optionValue.adjacentVariants) {
          variantsMap.set(variant.id, variant)
        }
      }
    }
  }

  const variants = Array.from(variantsMap.values())

  // Get price and compareAtPrice from first variant if available
  const firstVariant = productTyped.options[0]?.optionValues[0]?.firstSelectableVariant || variants[0]
  const price = firstVariant?.price || { currencyCode: "USD", amount: "0" }
  const compareAtPrice = firstVariant?.compareAtPrice || null

  return {
    ...product,
    price,
    compareAtPrice,
    variants
  } as ShopifyProduct
}

function hasImagesNodes(product: Record<string, unknown>) {
  return "images" in product && product.images && typeof product.images === "object" && "nodes" in product.images
}

export function parseId(graphQLId: string): number {
  return Number(graphQLId.split("/").at(-1))
}
