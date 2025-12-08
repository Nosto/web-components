import { GraphQLProduct, GraphQLResponse } from "../types"
import { ProductByHandleQuery } from "./generated/storefront.generated"
import { ShopifyProduct, ShopifyVariant } from "../types"

/**
 * Recursively flattens GraphQL response by unwrapping { nodes: [...] } structures
 */
function flattenNodes<T, R>(obj: T): R {
  if (obj === null || obj === undefined) return obj as unknown as R

  if (Array.isArray(obj)) {
    return obj.map(flattenNodes) as R
  }

  if (typeof obj === "object") {
    // Check if this is a nodes wrapper
    if ("nodes" in obj && Array.isArray(obj.nodes)) {
      return flattenNodes(obj.nodes) as R
    }

    // Recursively flatten nested objects
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      result[key] = flattenNodes(value)
    }
    return result as R
  }

  return obj as R
}

export function flattenResponse(obj: GraphQLResponse<ProductByHandleQuery>): ShopifyProduct {
  const product = obj.data.product

  if (!product) {
    throw new Error("Product not found in response")
  }

  const flattenedProduct = flattenNodes<GraphQLProduct, ShopifyProduct>(product)

  // collect variants from option values and adjacentVariants
  const variants = product.adjacentVariants ?? getCombinedVariants(product)

  // Get price and compareAtPrice from first variant if available
  const firstVariant = variants.find(v => v.availableForSale) || variants[0]
  const price = firstVariant?.price || { currencyCode: "USD", amount: "0" }
  const compareAtPrice = firstVariant?.compareAtPrice || null

  return {
    ...flattenedProduct,
    price,
    compareAtPrice,
    variants
  } as ShopifyProduct
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
