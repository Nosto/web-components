export class NostoProduct extends HTMLElement {
  static observedAttributes = ["product-id", "selected-sku-id", "slot-id"]

  constructor() {
    super()
  }

  connectedCallback() {
    this.validate()
    this.registerSKUSelectors()
    this.registerATCButtonEvent()
  }

  get productId() {
    return this.getAttribute("product-id")!
  }

  get selectedSkuId() {
    return this.getAttribute("selected-sku-id")!
  }

  set selectedSkuId(value: string) {
    this.setAttribute("selected-sku-id", value)
  }

  get slotId() {
    return this.getAttribute("slot-id")!
  }

  validate() {
    if (!this.getAttribute("product-id")) {
      throw new Error("Product ID is required.")
    }

    if (!this.getAttribute("slot-id")) {
      throw new Error("Slot ID is required.")
    }
  }

  registerSKUSelectors() {
    this.querySelectorAll<HTMLSelectElement>("[n-sku-selector]").forEach(element => {
      this.selectedSkuId = element.value
      element.addEventListener("change", () => (this.selectedSkuId = element.value))
    })
  }

  registerATCButtonEvent() {
    const buttonATC = this.querySelector("[n-atc]")

    if (!buttonATC) {
      console.warn("Add to cart button with attribute [n-atc] not found. Skipping ATC event registration.")
      return
    }

    this.querySelectorAll("[n-atc]").forEach(element =>
      element.addEventListener("click", () => {
        const skuId = this.selectedSkuId || element.getAttribute("n-sku-id")
        console.log(`Add to cart event triggered for the product ${this.productId} and the sku ${skuId}`)
        if (window.Nosto && typeof window.Nosto.addSkuToCart === "function") {
          if (skuId) {
            window.Nosto.addSkuToCart({ productId: this.productId, skuId }, this.slotId, 1)
            console.log("Add to cart event registered.")
          } else {
            console.log(`skuId missing for product ${this.productId}`)
          }
        }
      })
    )
  }
}

try {
  customElements.define("nosto-product", NostoProduct)
} catch (e) {
  console.error(e)
}
