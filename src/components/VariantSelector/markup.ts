import { html } from "@/templating/html"
import { escapeHtml } from "@/utils/escapeHtml"
import type { ShopifyProduct } from "../SimpleCard/types"
import type { VariantSelector } from "./VariantSelector"

export function generateVariantSelectorHTML(_element: VariantSelector, product: ShopifyProduct) {
  // Don't render if there are no options or only one variant
  if (!product.options || product.options.length === 0 || product.variants.length <= 1) {
    return { html: "" }
  }

  return html`
    <div class="selector" part="selector">${product.options.map(option => generateOptionRowHTML(option))}</div>
  `
}

function generateOptionRowHTML(option: { name: string; values: string[] }) {
  if (option.values.length <= 1) {
    return ""
  }

  return html`
    <div class="row" part="row">
      <div class="label" part="label">${option.name}:</div>
      <div class="values" part="values">${option.values.map(value => generateOptionValueHTML(option.name, value))}</div>
    </div>
  `
}

function generateOptionValueHTML(optionName: string, value: string) {
  return html`
    <button
      type="button"
      class="value"
      part="value"
      data-option-name="${escapeHtml(optionName)}"
      data-option-value="${escapeHtml(value)}"
    >
      ${value}
    </button>
  `
}
