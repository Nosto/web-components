import { createStore, provideStore, Store } from "../store"
import { customElement } from "./decorators"

@customElement("nosto-product")
export class NostoProduct extends HTMLElement {
  static attributes = {
    productId: String,
    recoId: String,
    skuSelected: Boolean
  }

  selectedSkuId: string | undefined
  productId!: string
  recoId!: string
  skuSelected!: boolean

  constructor() {
    super()
  }

  connectedCallback() {
    this.validate()
    init(this, createStore(this))
  }

  private validate() {
    if (!this.productId) {
      throw new Error("Product ID is required.")
    }
    if (!this.recoId) {
      throw new Error("Slot ID is required.")
    }
  }
}

function init(el: NostoProduct, store: Store) {
  provideStore(el, store)
  const { listen, selectSkuId, addToCart } = store

  listen("selectedSkuId", selectedSkuId => {
    el.selectedSkuId = selectedSkuId
    el.skuSelected = !!selectedSkuId
  })

  function registerSKUSelectors() {
    el.querySelectorAll<HTMLSelectElement>("select[n-sku-selector]").forEach(element => {
      selectSkuId(element.value)
      element.addEventListener("change", () => selectSkuId(element.value))
    })
  }

  function registerSKUIds() {
    el.querySelectorAll("[n-sku-id]:not([n-atc])").forEach(element => {
      element.addEventListener("click", () => {
        selectSkuId(element.getAttribute("n-sku-id")!)
      })
    })
  }

  function registerATCButtons() {
    el.querySelectorAll("[n-atc]").forEach(element =>
      element.addEventListener("click", async () => {
        const skuId = element.closest("[n-sku-id]")?.getAttribute("n-sku-id")
        if (skuId) {
          selectSkuId(skuId)
        }
        await addToCart()
      })
    )
  }

  registerSKUSelectors()
  registerSKUIds()
  registerATCButtons()
}
