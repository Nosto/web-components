export class NostoProduct extends HTMLElement {
  static observedAttributes = ["productId", "skuId", "slotId"]

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
    return this.getAttribute("productId")!
  }

  get skuId() {
    return this.getAttribute("skuId")!
  }

  get slotId() {
    return this.getAttribute("slotId")!
  }

  validate() {
    if (!this.getAttribute("productId")) {
      throw new Error("Product ID is required.")
    }

    if (!this.getAttribute("skuId")) {
      throw new Error("Sku ID is required.")
    }

    if (!this.getAttribute("slotId")) {
      throw new Error("Slot ID is required.")
    }
  }

  registerATCButtonEvent() {
    const buttonATC = this.querySelector("[n-atc]")

    if (!buttonATC) {
      console.warn("Add to cart button with attribute [n-atc] not found. Skipping ATC event registration.")
      return
    }

    this.querySelector("[n-atc]")?.addEventListener("click", () => {
      if (window.Nosto && typeof window.Nosto.addSkuToCart === "function") {
        window.Nosto.addSkuToCart({ productId: this.productId, skuId: this.skuId }, this.slotId, 1)
      }
    })
  }
}

try {
  customElements.define("nosto-product", NostoProduct)
} catch (e) {
  console.error(e)
}
