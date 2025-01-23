export class NostoProduct extends HTMLElement {
  static observedAttributes = ["product-id", "sku-id", "slot-id"]

  constructor() {
    super()
  }

  connectedCallback() {
    this.validate()
    this.innerHTML = `
    <slot></slot>
    `
  }

  get productId() {
    return this.getAttribute("product-id")!
  }

  get skuId() {
    return this.getAttribute("sku-id")!
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

  registerATCButtonEvent() {
    const buttonATC = this.querySelector("[n-atc]")

    if (!buttonATC) {
      console.warn("Add to cart button with attribute [n-atc] not found. Skipping ATC event registration.")
      return
    }

    this.querySelectorAll("[n-atc]")?.forEach(element =>
      element.addEventListener("click", () => {
        if (window.Nosto && typeof window.Nosto.addSkuToCart === "function") {
          // window.Nosto.addSkuToCart({ productId: this.productId, skuId: this.skuId }, this.slotId, 1)
          console.log("Add to cart event registered.")
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
