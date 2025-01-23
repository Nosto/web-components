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
    this.addEventListener("click", this.handleClickEvent.bind(this))
  }

  handleClickEvent(event: MouseEvent) {
    if (event.target instanceof Element && event.target.closest("[n-atc]")) {
      if (window.Nosto?.addSkuToCart) {
        window.Nosto.addSkuToCart({ productId: this.productId, skuId: this.skuId }, this.slotId, 1)
      }
    }
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
}

try {
  customElements.define("nosto-product", NostoProduct)
} catch (e) {
  console.error(e)
}
