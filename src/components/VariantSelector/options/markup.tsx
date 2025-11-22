import { createElement } from "@/templating/jsx"
import type { VariantSelector } from "../VariantSelector"
import { ShopifyOption, ShopifyOptionValue, ShopifyProduct } from "@/shopify/graphql/types"

export function generateVariantSelectorHTML(element: VariantSelector, product: ShopifyProduct) {
  // Don't render if there are no options
  if (!product.options || product.options.length === 0) {
    return <slot></slot>
  }

  // Check if there are any multi-value options (options with more than one value)
  const hasMultiValueOptions = product.options.some(option => option.optionValues.length > 1)

  // If all options are single-value, don't render the selector
  if (!hasMultiValueOptions) {
    return <slot></slot>
  }

  return (
    <div class="selector" part="selector">
      {product.options.map(option => (
        <OptionRowHTML option={option} maxValues={element.maxValues} />
      ))}
      <slot></slot>
    </div>
  )
}

function OptionRowHTML({ option, maxValues }: { option: ShopifyOption; maxValues?: number }) {
  if (option.optionValues.length <= 1) {
    return null
  }

  const valuesToRender = maxValues ? option.optionValues.slice(0, maxValues) : option.optionValues
  const hasMore = maxValues && option.optionValues.length > maxValues

  return (
    <div class="row" part="row">
      <div class="label" part="label">
        {option.name}:
      </div>
      <div class="values" part="values">
        {valuesToRender.map(value => (
          <OptionValueHTML name={option.name} value={value} />
        ))}
        {hasMore && <Ellipsis moreCount={option.optionValues.length - maxValues!} />}
      </div>
    </div>
  )
}

function Ellipsis({ moreCount }: { moreCount: number }) {
  return (
    <span class="ellipsis" part="ellipsis" role="img" aria-label={`${moreCount} more options`}>
      …
    </span>
  )
}

function OptionValueHTML({ name, value }: { name: string; value: ShopifyOptionValue }) {
  // TODO expand to actual swatch rendering
  return (
    <button type="button" class="value" part="value" data-option-name={name} data-option-value={value.name}>
      {value.name}
    </button>
  )
}
