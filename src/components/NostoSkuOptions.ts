export class NostoSkuOptions extends HTMLElement {
  private _selectedSkuIds: string[]

  constructor() {
    super()
    this._selectedSkuIds = []
  }

  connectedCallback() {
    this.parseSkuMapping()
    this.registerOptionsClickEvent()
    this.registerSkuSelectionEvent()
  }

  get selectedSkuIds() {
    return this._selectedSkuIds
  }

  parseSkuMapping() {
    return Array.from(this.querySelectorAll("[n-option]"))
      .map(option => {
        const skusValue = option.getAttribute("n-skus")
        const optionValue = option.textContent?.trim()

        if (optionValue && skusValue) {
          return { [optionValue]: skusValue.split(",") }
        }
      })
      .filter(it => it !== undefined)
  }

  /**
   * registers a click event on all SKU options under this SKU wrapper
   * triggers a n-sku-selection event with the details of SKU selected to be handled by other NostoSku sibling elements
   */
  registerOptionsClickEvent() {
    this.querySelectorAll("[n-option]").forEach(option => {
      option.addEventListener("click", () => {
        const optionValue = option.textContent
        if (!optionValue) {
          return
        }

        this.syncSelectedAttribute(option)

        const siblings = this.getAllSiblings(option)

        const detail = {
          selectedSourceIds: this._selectedSkuIds
        }

        siblings.forEach(sibling =>
          sibling.dispatchEvent(
            new CustomEvent("n-sku-selection", {
              bubbles: true,
              detail
            })
          )
        )
      })
    })
  }

  getSkus(element: Element) {
    return (element.getAttribute("n-skus") || "").split(",")
  }

  syncSelectedAttribute(clickedOption: Element) {
    clickedOption.toggleAttribute("selected")

    this._selectedSkuIds = this.getSkus(clickedOption)

    // remove selected attribute from other other options
    Array.from(this.querySelectorAll("[n-option]"))
      .filter(element => element !== clickedOption)
      .forEach(otherOption => otherOption.removeAttribute("selected"))
  }

  /**
   * register SKU selection event from subtree.
   * The components triggers the event and also registers a listener.
   * This is because the component is repeated for every SKUs rendered
   * Every handled event adds the context information on every level to determine the selected SKU
   * TODO: Hide the wrapper NostoSku element when none of the options matched the selected SKU from sibling
   */
  registerSkuSelectionEvent() {
    this.addEventListener("n-sku-selection", (event: Event) => {
      const selectionDetails = (event as CustomEvent).detail
      if (!selectionDetails || !selectionDetails.selectedSourceIds) {
        return
      }

      const { selectedSourceIds } = selectionDetails

      this.querySelectorAll<HTMLElement>("[n-options]").forEach(option => {
        const skus = this.getSkus(option)

        if (!skus.length) {
          return
        }

        const matched = skus.find(it => selectedSourceIds.includes(it))
        if (!matched) {
          option.style.display = "none"
        }
      })
    })
  }

  /**
   * gets all sibling elements for the NostoSku element that triggered the click
   */
  getAllSiblings(element: Element) {
    const wrapperElement = element.parentElement?.parentElement
    if (!wrapperElement) {
      return []
    }
    const children = [...wrapperElement.children]
    return children.filter(child => child !== element.parentElement!)
  }
}

try {
  customElements.define("nosto-sku-options", NostoSkuOptions)
} catch (e) {
  console.error(e)
}
