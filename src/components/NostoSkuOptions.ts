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
    const store = this.closest<NostoProduct>("nosto-product")!.store!
    const optionElements = Array.from(this.querySelectorAll<HTMLElement>("[n-option]"))
    this.registerClickEvents(store, optionElements)
    this.registerStateChange(store, optionElements)
  }

  registerStateChange({ onChange }: Store, optionElements: HTMLElement[]) {
    onChange(state => {
      // TODO introduce cached version of this in store ?
      const selectedSkuIds = intersectionOf(...Object.values(state.skuOptions))

      optionElements.forEach(option => {
        const available = intersectionOf(getSkus(option), selectedSkuIds).length
        option.toggleAttribute("disabled", !available)
      })
    })
  }

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
