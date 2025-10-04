import { html } from "@/templating/html"
import type { ShopifyProduct } from "../SimpleCard/types"
import type { VariantSelector } from "./VariantSelector"

export function generateVariantSelectorHTML(_element: VariantSelector, product: ShopifyProduct) {
  // Don't render if there are no options or only one variant
  if (!product.options || product.options.length === 0 || product.variants.length <= 1) {
    return html``
  }

  return html`
    <div class="variant-selector">${product.options.map(option => generateOptionRowHTML(option))}</div>
  `
}

function generateOptionRowHTML(option: { name: string; values: string[] }) {
  return html`
    <div class="variant-option-row">
      <div class="variant-option-label">${option.name}:</div>
      <div class="variant-option-values">
        ${option.values.map(value => generateOptionValueHTML(option.name, value))}
      </div>
    </div>
  `
}

function generateOptionValueHTML(optionName: string, value: string) {
  return html`
    <button type="button" class="variant-option-value" data-option-name="${optionName}" data-option-value="${value}">
      ${value}
    </button>
  `
}
