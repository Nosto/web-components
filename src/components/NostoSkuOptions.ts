import { intersectionOf } from "@/utils"
import { injectStore, Store } from "../store"

function getSkus(element: Element) {
  return (element.getAttribute("n-skus") || "").split(",")
}

export class NostoSkuOptions extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.validate()
    injectStore(this, this.init.bind(this))
  }

  get name() {
    return this.getAttribute("name")!
  }

  private validate() {
    if (!this.getAttribute("name")) {
      throw new Error("Name is required.")
    }
  }

  private init(store: Store) {
    const optionElements = Array.from(this.querySelectorAll<HTMLElement>("[n-option]"))
    this.registerClickEvents(store, optionElements)
    this.registerStateChange(store, optionElements)
    this.handlePreselection(store, optionElements)
  }

  private registerStateChange({ onChange }: Store, optionElements: HTMLElement[]) {
    const optionId = this.name
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

  private handlePreselection({ selectSkuOption }: Store, optionElements: HTMLElement[]) {
    const optionId = this.name
    const selected = optionElements.find(o => o.hasAttribute("selected"))
    if (selected) {
      const skuIds = getSkus(selected)
      selectSkuOption(optionId, skuIds)
    }
  }

  private registerClickEvents({ selectSkuOption }: Store, optionElements: HTMLElement[]) {
    const optionId = this.name
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
