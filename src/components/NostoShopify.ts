import { migrateToShopifyMarket } from "@/store/actions"
import { customElement } from "./decorators"

/**
 * Custom element that integrates Nosto with Shopify.
 *
 * This element should be placed inside a Nosto element container. It detects the parent
 * Nosto element and performs integration operations based on the attributes provided.
 *
 * @property markets - Boolean flag that when true, migrates the parent Nosto element to Shopify Market
 *
 * @throws Error - When there is no parent element with class 'nosto_element'
 *
 * @example
 * <div id="campaign123" class="nosto_element">
 *   <nosto-shopify markets></nosto-shopify>
 * </div>
 */
@customElement("nosto-shopify")
export class NostoShopify extends HTMLElement {
  static attributes = {
    markets: Boolean
  }

  markets!: boolean

  constructor() {
    super()
  }

  connectedCallback() {
    const campaignId = this.closest(".nosto_element")?.id
    if (!campaignId) {
      throw new Error("Found no wrapper element with class 'nosto_element'")
    }
    if (this.markets) {
      migrateToShopifyMarket(campaignId)
    }
  }
}
