import { createStore, Store } from "./store"

export class NostoProduct extends HTMLElement {
  static observedAttributes = ["product-id", "reco-id"]
  private _store: Store | undefined

  constructor() {
    super()
  }

  connectedCallback() {
    this._store = createStore(this.productId, this.recoId)
    this.validate()
    this.registerSKUSelectors()
    this.registerSKUIds()
    this.registerATCButtons()
  }

  get productId() {
    return this.getAttribute("product-id")!
  }

  // for testing purposes
  get selectedSkuId() {
    return this._store?.selectedSkuId()
  }

  get recoId() {
    return this.getAttribute("reco-id")!
  }

  get store() {
    return this._store
  }

  validate() {
    if (!this.getAttribute("product-id")) {
      throw new Error("Product ID is required.")
    }

    if (!this.getAttribute("reco-id")) {
      throw new Error("Slot ID is required.")
    }
  }

  registerSKUSelectors() {
    const { selectSkuId } = this._store!
    this.querySelectorAll<HTMLSelectElement>("select[n-sku-selector]").forEach(element => {
      selectSkuId(element.value)
      element.addEventListener("change", () => selectSkuId(element.value))
    })
  }

  registerSKUIds() {
    const { selectSkuId } = this._store!
    this.querySelectorAll("[n-sku-id]:not([n-atc])").forEach(element => {
      element.addEventListener("click", () => {
        selectSkuId(element.getAttribute("n-sku-id")!)
      })
    })
  }

  registerATCButtons() {
    const { addToCart, selectSkuId } = this._store!
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
