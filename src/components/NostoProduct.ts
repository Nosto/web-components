export class NostoProduct extends HTMLElement {
  static observedAttributes = ["product-id", "reco-id"]
  private _selectedSkuId: string | undefined

  constructor() {
    super()
    this._selectedSkuId = undefined
  }

  connectedCallback() {
    this.validate()
    this.registerSKUSelectors()
    this.registerSKUIds()
    this.registerATCButtons()
  }

  get productId() {
    return this.getAttribute("product-id")!
  }

  get recoId() {
    return this.getAttribute("reco-id")!
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
    this.querySelectorAll<HTMLSelectElement>("select[n-sku-selector]").forEach(element => {
      this._selectedSkuId = element.value
      element.addEventListener("change", () => (this._selectedSkuId = element.value))
    })
  }

  registerSKUIds() {
    this.querySelectorAll("[n-sku-id]:not([n-atc])").forEach(element => {
      element.addEventListener("click", () => {
        this._selectedSkuId = element.getAttribute("n-sku-id")!
      })
    })
  }

  registerATCButtons() {
    this.querySelectorAll("[n-atc]").forEach(element =>
      element.addEventListener("click", () => {
        const skuId = element.closest("[n-sku-id]")?.getAttribute("n-sku-id") || this._selectedSkuId
        this.addSkuToCart(skuId)
      })
    )
  }

  addSkuToCart(skuId: string | undefined) {
    console.info(`Add to cart event triggered for the product ${this.productId} and the sku ${skuId}`)
    if (window.Nosto && typeof window.Nosto.addSkuToCart === "function") {
      if (skuId) {
        window.Nosto.addSkuToCart({ productId: this.productId, skuId }, this.recoId, 1)
        console.info("Add to cart event registered.")
      } else {
        console.info(`skuId missing for product ${this.productId}`)
      }
    }
  }
}

try {
  customElements.define("nosto-product", NostoProduct)
} catch (e) {
  console.error(e)
}
