import { intersectionOf } from "@/utils"
import { injectStore, Store } from "../store"
import { customElement } from "./decorators"

function getSkus(element: Element) {
  return (element.getAttribute("n-skus") || "").split(",")
}

@customElement("nosto-sku-options")
export class NostoSkuOptions extends HTMLElement {
  static attributes = {
    name: String
  }

  name!: string

  constructor() {
    super()
  }

  connectedCallback() {
    this.validate()
    injectStore(this, store => init(this, store))
  }

  private validate() {
    if (!this.name) {
      throw new Error("Name is required.")
    }
  }
}

function init(el: NostoSkuOptions, store: Store) {
  const optionId = el.name
  const { listen, selectSkuOption } = store
  const optionElements = Array.from(el.querySelectorAll<HTMLElement>("[n-option]"))

  function registerStateChange() {
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

  function handlePreselection() {
    const selected = optionElements.find(o => o.hasAttribute("selected"))
    if (selected) {
      const skuIds = getSkus(selected)
      selectSkuOption(optionId, skuIds)
    }
  }

  function registerClickEvents() {
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

  store.registerOptionGroup()
  registerClickEvents()
  registerStateChange()
  handlePreselection()
}
