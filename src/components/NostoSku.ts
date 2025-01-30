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
      const skuItemsAttrValue = wrapperElement.getAttribute("n-sku-items")

      if (!skuItemsAttrValue) {
        throw new Error("SKU option type value not specified for [n-sku-items] attribute")
      }

      const noSkuItems = wrapperElement.querySelectorAll("[n-sku-item]")

      if (!noSkuItems.length) {
        throw new Error(
          "No elements with [n-sku-item] attribute found. All sku option items should have this attribute"
        )
      }

      const noSkuIdAttr = wrapperElement.querySelectorAll(':not([n-sku-item-id]), [n-sku-item-id=""]')

      if (noSkuIdAttr.length) {
        throw new Error(
          "[n-sku-item-id] not setup for sku options. This attribute should be assigned the id of the sku"
        )
      }
    })
  }

  /**
   * Registers click event handler for each sku option displayed for every SKU fields
   */
  _registerSkuListeners() {
    const productSkuElements = this.querySelectorAll("[n-sku-items]")
    productSkuElements.forEach(skuElement => {
      skuElement.querySelectorAll("[n-sku-item]").forEach(skuItem => {
        skuItem.addEventListener("click", () => this._handleOptionClick(skuElement, skuItem))
      })
    })
  }

  /**
   * The click handler for the selected SKU option
   * 1. Adds selected attribute on the clicked item
   * 2. Removes selected attribute for other unrelated SKU options
   * 2. Displays the lower level SKU fields, corresponding to the selected value, if it's not already
   * 3. Hides the lower level SKU fields, NOT corresponding to the selected value, if it's not already
   *
   * @param skuElement the wrapper element of the clicked SKU option with [n-sku-items] attribute
   * @param skuItem the clicked SKU option
   */
  _handleOptionClick(skuElement: Element, skuItem: Element) {
    const { skuId, skuItemValue, nextLayer } = this._extractAttributes(skuElement, skuItem)
    skuItem.toggleAttribute("selected")
    if (!skuId) {
      return
    }
    skuElement
      .querySelectorAll(`[n-sku-item]:not([n-sku-item-id="${skuId}"])`)
      .forEach(otherSkuOption => otherSkuOption.removeAttribute("selected"))

    if (nextLayer && skuItemValue) {
      const nextLayerKey = `${skuItemValue.toLowerCase()}-${nextLayer}`
      this._enableItem(`[n-sku-items="${nextLayerKey}"]`)
      this._disableItem(`[n-sku-items]:not([n-sku-items="${nextLayerKey}"])`, skuElement)
    }
  }

  /**
   * Enables the item matched by selector
   * 1. Sets the display to flex
   * 2. Adds the selected attribute to the first option
   *
   * @param selector the selector for the element to be enabled/displayed
   */
  _enableItem(selector: string) {
    const nextLayerElement = this.querySelector<HTMLElement>(selector)
    if (nextLayerElement) {
      nextLayerElement.style.display = "flex"
      nextLayerElement.querySelector("[n-sku-item]")?.toggleAttribute("selected")
    }
  }

  /**
   * Disables the item matched by selector
   * 1. Sets the display to none
   * 2. Removes the selected attribute from all the options
   *
   * @param selector the selector for the element to be disabled/hidden
   * @param selectedElement the active selected element that should be displayed to be skipped
   */
  _disableItem(selector: string, selectedElement: Element) {
    this.querySelectorAll<HTMLElement>(selector).forEach(otherLayerElement => {
      if (otherLayerElement !== selectedElement) {
        otherLayerElement.style.display = "none"

        otherLayerElement.querySelectorAll("[n-sku-item]").forEach(element => element.removeAttribute("selected"))
      }
    })
  }

  /**
   * Extracts the necessary Nosto attribute values (n-sku-*) and label from the supplied elements
   *
   * @param skuElement the wrapper element with [n-sku-items] from which the reference to next layer of options to be fetched
   * @param skuItem the SKU option clicked from which the SKU Id / label to be fetched
   */
  _extractAttributes(skuElement: Element, skuItem: Element) {
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
