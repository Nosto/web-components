export type Position = 1 | 2 | 3

export interface VariantOptionSelector {
  titleElement?: string
  optionElement?: string
  selectedElement?: string
  position: Position
  primaryVariantSelector?: VariantOptionSelector
  dependentVariantSelector?: VariantOptionSelector
}

export interface RecProductElementSelectors {
  productSectionElement: string
  productUrlElement: string
  productTitleElement: string
  productHandleAttribute: string
  priceElement: string
  defaultVariantIdAttribute?: string
  listPriceElement?: string
  descriptionElement?: string
  categoryNameElement?: string
  totalVariantOptions?: number
  variantSelector?: VariantOptionSelector
}

// function signature
export type MigrateToShopifyMarket = (selectors: RecProductElementSelectors) => void
