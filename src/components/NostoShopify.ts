import { customElement } from "./decorators"

/**
 * Custom element that integrates Nosto with Shopify.
 *
 * This element should be placed inside a Nosto element container. It detects the parent
 * Nosto element and performs integration operations based on the attributes provided.
 *
 * @property markets - Boolean flag that when true, migrates the parent Nosto element to Shopify Market
 * @property product - Selector for the product section element
 * @property url - Selector for the product URL element
 * @property title - Selector for the product title element
 * @property handle - Selector for the product handle attribute
 * @property price - Selector for the product price element
 * @property listPrice - Selector for the product list price element
 * @property defaultVariantId - Selector for the default variant ID attribute
 * @property description - Selector for the product description element
 *
 * @throws Error - When there is no parent element with class 'nosto_element'
 *
 * @example
 * ```html
 * <div id="campaign123" class="nosto_element">
 *   <nosto-shopify markets></nosto-shopify>
 * </div>
 * ```
 */
@customElement("nosto-shopify")
export class NostoShopify extends HTMLElement {
  static attributes = {
    markets: Boolean,
    product: String,
    url: String,
    title: String,
    handle: String,
    price: String,
    listPrice: String,
    defaultVariantId: String,
    description: String
  }

  markets!: boolean
  product!: string
  url!: string
  title!: string
  handle!: string
  price!: string
  listPrice!: string
  defaultVariantId!: string
  description!: string

  connectedCallback() {
    const campaignId = this.closest(".nosto_element")?.id
    if (!campaignId) {
      throw new Error("Found no wrapper element with class 'nosto_element'")
    }
    if (this.markets) {
      migrateToShopifyMarket(this, campaignId)
    }
  }
}

function migrateToShopifyMarket(element: NostoShopify, campaignId: string) {
  if (window.Nosto?.migrateToShopifyMarket) {
    window.Nosto.migrateToShopifyMarket({
      productSectionElement: `#${campaignId} ${element.product || "nosto-product"}`,
      productUrlElement: element.url || `[n-url]`,
      productTitleElement: element.title || `[n-title]`,
      productHandleAttribute: element.handle || "[n-handle]",
      priceElement: element.price || `[n-price]`,
      listPriceElement: element.listPrice || `[n-list-price]`,
      defaultVariantIdAttribute: element.defaultVariantId || "[n-variant-id]",
      descriptionElement: element.description || `[n-description]`
      // TODO totalVariantOptions
      // TODO variantSelector
    })
  }
}
