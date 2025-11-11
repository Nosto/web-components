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

  // augmented fields
  price: ShopifyMoney
  compareAtPrice: ShopifyMoney | null
  variants: ShopifyVariant[]
}

export type ShopifyImage = {
  altText: string | null
  height: number
  width: number
  thumbhash: string | null
  url: string
}

export type ShopifyOption = {
  name: string
  optionValues: ShopifyOptionValue[]
}

export type ShopifyOptionValue = {
  firstSelectableVariant: ShopifyVariant
  adjacentVariants: ShopifyVariant[]
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
  product?: {
    onlineStoreUrl: string
  }
}

export type ShopifySelectedOption = {
  name: string
  value: string
}

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
