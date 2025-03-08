import { intersectionOf } from "@/utils"
import { injectStore, Store } from "../store"
import { customElement, withProperties } from "./decorators"

function getSkus(element: Element) {
  return (element.getAttribute("n-skus") || "").split(",")
}

@customElement("nosto-sku-options")
@withProperties({ name: "name" })
export class NostoSkuOptions extends HTMLElement {
  name!: string

  constructor() {
    super()
  }

  connectedCallback() {
    this.validate()
    injectStore(this, this.init.bind(this))
  }

  private validate() {
    if (!this.name) {
      throw new Error("Name is required.")
    }
  }

  private init(store: Store) {
    store.registerOptionGroup()
    const optionElements = Array.from(this.querySelectorAll<HTMLElement>("[n-option]"))
    this.registerClickEvents(store, optionElements)
    this.registerStateChange(store, optionElements)
    this.handlePreselection(store, optionElements)
  }

  private registerStateChange({ listen }: Store, optionElements: HTMLElement[]) {
    const optionId = this.name
    listen("skuOptions", skuOptions => {
      const otherGroups = Object.keys(skuOptions)
        .filter(key => key !== optionId)
        .map(key => skuOptions[key])
      if (otherGroups.length === 0) {
        optionElements.forEach(option => option.removeAttribute("disabled"))
        return
      }
      function isAvailable(skuIds: string[]) {
        // an option is available if it intersects with all other groups
        return otherGroups.every(group => intersectionOf(group, skuIds).length > 0)
      }
      optionElements.forEach(option => {
        const available = isAvailable(getSkus(option))
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
        if (option.hasAttribute("disabled")) {
          return
        }
        const skuIds = getSkus(option)
        option.toggleAttribute("selected", true)
        optionElements.filter(o => o !== option).forEach(o => o.removeAttribute("selected"))
        selectSkuOption(optionId, skuIds)
      })
    })
  }
}
