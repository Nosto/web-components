import { ProductByHandleQuery } from "./generated/storefront.generated"

export type GraphQLResponse<T> = {
  data: T
}

export type Gid = `gid://shopify/${string}/${string}`

export type WithGid<T> = T extends object
  ? {
      [K in keyof T]: K extends "id"
        ? Gid
        : T[K] extends (infer U)[]
          ? WithGid<U>[]
          : T[K] extends object
            ? WithGid<T[K]>
            : T[K]
    }
  : T

export type GraphQLProduct = WithGid<NonNullable<ProductByHandleQuery["product"]>>

// Derive flattened types directly from the generated GraphQL types
export type ShopifyImage = GraphQLProduct["images"]["nodes"][0]
export type ShopifyMoney = GraphQLProduct["adjacentVariants"][0]["price"]
export type ShopifySelectedOption = GraphQLProduct["adjacentVariants"][0]["selectedOptions"][0]

export type ShopifyVariant = GraphQLProduct["adjacentVariants"][0]

export type ShopifyOptionValue = GraphQLProduct["options"][0]["optionValues"][0]

export type ShopifyOption = {
  name: GraphQLProduct["options"][0]["name"]
  optionValues: ShopifyOptionValue[]
}

// Flattened product type derived from GraphQL with augmented fields
// TODO: Omit adjacentVariants later and rename variants to combinedVariants
export type ShopifyProduct = Omit<GraphQLProduct, "images" | "options" | "adjacentVariants"> & {
  images: ShopifyImage[]
  options: ShopifyOption[]
  // augmented fields
  price: ShopifyMoney
  compareAtPrice: ShopifyMoney | null
  combinedVariants: ShopifyVariant[]
}

/**
 * Event detail for variant change events
 */
export type VariantChangeDetail = {
  variantId: Gid
  productId: Gid
  handle: string
}
