import { LitElement, html } from "lit"
import { customElement } from "lit/decorators.js"
import { migrateToShopifyMarket } from "@/store/actions"

@customElement("nosto-shopify")
export class NostoShopify extends LitElement {
  static properties = {
    markets: { type: Boolean }
  }

  constructor() {
    super()
  }

  connectedCallback() {
    super.connectedCallback()
    const campaignId = this.closest(".nosto_element")?.id
    if (!campaignId) {
      throw new Error("Found no wrapper element with class 'nosto_element'")
    }
    if (this.hasAttribute("markets")) {
      migrateToShopifyMarket(campaignId)
    }
  }

  render() {
    return html``
  }

  // Use light DOM instead of shadow DOM to maintain compatibility with existing code
  createRenderRoot() {
    return this
  }
}
