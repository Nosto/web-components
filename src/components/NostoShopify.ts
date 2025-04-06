import { migrateToShopifyMarket } from "@/store/actions"
import { customElement } from "./decorators"

@customElement("nosto-shopify")
export class NostoShopify extends HTMLElement {
  static attributes = {
    markets: Boolean
  }

  markets!: boolean

  connectedCallback() {
    initShopify(this)
  }
}

function initShopify(element: NostoShopify) {
  const campaignId = element.closest(".nosto_element")?.id
  if (!campaignId) {
    throw new Error("Found no wrapper element with class 'nosto_element'")
  }
  if (element.markets) {
    migrateToShopifyMarket(campaignId)
  }
}
