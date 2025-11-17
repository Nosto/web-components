import { html } from "@/templating/html"
import type { VariantSelector } from "./VariantSelector"
import { ShopifyOption, ShopifyOptionValue, ShopifyProduct } from "@/shopify/generated"

export function generateVariantSelectorHTML(_element: VariantSelector, product: ShopifyProduct) {
  // Don't render if there are no options
  if (!product.options || product.options.length === 0) {
    return html`<slot></slot>`
  }

  // Check if there are any multi-value options (options with more than one value)
  const hasMultiValueOptions = product.options.some(option => option.optionValues.length > 1)

  // If all options are single-value, don't render the selector
  if (!hasMultiValueOptions) {
    return html`<slot></slot>`
  }

  return html`
    <div class="selector" part="selector">
      ${product.options.map(option => generateOptionRowHTML(option))}<slot></slot>
    </div>
  `
}

function generateOptionRowHTML(option: ShopifyOption) {
  if (option.optionValues.length <= 1) {
    return ""
  }

  return html`
    <div class="row" part="row">
      <div class="label" part="label">${option.name}:</div>
      <div class="values" part="values">
        ${option.optionValues.map(value => generateOptionValueHTML(option.name, value))}
      </div>
    </div>
  `
}

function generateOptionValueHTML(name: string, value: ShopifyOptionValue) {
  // TODO expand to actual swatch rendering
  return html`
    <button type="button" class="value" part="value" data-option-name="${name}" data-option-value="${value.name}">
      ${value.name}
    </button>
  `
}
