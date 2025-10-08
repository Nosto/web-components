import { html } from "@/templating/html"
import { escapeHtml } from "@/utils/escapeHtml"
import type { ShopifyProduct } from "../SimpleCard/types"
import type { VariantSelector } from "./VariantSelector"
import { isOptionValueDisabled, isOptionValueUnavailable } from "./VariantSelector"

export function generateVariantSelectorHTML(element: VariantSelector, product: ShopifyProduct) {
  // Don't render if there are no options or only one variant
  if (!product.options || product.options.length === 0 || product.variants.length <= 1) {
    return { html: "" }
  }

  return html`
    <div class="selector" part="selector">
      ${product.options.map(option => generateOptionRowHTML(element, product, option))}
    </div>
  `
}

function generateOptionRowHTML(
  element: VariantSelector,
  product: ShopifyProduct,
  option: { name: string; values: string[] }
) {
  return html`
    <div class="row" part="row">
      <div class="label" part="label">${option.name}:</div>
      <div class="values" part="values">
        ${option.values.map(value => generateOptionValueHTML(element, product, option.name, value))}
      </div>
    </div>
  `
}

function generateOptionValueHTML(element: VariantSelector, product: ShopifyProduct, optionName: string, value: string) {
  const isDisabled = isOptionValueDisabled(product, optionName, value, element.selectedOptions)
  const isUnavailable = isOptionValueUnavailable(product, optionName, value, element.selectedOptions)

  return html`
    <button
      type="button"
      class="value"
      part="value"
      data-option-name="${escapeHtml(optionName)}"
      data-option-value="${escapeHtml(value)}"
      ${isDisabled ? "disabled" : ""}
      ${isUnavailable ? 'data-status="unavailable"' : ""}
    >
      ${value}
    </button>
  `
}
