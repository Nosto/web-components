import { createShopifyUrl } from "@/utils"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"
import { getJSON } from "@/utils/fetch"
import { ShopifyProduct } from "./types"
import { createDialog } from "./markup"
// depends on Product & SkuOptions internally
import "../Product/Product"
import "../SkuOptions/SkuOptions"

/**
 * A custom element that provides a "quick view" feature for products.
 * When clicked, it fetches product data from a Shopify store using the provided product handle
 * and displays the product details in a modal dialog.
 */
@customElement("nosto-quick-view")
export class QuickView extends NostoElement {
  /** @private */
  static attributes = {
    handle: String,
    recoId: String
  }

  handle!: string
  recoId!: string
  #data?: ShopifyProduct
  #dialog?: HTMLDialogElement

  connectedCallback() {
    if (!this.handle) {
      throw new Error("handle attribute is required for QuickView")
    }
    this.addEventListener("click", this)
  }

  async handleEvent(event: Event) {
    if (event.type === "click") {
      event.preventDefault()
      if (!this.#data) {
        this.#data = await getDataForHandle(this.handle)
      }
      if (!this.#dialog) {
        this.#dialog = createDialog(this.#data, this.recoId)
        this.appendChild(this.#dialog)
      }
      this.#dialog!.showModal()
    }
  }
}

async function getDataForHandle(handle: string) {
  const target = createShopifyUrl(`products/${handle}.js`)
  return getJSON(target.href) as Promise<ShopifyProduct>
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-quick-view": QuickView
  }
}
