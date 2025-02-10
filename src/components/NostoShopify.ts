import { migrateToShopifyMarket } from "@/store/actions"

export class NostoShopify extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    const campaignId = this.closest(".nosto-element")?.id
    if (!campaignId) {
      throw new Error("Found no wrapper element with class 'nosto-element'")
    }
    if (this.hasAttribute("markets")) {
      migrateToShopifyMarket(campaignId)
    }
  }
}

try {
  customElements.define("nosto-shopify", NostoShopify)
} catch (e) {
  console.error(e)
}
