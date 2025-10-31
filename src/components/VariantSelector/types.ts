/**
 * Props for the VariantSelector custom element
 */
export type VariantSelectorProps = {
  /** The Shopify product handle to fetch data for. Required */
  handle: string
  /** The ID of the variant to preselect on load */
  variantId?: number
  /** Whether to automatically preselect the options of the first available variant */
  preselect?: boolean
  /** Whether to only show options leading to available variants */
  filtered?: boolean
  /** If true, the component will display placeholder content while loading */
  placeholder?: boolean
}
