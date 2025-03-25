import { intersectionOf } from "@/utils"
import { injectStore, Store } from "../store"
import { customElement } from "./decorators"

function getSkus(element: Element, available = true) {
  const attributeName = available ? "n-skus" : "n-skus-oos"
  return (element.getAttribute(attributeName) || "").split(",").filter(Boolean)
}

function getAllSkus(element: Element) {
  return [...getSkus(element), ...getSkus(element, false)]
}

function setAvailability(elements: Element[]) {
  elements
    .filter(o => !o.getAttribute("n-skus"))
    .forEach(o => {
      o.toggleAttribute("unavailable", true)
    })
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
    injectStore(this, this.init.bind(this))
  }

  private validate() {
    if (!this.name) {
      throw new Error("Name is required.")
    }
  }

  private init(store: Store) {
    store.registerOptionGroup()
    // implementation via [n-option] elements
    const optionElements = Array.from(this.querySelectorAll<HTMLElement>("[n-option]"))
    if (optionElements.length) {
      this.registerClickEvents(store, optionElements)
      this.registerStateChange(store, optionElements)
      this.handlePreselection(store, optionElements)
      return
    }
    // implementation via <select> element
    const select = this.querySelector<HTMLSelectElement>("select[n-target]")
    if (select) {
      this.registerSelectChange(store, select)
      this.registerStateChange(store, Array.from(select.querySelectorAll("option")))
      this.handleSelectPreselection(store, select)
    }
  }

  private handleSelectPreselection({ selectSkuOption }: Store, select: HTMLSelectElement) {
    const optionId = this.name
    const selected = select.querySelector<HTMLElement>("option[n-skus]:checked")
    if (selected) {
      const skuIds = getAllSkus(selected)
      selectSkuOption(optionId, skuIds)
    }
  }

  private registerSelectChange({ selectSkuOption }: Store, select: HTMLSelectElement) {
    const optionId = this.name
    select.addEventListener("change", () => {
      const selected = select.querySelector<HTMLElement>("option[n-skus]:checked")
      if (!selected) {
        return
      }
      const skuIds = getAllSkus(selected)
      selectSkuOption(optionId, skuIds)
    })
  }

  private registerStateChange({ listen }: Store, optionElements: HTMLElement[]) {
    const optionId = this.name
    listen("skuOptions", skuOptions => {
      const otherGroups = Object.keys(skuOptions)
        .filter(key => key !== optionId)
        .map(key => skuOptions[key])
      if (otherGroups.length === 0) {
        optionElements.forEach(option => option.removeAttribute("disabled"))
        setAvailability(optionElements)
        return
      }
      function hasIntersection(skuIds: string[]) {
        // an option is available if it intersects with all other groups
        return otherGroups.every(group => intersectionOf(group, skuIds).length > 0)
      }
      optionElements.forEach(option => {
        const availableMatches = hasIntersection(getSkus(option, true))
        const unavailableMatches = hasIntersection(getSkus(option, false))
        option.toggleAttribute("disabled", !availableMatches && !unavailableMatches)
        option.toggleAttribute("unavailable", !availableMatches && unavailableMatches)
      })
    })
  }

  private handlePreselection({ selectSkuOption }: Store, optionElements: HTMLElement[]) {
    const optionId = this.name
    const selected = optionElements.find(o => o.hasAttribute("selected"))
    if (selected) {
      const skuIds = getAllSkus(selected)
      selectSkuOption(optionId, skuIds)
    }
    setAvailability(optionElements)
  }

  private registerClickEvents({ selectSkuOption }: Store, optionElements: HTMLElement[]) {
    const optionId = this.name
    optionElements.forEach(option => {
      option.addEventListener("click", () => {
        if (option.hasAttribute("disabled") || option.hasAttribute("unavailable")) {
          return
        }
        const skuIds = getAllSkus(option)
        option.toggleAttribute("selected", true)
        optionElements.filter(o => o !== option).forEach(o => o.removeAttribute("selected"))
        selectSkuOption(optionId, skuIds)
      })
    })
  }
}
