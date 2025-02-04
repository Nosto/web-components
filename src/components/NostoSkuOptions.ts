import { intersectionOf } from "@/utils"
import { NostoProduct } from "./NostoProduct"
import { Store } from "./store"

function getSkus(element: Element) {
  return (element.getAttribute("n-skus") || "").split(",")
}

export class NostoSkuOptions extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    // FIXME can we fetch the store for this element in a more neutral way?
    const store = this.closest<NostoProduct>("nosto-product")!.store!
    const optionElements = Array.from(this.querySelectorAll<HTMLElement>("[n-option]"))
    this.registerClickEvents(store, optionElements)
    this.registerStateChange(store, optionElements)
  }

  // FIXME make private?
  registerStateChange({ onChange }: Store, optionElements: HTMLElement[]) {
    const optionId = this.getAttribute("name")!
    onChange(state => {
      const selectedSkuIds = intersectionOf(
        ...Object.keys(state.skuOptions)
          .filter(key => key !== optionId)
          .map(key => state.skuOptions[key])
      )

      if (selectedSkuIds.length === 0) {
        optionElements.forEach(option => option.removeAttribute("disabled"))
        return
      }
      optionElements.forEach(option => {
        const available = intersectionOf(getSkus(option), selectedSkuIds).length
        option.toggleAttribute("disabled", !available)
      })
    })
  }

  // FIXME make private?
  registerClickEvents({ selectSkuOption }: Store, optionElements: HTMLElement[]) {
    const optionId = this.getAttribute("name")!
    optionElements.forEach(option => {
      option.addEventListener("click", () => {
        const skuIds = getSkus(option)
        option.toggleAttribute("selected", true)
        optionElements.filter(o => o !== option).forEach(o => o.removeAttribute("selected"))
        selectSkuOption(optionId, skuIds)
      })
    })
  }
}

try {
  customElements.define("nosto-sku-options", NostoSkuOptions)
} catch (e) {
  console.error(e)
}
