/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from "@/templating/jsx"
import type { TemplateExpression } from "@/templating/jsx"
import type { VariantSelector } from "../VariantSelector"
import { ShopifyOption, ShopifyOptionValue, ShopifyProduct } from "@/shopify/graphql/types"

export function generateVariantSelectorHTML(element: VariantSelector, product: ShopifyProduct): TemplateExpression {
  // Don't render if there are no options
  if (!product.options || product.options.length === 0) {
    return (<slot></slot>) as unknown as TemplateExpression
  }

  // Check if there are any multi-value options (options with more than one value)
  const hasMultiValueOptions = product.options.some(option => option.optionValues.length > 1)

  // If all options are single-value, don't render the selector
  if (!hasMultiValueOptions) {
    return (<slot></slot>) as unknown as TemplateExpression
  }

  return (
    <div class="selector" part="selector">
      {product.options.map(option => generateOptionRowHTML(option, element.maxValues))}
      <slot></slot>
    </div>
  ) as unknown as TemplateExpression
}

function generateOptionRowHTML(option: ShopifyOption, maxValues?: number): TemplateExpression | string {
  if (option.optionValues.length <= 1) {
    return ""
  }

  const valuesToRender = maxValues ? option.optionValues.slice(0, maxValues) : option.optionValues
  const hasMore = maxValues && option.optionValues.length > maxValues

  return (
    <div class="row" part="row">
      <div class="label" part="label">
        {option.name}:
      </div>
      <div class="values" part="values">
        {valuesToRender.map(value => generateOptionValueHTML(option.name, value))}
        {hasMore && generateEllipsis(option.optionValues.length - maxValues!)}
      </div>
    </div>
  ) as unknown as TemplateExpression
}

function generateEllipsis(moreCount: number): TemplateExpression {
  return (
    <span class="ellipsis" part="ellipsis" role="img" aria-label={`${moreCount} more options`}>
      …
    </span>
  ) as unknown as TemplateExpression
}

function generateOptionValueHTML(name: string, value: ShopifyOptionValue): TemplateExpression {
  // TODO expand to actual swatch rendering
  return (
    <button type="button" class="value" part="value" data-option-name={name} data-option-value={value.name}>
      {value.name}
    </button>
  ) as unknown as TemplateExpression
}
