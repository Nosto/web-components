import { html } from "@/templating/html"
import type { VariantSelector } from "./VariantSelector"
import { ShopifyOption, ShopifyOptionValue, ShopifyProduct } from "@/shopify/graphql/types"

export function generateVariantSelectorHTML(element: VariantSelector, product: ShopifyProduct) {
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
      ${product.options.map(option => generateOptionRowHTML(option, element.maxValues))}<slot></slot>
    </div>
  `
}

function generateOptionRowHTML(option: ShopifyOption, maxValues?: number) {
  if (option.optionValues.length <= 1) {
    return ""
  }

  const valuesToRender = maxValues && maxValues > 0 ? option.optionValues.slice(0, maxValues) : option.optionValues
  const hasMore = maxValues && maxValues > 0 && option.optionValues.length > maxValues

  return html`
    <div class="row" part="row">
      <div class="label" part="label">${option.name}:</div>
      <div class="values" part="values">
        ${valuesToRender.map(value => generateOptionValueHTML(option.name, value))}${hasMore
          ? html`<span
              class="ellipsis"
              part="ellipsis"
              role="presentation"
              aria-label="${option.optionValues.length - maxValues} more options"
              >…</span
            >`
          : ""}
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
