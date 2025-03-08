import { LitElement, html } from "lit"
import { customElement } from "lit/decorators.js"
import { createStore, provideStore, Store } from "../store"

@customElement("nosto-product")
export class NostoProduct extends LitElement {
  static properties = {
    "product-id": { type: String, attribute: "product-id" },
    "reco-id": { type: String, attribute: "reco-id" }
  }

  private _selectedSkuId: string | undefined
  private store!: Store

  constructor() {
    super()
  }

  connectedCallback() {
    super.connectedCallback()
    this.validate()
    this.store = createStore(this)
    provideStore(this, this.store)
    this.store.listen("selectedSkuId", selectedSkuId => {
      this._selectedSkuId = selectedSkuId
      this.toggleAttribute("sku-selected", !!selectedSkuId)
      this.requestUpdate(); // Request update when selectedSkuId changes
    })
  }

  firstUpdated() {
    this.registerSKUSelectors(this.store)
    this.registerSKUIds(this.store)
    this.registerATCButtons(this.store)
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

  // Since this component is primarily focusing on functionality rather than rendering its own content,
  // we'll create an empty render function and use createRenderRoot to allow light DOM rendering
  render() {
    return html``
  }

  // Use light DOM instead of shadow DOM to ensure CSS and event handling works as before
  createRenderRoot() {
    return this
  }
}
