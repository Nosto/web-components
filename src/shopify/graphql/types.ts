import { ProductByHandleQuery } from "./generated/storefront.generated"

/**
 * Utility type to simplify complex intersection types into a single flat object type.
 * This makes types more readable in IDE hover information and error messages.
 * Recursively simplifies nested types for complete flattening.
 */
export type Simplify<T> = {
  [K in keyof T]: T[K] extends object ? (T[K] extends Array<infer U> ? Array<Simplify<U>> : Simplify<T[K]>) : T[K]
} & {}

export type GraphQLResponse<T> = {
  data: T
}

export type GraphQLProduct = NonNullable<ProductByHandleQuery["product"]>

// Derive flattened types directly from the generated GraphQL types
export type ShopifyImage = GraphQLProduct["images"]["nodes"][0]
export type ShopifyMoney = GraphQLProduct["adjacentVariants"][0]["price"]
export type ShopifySelectedOption = GraphQLProduct["adjacentVariants"][0]["selectedOptions"][0]

export type ShopifyVariant = Simplify<GraphQLProduct["adjacentVariants"][0]>

export type ShopifyOptionValue = Simplify<GraphQLProduct["options"][0]["optionValues"][0]>

export type ShopifyOption = {
  name: GraphQLProduct["options"][0]["name"]
  optionValues: ShopifyOptionValue[]
}

// Flattened product type derived from GraphQL with augmented fields
// TODO: Omit adjacentVariants later and rename variants to combinedVariants
export type ShopifyProduct = Simplify<
  Omit<GraphQLProduct, "images" | "options"> & {
    images: ShopifyImage[]
    options: ShopifyOption[]
    // augmented fields
    price: ShopifyMoney
    compareAtPrice: ShopifyMoney | null
    variants: ShopifyVariant[]
  }
>

/**
 * Event detail for variant change events
 */
export type VariantChangeDetail = {
  variant: ShopifyVariant
}
