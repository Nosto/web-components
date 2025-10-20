export type ShopifyVariant = {
  id: number
  available: boolean
  options: string[]
}

export type ShopifyOption = {
  name: string
  values: string[]
}

export type ShopifyProduct = {
  options: ShopifyOption[]
  variants: ShopifyVariant[]
  // Keep these minimal fields for compatibility
  id?: number
  title?: string
  handle?: string
}

/**
 * Event detail for variant change events
 */
export type VariantChangeDetail = {
  variant: ShopifyVariant
}
