/**
 * Props for the DynamicCard custom element
 */
export type DynamicCardProps = {
  /** The product handle to fetch data for. Required */
  handle: string
  /** The section to use for rendering the product */
  section?: string
  /** The template to use for rendering the product */
  template?: string
  /** The variant ID to fetch specific variant data */
  variantId?: string
  /** If true, the component will display placeholder content while loading */
  placeholder?: boolean
  /** If true, the component will only fetch data when it comes into view */
  lazy?: boolean
}
