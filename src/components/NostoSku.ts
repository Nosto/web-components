import { SkuEventDetailProps, SkuEventProps } from "@/components/types"

export class NostoSku extends HTMLElement {
  private _optionTypeBySkuId: Record<string, string[]>

  constructor() {
    super()
    this._optionTypeBySkuId = {}
  }

  connectedCallback() {
    this.parseSkuMapping()
    this.registerOptionsClickEvent()
    this.registerSkuSelectionEvent()
  }

  get optionTypeBySkuId() {
    return this._optionTypeBySkuId
  }

  parseSkuMapping() {
    this.querySelectorAll("[n-option]").forEach(option => {
      const skusValue = option.getAttribute("n-skus")
      const optionValue = option.textContent?.trim()

      if (optionValue && skusValue) {
        this._optionTypeBySkuId[optionValue] = skusValue.split(",")
      }
    })
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

        // provides easy access to the selection context from sibling SKU
        // the indexed value will also come in handy when dealing with more than two SKU selections
        const skuProps: Record<number, SkuEventProps[]> = {
          1: this.optionTypeBySkuId[optionValue].map(it => ({
            optionValue,
            skuId: it
          }))
        }

        const detail: SkuEventDetailProps = {
          skuProps,
          skuCount: siblings.length + 1,
          selectionIndex: 1
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

  syncSelectedAttribute(clickedOption: Element) {
    clickedOption.toggleAttribute("selected")

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
      const selectionDetails = (event as CustomEvent).detail as SkuEventDetailProps
      if (!selectionDetails || !selectionDetails.skuProps) {
        return
      }

      const { skuProps, selectionIndex, skuCount: depth } = selectionDetails
      const selectedSkuIds = skuProps[selectionIndex].map(it => it.skuId)
      selectionDetails.selectionIndex += 1
      skuProps[selectionDetails.selectionIndex] = []

      Object.entries(this.optionTypeBySkuId).forEach(([k, v]) => {
        const matched = v.find(it => selectedSkuIds.includes(it))
        if (matched) {
          skuProps[selectionDetails.selectionIndex].push({ skuId: matched, optionValue: k })
        } else {
          const skuOption = this.querySelector<HTMLElement>(`[n-option][n-skus="${v}"]`)
          if (skuOption) {
            skuOption.style.display = "none"
          }
        }
      })

      // when this is the last NostoSku sibling, record the selected SkuId combining all selections
      // TODO: make it compatible with more than 2 levels of SKU selections in upcoming PRs
      if (depth === selectionDetails.selectionIndex) {
        const { skuId } = skuProps[selectionDetails.selectionIndex][0]
        selectionDetails.skuId = skuId
      }
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
  customElements.define("nosto-sku", NostoSku)
} catch (e) {
  console.error(e)
}
