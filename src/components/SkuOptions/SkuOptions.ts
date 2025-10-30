import { assertRequired } from "@/utils/assertRequired"
import { intersectionOf } from "@/utils/intersectionOf"
import { injectKey, Store } from "../Product/store"
import { customElement, property } from "../decorators"
import { syncSkuData } from "../common"
import { NostoElement } from "../Element"
import { inject } from "../inject"
import { Props } from "@/types"

/**
 * A custom element that manages SKU (Stock Keeping Unit) options in a product selection interface.
 *
 * This component handles two different implementation styles:
 * 1. Elements with the `n-option` attribute for direct option selection
 * 2. A `<select>` element with options having `n-skus` attributes
 *
 * The component manages:
 * - Option selection state
 * - Disabling unavailable options based on other selections
 * - Handling preselected options
 * - Registering click events for options
 * - Listening for state changes to update UI
 *
 * {@include ./examples.md}
 *
 * @category Campaign level templating
 *
 * @property {string} name - Required. The identifier for this option group
 */
@customElement("nosto-sku-options")
export class SkuOptions extends NostoElement {
  @property(String) name!: string

  connectedCallback() {
    assertRequired(this, "name")
    initSkuOptions(this, inject(this, injectKey)!)
  }
}

export type SkuOptionsProps = Props<SkuOptions>

function initSkuOptions(element: SkuOptions, store: Store) {
  store.registerOptionGroup()
  const optionId = element.name
  // implementation via [n-option] elements
  const optionElements = Array.from(element.querySelectorAll<HTMLElement>("[n-option]"))
  if (optionElements.length) {
    optionElements.forEach(element => (element.dataset.tracked = "true"))
    registerClickEvents(optionId, store, optionElements)
    registerStateChange(optionId, store, optionElements)
    handlePreselection(optionId, store, optionElements)
    return
  }
  // implementation via <select> element
  const select = element.querySelector<HTMLSelectElement>("select[n-target]")
  if (select) {
    select.dataset.tracked = "true"
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

function registerClickEvents(
  optionId: string,
  { addToCart, selectSkuOption, setSkuFields }: Store,
  optionElements: HTMLElement[]
) {
  optionElements.forEach(option => {
    option.addEventListener("click", () => {
      if (option.hasAttribute("disabled") || option.hasAttribute("unavailable")) {
        return
      }
      const skuIds = getAllSkus(option)
      option.toggleAttribute("selected", true)
      optionElements.filter(o => o !== option).forEach(o => o.removeAttribute("selected"))
      selectSkuOption(optionId, skuIds)
      syncSkuData(option, setSkuFields)
      if (option.matches("[n-atc]")) {
        addToCart()
      }
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

declare global {
  interface HTMLElementTagNameMap {
    "nosto-sku-options": SkuOptions
  }
}
