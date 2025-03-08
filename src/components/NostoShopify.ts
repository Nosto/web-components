import { migrateToShopifyMarket } from "@/store/actions"
import { attribute, customElement } from "./decorators"

@customElement("nosto-shopify")
class NostoShopify extends HTMLElement {
  @attribute("markets", Boolean)
  accessor markets!: boolean

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

export { NostoShopify }
