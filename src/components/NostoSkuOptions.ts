import { intersectionOf } from "@/utils"
import { injectStore, Store } from "../store"
import { customElement } from "./decorators"

@customElement("nosto-sku-options")
export class NostoSkuOptions extends HTMLElement {
  static attributes = {
    name: String
  }

  name!: string

  connectedCallback() {
    validate(this)
    injectStore(this, store => initSkuOptions(this, store))
  }
}

function validate(element: NostoSkuOptions) {
  if (!element.name) {
    throw new Error("Name is required.")
  }
}

function initSkuOptions(element: NostoSkuOptions, store: Store) {
  store.registerOptionGroup()
  const optionId = element.name
  // implementation via [n-option] elements
  const optionElements = Array.from(element.querySelectorAll<HTMLElement>("[n-option]"))
  if (optionElements.length) {
    registerClickEvents(optionId, store, optionElements)
    registerStateChange(optionId, store, optionElements)
    handlePreselection(optionId, store, optionElements)
    return
  }
  // implementation via <select> element
  const select = element.querySelector<HTMLSelectElement>("select[n-target]")
  if (select) {
    registerSelectChange(optionId, store, select)
    registerStateChange(optionId, store, Array.from(select.querySelectorAll("option")))
    handleSelectPreselection(optionId, store, select)
  }
}

function handleSelectPreselection(optionId: string, { selectSkuOption }: Store, select: HTMLSelectElement) {
  const selected = select.querySelector<HTMLElement>("option[n-skus]:checked")
  if (selected) {
    const skuIds = getAllSkus(selected)
    selectSkuOption(optionId, skuIds)
  }
}

function registerSelectChange(optionId: string, { selectSkuOption }: Store, select: HTMLSelectElement) {
  select.addEventListener("change", () => {
    const selected = select.querySelector<HTMLElement>("option[n-skus]:checked")
    if (!selected) {
      return
    }
    const skuIds = getAllSkus(selected)
    selectSkuOption(optionId, skuIds)
  })
}

function registerStateChange(optionId: string, { listen }: Store, optionElements: HTMLElement[]) {
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
      const availableMatches = hasIntersection(getSkus(option))
      const unavailableMatches = hasIntersection(getSkus(option, false))
      option.toggleAttribute("disabled", !availableMatches && !unavailableMatches)
      option.toggleAttribute("unavailable", !availableMatches && unavailableMatches)
    })
  })
}

function handlePreselection(optionId: string, { selectSkuOption }: Store, optionElements: HTMLElement[]) {
  const selected = optionElements.find(o => o.hasAttribute("selected"))
  if (selected) {
    const skuIds = getAllSkus(selected)
    selectSkuOption(optionId, skuIds)
  }
  setAvailability(optionElements)
}

function registerClickEvents(optionId: string, { selectSkuOption }: Store, optionElements: HTMLElement[]) {
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

function getSkus(element: Element, available = true) {
  const attributeName = available ? "n-skus" : "n-skus-oos"
  return (element.getAttribute(attributeName) || "").split(",").filter(Boolean)
}

function getAllSkus(element: Element) {
  return [...getSkus(element), ...getSkus(element, false)]
}

function setAvailability(elements: Element[]) {
  elements.forEach(o => {
    o.toggleAttribute("unavailable", !o.getAttribute("n-skus"))
  })
}
