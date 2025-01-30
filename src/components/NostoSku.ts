export class NostoSku extends HTMLElement {
  static observedAttributes = ["depth", "separator", "sku-options"]

  constructor() {
    super()
  }

  connectedCallback() {
    this.validate()
    this._registerSkuListeners()
  }

  get depth() {
    const depth = this.getAttribute("depth")
    return Number(depth) || 1
  }

  get separator() {
    return this.getAttribute("separator") || "/"
  }

  get options() {
    const options = this.getAttribute("sku-options")
    if (options) {
      return options as unknown as Array<string>
    }
    return []
  }

  validate() {
    const productSkuElements = this.querySelectorAll("[n-sku-items]")

    if (!productSkuElements.length) {
      throw new Error(
        "No elements with [n-sku-items] attribute found. This attribute is required on the wrapper element of SKU options"
      )
    }

    Array.from(productSkuElements).forEach(wrapperElement => {
      const noSkuItems = wrapperElement.querySelectorAll("[n-sku-item]")

      if (!noSkuItems.length) {
        throw new Error(
          "No elements with [n-sku-item] attribute found. All sku option items should have this attribute"
        )
      }

      const skuItemsAttrValue = wrapperElement.getAttribute("n-sku-items")

      if (!skuItemsAttrValue) {
        throw new Error("SKU option type value not specified for [n-sku-items] attribute")
      }

      const noSkuIdAttr = wrapperElement.querySelectorAll(':not([n-sku-item-id]), [n-sku-item-id=""]')

      if (noSkuIdAttr.length) {
        throw new Error(
          "[n-sku-item-id] not setup for sku options. This attribute should be assigned the id of the sku"
        )
      }
    })
  }

  _registerSkuListeners() {
    const productSkuElements = this.querySelectorAll("[n-sku-items]")
    productSkuElements.forEach(skuElement => {
      skuElement.querySelectorAll("[n-sku-item]").forEach(skuItem => {
        skuItem.addEventListener("click", () => this._handleOptionClick(skuElement, skuItem))
      })
    })
  }

  _handleOptionClick(skuElement: Element, skuItem: Element) {
    const { skuId, skuItemValue, nextLayer } = this._getOptionValue(skuElement, skuItem)
    skuItem.toggleAttribute("selected")
    if (!skuId) {
      return
    }
    skuElement
      .querySelectorAll(`[n-sku-item]:not([n-sku-item-id="${skuId}"])`)
      .forEach(otherSkuOption => otherSkuOption.removeAttribute("selected"))

    if (nextLayer && skuItemValue) {
      const nextLayerKey = `${skuItemValue.toLowerCase()}-${nextLayer}`
      const nextLayerElement = this.querySelector<HTMLElement>(`[n-sku-items="${nextLayerKey}"]`)
      if (nextLayerElement) {
        nextLayerElement.style.display = "flex"
        nextLayerElement.querySelector("[n-sku-item]")?.toggleAttribute("selected")
      }
      this.querySelectorAll<HTMLElement>(`[n-sku-items]:not([n-sku-items="${nextLayerKey}"])`).forEach(
        otherLayerElement => {
          if (otherLayerElement !== skuElement) {
            otherLayerElement.style.display = "none"

            otherLayerElement
              .querySelectorAll<HTMLElement>("[n-sku-item]")
              .forEach(element => element.removeAttribute("selected"))
          }
        }
      )
    }
  }

  _getOptionValue(skuElement: Element, skuItem: Element) {
    const nextLayer = skuElement.getAttribute("n-next-layer-option")
    const skuId = skuItem.getAttribute("n-sku-item-id")
    const skuItemValue = skuItem.textContent?.trim()

    return { nextLayer, skuId, skuItemValue }
  }
}

try {
  customElements.define("nosto-sku", NostoSku)
} catch (e) {
  console.error(e)
}
