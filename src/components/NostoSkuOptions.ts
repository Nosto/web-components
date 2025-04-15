import { assertRequired, intersectionOf } from "@/utils"
import { injectStore, Store } from "./NostoProduct/store"
import { customElement } from "./decorators"

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
 * @property {string} name - Required. The identifier for this option group
 *
 * @example
 * ```html
 * <nosto-sku-options name="color">
 *   <span n-option n-skus="123,145">Black</span>
 *   <span n-option n-skus="223,234,245">White</span>
 *   <span n-option n-skus="334,345">Blue</span>
 * </nosto-sku-options>
 * ```
 */
@customElement("nosto-sku-options")
export class NostoSkuOptions extends HTMLElement {
  static attributes = {
    name: String
  }

  name!: string

  connectedCallback() {
    assertRequired(this, "name")
    injectStore(this, store => initSkuOptions(this, store))
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

function registerClickEvents(
  optionId: string,
  { addToCart, selectSkuOption, setImages }: Store,
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

      const image = option.getAttribute("ns-img")
      if (image) {
        const altImage = option.getAttribute("ns-alt-img")
        setImages(image, altImage || undefined)
      }

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
