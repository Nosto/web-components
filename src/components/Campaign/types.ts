/**
 * Props for the Campaign custom element
 */
export type CampaignProps = {
  /** The placement identifier for the campaign */
  placement: string
  /** The ID of the product to associate with the campaign */
  productId?: string
  /** The variant ID of the product */
  variantId?: string
  /** The ID of the template to use for rendering the campaign */
  template?: string
  /** If set to "false", the component will not automatically load the campaign on connection. Defaults to "true" */
  init?: string
  /** If true, the component will only load the campaign when it comes into view using IntersectionObserver */
  lazy?: boolean
  /** If true, the component will reload the campaign whenever a cart update event occurs */
  cartSynced?: boolean
}
