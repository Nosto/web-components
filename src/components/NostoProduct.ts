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

  // FIXME do we need to expose this?
  get productId() {
    return this.getAttribute("product-id")!
  }

  // FIXME do we need to expose this?
  // for testing purposes
  get selectedSkuId() {
    return this._store?.selectedSkuId()
  }

  // FIXME do we need to expose this?
  get recoId() {
    return this.getAttribute("reco-id")!
  }

  // FIXME do we need to expose this?
  get store() {
    return this._store
  }

  // FIXME should this be private?
  validate() {
    if (!this.getAttribute("product-id")) {
      throw new Error("Product ID is required.")
    }

    if (!this.getAttribute("reco-id")) {
      throw new Error("Slot ID is required.")
    }
  }

  // FIXME should this be private?
  registerSKUSelectors() {
    const { selectSkuId } = this._store!
    this.querySelectorAll<HTMLSelectElement>("select[n-sku-selector]").forEach(element => {
      selectSkuId(element.value)
      element.addEventListener("change", () => selectSkuId(element.value))
    })
  }

  // FIXME should this be private?
  registerSKUIds() {
    const { selectSkuId } = this._store!
    this.querySelectorAll("[n-sku-id]:not([n-atc])").forEach(element => {
      element.addEventListener("click", () => {
        selectSkuId(element.getAttribute("n-sku-id")!)
      })
    })
  }

  // FIXME should this be private?
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
