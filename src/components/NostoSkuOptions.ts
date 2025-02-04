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

  registerStateChange(store: Store, optionElements: HTMLElement[]) {
    store.onChange(state => {
      const selectedSkuIds = intersectionOf(...Object.values(state.skuOptions))

      optionElements.forEach(option => {
        const skuIds = getSkus(option)
        if (!intersectionOf(skuIds, selectedSkuIds).length) {
          option.style.display = "none"
        } else {
          option.style.display = "block"
        }
      })
    })
  }

  registerClickEvents(store: Store, optionElements: HTMLElement[]) {
    const optionId = this.getAttribute("n-options")!
    optionElements.forEach(option => {
      option.addEventListener("click", () => {
        const skuIds = getSkus(option)
        option.setAttribute("selected", "")
        optionElements.filter(o => o !== option).forEach(o => o.removeAttribute("selected"))
        store.selectSkuOption(optionId, skuIds)
      })
    })
  }
}

try {
  customElements.define("nosto-sku-options", NostoSkuOptions)
} catch (e) {
  console.error(e)
}
