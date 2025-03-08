import { createStore, provideStore, Store } from "../store"
import { attribute, customElement } from "./decorators"

@customElement("nosto-product")
class NostoProduct extends HTMLElement {
  private _selectedSkuId: string | undefined

  @attribute("product-id")
  accessor productId!: string

  @attribute("reco-id")
  accessor recoId!: string

  @attribute("sku-selected", Boolean)
  accessor skuSelected!: boolean

  constructor() {
    super()
  }

  connectedCallback() {
    this.validate()
    const store = createStore(this)
    provideStore(this, store)
    store.listen("selectedSkuId", selectedSkuId => {
      this._selectedSkuId = selectedSkuId
      this.skuSelected = !!selectedSkuId
    })
    this.registerSKUSelectors(store)
    this.registerSKUIds(store)
    this.registerATCButtons(store)
  }

  get selectedSkuId() {
    return this._selectedSkuId
  }

  private validate() {
    if (!this.productId) {
      throw new Error("Product ID is required.")
    }
    if (!this.recoId) {
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
      element.addEventListener("click", async () => {
        const skuId = element.closest("[n-sku-id]")?.getAttribute("n-sku-id")
        if (skuId) {
          selectSkuId(skuId)
        }
        await addToCart()
      })
    )
  }
}

export { NostoProduct }
