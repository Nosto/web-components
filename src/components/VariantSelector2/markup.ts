import { html } from "@/templating/html"
import type { ShopifyProduct } from "../../shopify/types"
import type { VariantSelector2 } from "./VariantSelector2"

export function generateVariantSelectorHTML(_element: VariantSelector2, product: ShopifyProduct) {
  // Don't render if there are no options or only one variant
  if (!product.options || product.options.length === 0 || product.variants.length <= 1) {
    return html`<slot></slot>`
  }

  return html`
    <div class="selector" part="selector">
      ${product.options.map(option => generateOptionRowHTML(option))}<slot></slot>
    </div>
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

function generateOptionValueHTML(name: string, value: string) {
  return html`
    <button type="button" class="value" part="value" data-option-name="${name}" data-option-value="${value}">
      ${value}
    </button>
  `
}
