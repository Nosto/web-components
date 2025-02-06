import { createStore, Store } from "../store"

type Callback = (store: Store) => void

export class NostoProduct extends HTMLElement {
  static observedAttributes = ["product-id", "reco-id"]
  private _selectedSkuId: string | undefined
  private _store: Store | undefined

  constructor() {
    super()
  }

  connectedCallback() {
    this.validate()
    const store = createStore(this.productId, this.recoId)
    this._store = store
    store.onChange(({ selectedSkuId }) => (this._selectedSkuId = selectedSkuId))

    this.addEventListener("sku-options-init", event => {
      event.stopPropagation()
      const callback = (event as CustomEvent).detail as Callback
      callback(store)
    })

    this.registerSKUSelectors(store)
    this.registerSKUIds(store)
    this.registerATCButtons(store)
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

  get store() {
    return this._store
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

  private registerATCButtons({ addToCart, selectSkuId }: Store) {
    this.querySelectorAll("[n-atc]").forEach(element =>
      element.addEventListener("click", () => {
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
