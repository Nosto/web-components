import { assertRequired } from "@/utils/assertRequired"
import { intersectionOf } from "@/utils/intersectionOf"
import { injectKey, Store } from "../Product/store"
import { customElement, property } from "../decorators"
import { syncSkuData } from "../common"
import { NostoElement } from "../Element"
import { inject } from "../inject"

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
    this.#initSkuOptions(inject(this, injectKey)!)
  }

  #initSkuOptions(store: Store) {
    store.registerOptionGroup()
    const optionId = this.name
    // implementation via [n-option] elements
    const optionElements = Array.from(this.querySelectorAll<HTMLElement>("[n-option]"))
    if (optionElements.length) {
      optionElements.forEach(element => (element.dataset.tracked = "true"))
      this.#registerClickEvents(optionId, store, optionElements)
      this.#registerStateChange(optionId, store, optionElements)
      this.#handlePreselection(optionId, store, optionElements)
      return
    }
    // implementation via <select> element
    const select = this.querySelector<HTMLSelectElement>("select[n-target]")
    if (select) {
      select.dataset.tracked = "true"
      this.#registerSelectChange(optionId, store, select)
      this.#registerStateChange(optionId, store, Array.from(select.querySelectorAll("option")))
      this.#handleSelectPreselection(optionId, store, select)
    }
  }

  #handleSelectPreselection(optionId: string, { selectSkuOption }: Store, select: HTMLSelectElement) {
    const selected = select.querySelector<HTMLElement>("option[n-skus]:checked")
    if (selected) {
      const skuIds = getAllSkus(selected)
      selectSkuOption(optionId, skuIds)
    }
  }

  #registerSelectChange(optionId: string, { selectSkuOption }: Store, select: HTMLSelectElement) {
    select.addEventListener("change", () => {
      const selected = select.querySelector<HTMLElement>("option[n-skus]:checked")
      if (!selected) {
        return
      }
      const skuIds = getAllSkus(selected)
      selectSkuOption(optionId, skuIds)
    })
  }

  #registerStateChange(optionId: string, { listen }: Store, optionElements: HTMLElement[]) {
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

  #handlePreselection(optionId: string, { selectSkuOption }: Store, optionElements: HTMLElement[]) {
    const selected = optionElements.find(o => o.hasAttribute("selected"))
    if (selected) {
      const skuIds = getAllSkus(selected)
      selectSkuOption(optionId, skuIds)
    }
    setAvailability(optionElements)
  }

  #registerClickEvents(
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
