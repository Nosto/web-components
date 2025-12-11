import { ProductByHandleQuery } from "./generated/storefront.generated"
import { GraphQLProduct, GraphQLResponse, ShopifyImage, ShopifyProduct, ShopifyVariant } from "./types"

// can be improved later to handle more cases
export function flattenResponse(obj: GraphQLResponse<ProductByHandleQuery>): ShopifyProduct {
  const product = obj.data.product

  if (!product) {
    throw new Error("No products returned by Storefront GraphQL")
  }

  // Flatten images from nodes structure
  let images: ShopifyImage[] = []
  if (hasImagesNodes(product)) {
    images = (product.images as { nodes: ShopifyImage[] }).nodes
  }

  // collect variants from option values and adjacentVariants
  const variants = getCombinedVariants(product)

  // Get price and compareAtPrice from first variant if available
  const firstVariant = variants.find(v => v.availableForSale) || variants[0]
  const price = firstVariant?.price || { currencyCode: "USD", amount: "0" }
  const compareAtPrice = firstVariant?.compareAtPrice || null

  return {
    ...product,
    price,
    compareAtPrice,
    images,
    variants
  }
}

function getCombinedVariants(product: GraphQLProduct) {
  const variantsMap = new Map<string, ShopifyVariant>()

  product.options
    .flatMap(option => option.optionValues)
    .map(ov => ov.firstSelectableVariant)
    .filter((v): v is ShopifyVariant => v != null)
    .forEach(variant => {
      variantsMap.set(variant.id, variant)
    })

  // also include adjacent variants
  product.adjacentVariants.forEach(variant => {
    variantsMap.set(variant.id, variant)
  })

  return Array.from(variantsMap.values())
}

function hasImagesNodes(product: GraphQLProduct) {
  return "images" in product && product.images && typeof product.images === "object" && "nodes" in product.images
}

export function parseId(graphQLId: string): number {
  const split = graphQLId.split("/")
  return Number(split[split.length - 1])
}

export function toHandle(url: string) {
  const parts = url.split("/products/")
  if (parts.length > 1) {
    return parts[1].split(/[/?#]/)[0]
  }
}

export function toProductId(productId: number): string {
  return `gid://shopify/Product/${productId}`
}

export function toVariantGid(variantId: number): string {
  return `gid://shopify/ProductVariant/${variantId}`
}
