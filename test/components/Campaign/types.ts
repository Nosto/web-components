/**
 * Settings object exposed to liquid templates for Campaign rendering
 * Contains all mapped attributes from Campaign, SimpleCard, VariantSelector and SectionCampaign components
 */
export interface Settings {
  // Campaign component attributes
  /** The placement identifier for the campaign */
  placement: string
  /** If true, the component will only load the campaign when it comes into view */
  lazy?: boolean
  /** If true, the component will reload the campaign whenever a cart update event occurs */
  cartSynced?: boolean

  // Layout and mode settings
  /** Rendering mode - determines which components and templates are used */
  mode: "simple" | "native" | "section"
  /** Layout type - grid renders products in a grid, carousel renders in a swiper-based carousel */
  layout: "grid" | "carousel"

  // SimpleCard component attributes (used in simple mode)
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
  /** Controls whether VariantSelector should be rendered */
  variantSelector?: boolean

  // SectionCampaign component attributes (used in section mode)
  /** The section to be used for Section Rendering API based rendering */
  section?: string
}
