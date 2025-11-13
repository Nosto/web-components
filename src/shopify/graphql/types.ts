import type * as StorefrontTypes from "@/types/storefront.types"
import type { ProductByHandleQuery, VariantFragmentFragment } from "@/types/storefront.generated"

// Extract the product type from the generated query type
type GeneratedProduct = NonNullable<ProductByHandleQuery["product"]>

export type ShopifyProduct = Omit<GeneratedProduct, "images" | "featuredImage" | "options"> & {
  // Flattened images array from the connection
  images: ShopifyImage[]
  featuredImage: ShopifyImage
  options: ShopifyOption[]

  // augmented fields
  price: ShopifyMoney
  compareAtPrice: ShopifyMoney | null
  variants: ShopifyVariant[]
}

export type ShopifyImage = {
  altText?: string | null
  height?: number
  width?: number
  thumbhash?: string | null
  url: string
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

export type ShopifyVariant = Omit<
  VariantFragmentFragment,
  "price" | "compareAtPrice" | "image" | "selectedOptions" | "product"
> & {
  image?: ShopifyImage
  price: ShopifyMoney
  compareAtPrice: ShopifyMoney | null
  selectedOptions?: ShopifySelectedOption[]
  product?: {
    onlineStoreUrl: string
  }
}

export type ShopifySelectedOption = StorefrontTypes.SelectedOption

export type ShopifyMoney = {
  currencyCode: string
  amount: string
}

/**
 * Event detail for variant change events
 */
export type VariantChangeDetail = {
  variant: ShopifyVariant
}
