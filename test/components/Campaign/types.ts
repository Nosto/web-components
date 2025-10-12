/**
 * Campaign layout types for controlling how products are displayed
 */
export type CampaignLayout = "grid" | "carousel"

/**
 * Campaign rendering modes that determine which components are used
 */
export type CampaignMode = "simple" | "native" | "section"

/**
 * Settings object exposed to liquid templates for Campaign rendering
 * Contains all mapped attributes from Campaign, SimpleCard, VariantSelector and SectionCampaign components
 */
export interface CampaignSettings {
  // Campaign component attributes
  /** The placement identifier for the campaign */
  placement: string
  /** The ID of the product to associate with the campaign */
  productId?: string
  /** The variant ID of the product */
  variantId?: string
  /** The ID of the template to use for rendering the campaign */
  template?: string
  /** If set to "false", the component will not automatically load the campaign on connection */
  init?: string
  /** If true, the component will only load the campaign when it comes into view */
  lazy?: boolean
  /** If true, the component will reload the campaign whenever a cart update event occurs */
  cartSynced?: boolean

  // Layout and mode settings
  /** Layout type - grid renders products in a grid, carousel renders in a swiper-based carousel */
  layout: CampaignLayout
  /** Rendering mode - determines which components and templates are used */
  mode: CampaignMode

  // SimpleCard component attributes (used in simple mode)
  /** The Shopify product handle to fetch data for */
  handle?: string
  /** Show alternate product image on hover */
  alternate?: boolean
  /** Show brand/vendor data */
  brand?: boolean
  /** Show discount data */
  discount?: boolean
  /** Product rating (0-5 stars) */
  rating?: number
  /** The sizes attribute for responsive images */
  sizes?: string

  // VariantSelector component attributes (optional in SimpleCard)
  /** If true, preselects the first available variant */
  preselect?: boolean

  // SectionCampaign component attributes (used in section mode)
  /** The section to be used for Section Rendering API based rendering */
  section?: string

  // Additional template context
  /** Campaign title/heading text */
  title?: string
  /** Array of products to render - can be JSONProduct or similar structures */
  products?: unknown[]
}
