import { html } from "@/templating/html"
import type { ShopifyProduct } from "../../shopify/types"
import type { VariantSelector } from "./VariantSelector"
import type { ShopifyOptionGraphQL } from "@/shopify/types"

export function generateVariantSelectorHTML(_element: VariantSelector, product: ShopifyProduct) {
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

export function generateVariantSelectorHTMLFromGraphQL(_element: VariantSelector, options: ShopifyOptionGraphQL[]) {
  if (!options || options.length === 0) {
    return html`<slot></slot>`
  }

  return html`
    <div class="selector" part="selector">
      ${options.map(option => generateOptionRowHTMLFromGraphQL(option))}<slot></slot>
    </div>
  `
}

function generateOptionRowHTMLFromGraphQL(option: ShopifyOptionGraphQL) {
  if (!option.optionValues || option.optionValues.length <= 1) {
    return ""
  }

  return html`
    <div class="row" part="row">
      <div class="label" part="label">${option.name}:</div>
      <div class="values" part="values">
        ${option.optionValues.map(value => generateOptionValueHTMLFromGraphQL(option.name, value))}
      </div>
    </div>
  `
}

function generateOptionValueHTMLFromGraphQL(name: string, value: ShopifyOptionGraphQL["optionValues"][number]) {
  const variant = value.firstSelectableVariant
  return html`
    <button
      type="button"
      class="value"
      part="value"
      data-option-name="${name}"
      data-option-value="${value.name}"
      data-variant-id="${variant.id}"
      data-variant-title="${variant.title}"
      data-variant-available="${variant.availableForSale}"
      data-variant-image="${variant.image?.url ?? ""}"
      data-variant-price="${variant.price.amount}"
      data-variant-currency="${variant.price.currencyCode}"
    >
      ${value.name}
    </button>
  `
}
