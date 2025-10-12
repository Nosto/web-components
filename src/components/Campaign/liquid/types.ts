/**
 * Settings object exposed to liquid templates for Campaign rendering
 * Contains all mapped attributes from Campaign, SimpleCard, VariantSelector and SectionCampaign components
 */
export interface Settings {
  // Campaign component attributes
  /** The placement identifier for the campaign */
  campaignPlacement: string
  /** If true, the component will only load the campaign when it comes into view */
  campaignLazy?: boolean
  /** If true, the component will reload the campaign whenever a cart update event occurs */
  campaignCartSynced?: boolean

  // Layout and mode settings
  /** Rendering mode - determines which components and templates are used */
  mode: "simple" | "native" | "section"
  /** Layout type - grid renders products in a grid, carousel renders in a swiper-based carousel */
  layout: "grid" | "carousel"

  // SimpleCard component attributes (used in simple mode)
  /** Show alternate product image on hover */
  simpleAlternate?: boolean
  /** Show brand/vendor data */
  simpleBrand?: boolean
  /** Show discount data */
  simpleDiscount?: boolean
  /** Product rating display */
  simpleRating?: boolean
  /** The sizes attribute for responsive images */
  simpleSizes?: string

  // VariantSelector component attributes (optional in SimpleCard)
  /** If true, preselects the first available variant */
  variantSelectorPreselect?: boolean
  /** Controls whether VariantSelector should be rendered */
  variantSelector?: boolean

  // DynamicCard component attributes (used in native mode)
  /** The section to be used for DynamicCard rendering */
  dynamicSection?: string
  /** The template to be used for DynamicCard rendering */
  dynamicTemplate?: string

  // SectionCampaign component attributes (used in section mode)
  /** The section to be used for Section Rendering API based rendering */
  sectionCampaignSection?: string
}
