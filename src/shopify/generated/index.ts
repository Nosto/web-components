/**
 * Generated types for Shopify Storefront API
 * This file provides backward-compatible exports for the existing codebase
 */

// Re-export generated types with Shopify prefix for backward compatibility
export type ShopifyImage = {
  altText: string | null
  height: number
  width: number
  thumbhash: string | null
  url: string
}

export type ShopifyMoney = {
  currencyCode: string
  amount: string
}

export type ShopifyProduct = {
  id: string
  title: string
  vendor: string
  description: string
  encodedVariantExistence: string
  onlineStoreUrl: string
  availableForSale: boolean
  images: ShopifyImage[]
  featuredImage: ShopifyImage
  options: ShopifyOption[]
  adjacentVariants: ShopifyVariant[]

  // augmented fields
  price: ShopifyMoney
  compareAtPrice: ShopifyMoney | null
  variants: ShopifyVariant[]
}

export type ShopifyOption = {
  name: string
  optionValues: ShopifyOptionValue[]
}

export type ShopifyOptionValue = {
  firstSelectableVariant: ShopifyVariant | null
  name: string
  swatch: string | null
}

export type ShopifyVariant = {
  availableForSale: boolean
  title: string
  id: string
  image?: ShopifyImage
  price: ShopifyMoney
  compareAtPrice: ShopifyMoney | null
  selectedOptions?: ShopifySelectedOption[]
  product: {
    id: string
    onlineStoreUrl: string
  }
}

export type ShopifySelectedOption = {
  name: string
  value: string
}

/**
 * Event detail for variant change events
 */
export type VariantChangeDetail = {
  variant: ShopifyVariant
}

// Re-export all generated types from storefront.types
export type {
  Maybe,
  Exact,
  MoneyV2,
  CurrencyCode,
  Image,
  Product,
  ProductOption,
  ProductOptionValue,
  Swatch,
  ProductVariant,
  SelectedOption,
  ImageConnection,
  ImageEdge,
  Scalars,
  CountryCode,
  LanguageCode,
  MediaContentType
} from "./storefront.types"

// Re-export operation types
export type {
  ProductByHandleQueryVariables,
  ProductByHandleQuery,
  ProductByHandleFragment,
  VariantFragment,
  ProductsByIdsQueryVariables,
  ProductsByIdsQuery
} from "./storefront.generated"
