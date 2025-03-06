import { createStore, provideStore, Store } from "../store"

export class NostoProduct extends HTMLElement {
  static observedAttributes = ["product-id", "reco-id"]
  private _selectedSkuId: string | undefined

  constructor() {
    super()
  }

  connectedCallback() {
    this.validate()
    const store = createStore(this.productId, this.recoId)
    provideStore(this, store)
    store.listen("selectedSkuId", selectedSkuId => (this._selectedSkuId = selectedSkuId))
    this.registerSKUSelectors(store)
    this.registerSKUIds(store)
    this.registerProductATCButtons(store)
    this.registerSkuATCButtons(store)
  }

  get productId() {
    return this.getAttribute("product-id")!
  }

  get selectedSkuId() {
    return this._selectedSkuId
  }

  get recoId() {
    return this.getAttribute("reco-id")!
  }

  private validate() {
    if (!this.getAttribute("product-id")) {
      throw new Error("Product ID is required.")
    }

    if (!this.getAttribute("reco-id")) {
      throw new Error("Slot ID is required.")
    }
  }

  private registerSKUSelectors({ selectSkuId }: Store) {
    this.querySelectorAll<HTMLSelectElement>("select[n-sku-selector]").forEach(element => {
      selectSkuId(element.value)
      element.addEventListener("change", () => selectSkuId(element.value))
    })
  }

  private registerSKUIds({ selectSkuId }: Store) {
    this.querySelectorAll("[n-sku-id]:not([n-atc])").forEach(element => {
      element.addEventListener("click", () => {
        selectSkuId(element.getAttribute("n-sku-id")!)
      })
    })
  }

  private registerProductATCButtons({ addToCart, selectSkuId }: Store) {
    this.querySelectorAll(":scope > [n-atc]").forEach(element =>
      element.addEventListener("click", (event: Event) => {
        event.stopPropagation()
        const skuId = element.closest("[n-sku-id]")?.getAttribute("n-sku-id")
        if (skuId) {
          selectSkuId(skuId)
        }
        addToCart()
      })
    )
  }

  private registerSkuATCButtons({ addToCart, selectSkuId }: Store) {
    this.querySelectorAll("[n-sku-id] > [n-atc]").forEach(element =>
      element.addEventListener("click", (event: Event) => {
        event.stopPropagation()
        const skuId = element.closest("[n-sku-id]")?.getAttribute("n-sku-id")
        if (skuId) {
          selectSkuId(skuId)
        }
        addToCart()
      })
    )
  }
}

try {
  customElements.define("nosto-product", NostoProduct)
} catch (e) {
  console.error(e)
}
