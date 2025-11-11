import { ShopifyImage, ShopifyProduct, ShopifyVariant } from "./types"

type GenericGraphQLType = {
  data: {
    product: Record<string, unknown>
  }
}

// can be improved later to handle more cases
export function flattenResponse(obj: GenericGraphQLType) {
  const product = obj.data.product

  // Flatten images from nodes structure
  let images: ShopifyImage[] = []
  if (hasImagesNodes(product)) {
    images = (product.images as { nodes: ShopifyImage[] }).nodes
  }

  const productTyped = product as ShopifyProduct

  // Flatten variants from nodes structure
  let variants: ShopifyVariant[] = []
  if (hasVariantsNodes(product)) {
    const variantsData = product.variants as { nodes: ShopifyVariant[] }
    variants = variantsData.nodes
  }

  // Get price and compareAtPrice from first variant if available
  const firstVariant = productTyped.options[0]?.optionValues[0]?.firstSelectableVariant || variants[0]
  const price = firstVariant?.price || { currencyCode: "USD", amount: "0" }
  const compareAtPrice = firstVariant?.compareAtPrice || null

  return {
    ...product,
    price,
    compareAtPrice,
    images,
    variants
  } as ShopifyProduct
}

function hasImagesNodes(product: Record<string, unknown>) {
  return "images" in product && product.images && typeof product.images === "object" && "nodes" in product.images
}

function hasVariantsNodes(product: Record<string, unknown>) {
  return (
    "variants" in product && product.variants && typeof product.variants === "object" && "nodes" in product.variants
  )
}

export function parseId(graphQLId: string): number {
  return Number(graphQLId.split("/").at(-1))
}

export function toVariantGid(variantId: number): string {
  return `gid://shopify/ProductVariant/${variantId}`
}
