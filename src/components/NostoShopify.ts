import { migrateToShopifyMarket } from "@/store/actions"
import { customElement } from "./decorators"

@customElement("nosto-shopify")
export class NostoShopify extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    const campaignId = this.closest(".nosto_element")?.id
    if (!campaignId) {
      throw new Error("Found no wrapper element with class 'nosto_element'")
    }
    if (this.hasAttribute("markets")) {
      migrateToShopifyMarket(campaignId)
    }
  }
}
