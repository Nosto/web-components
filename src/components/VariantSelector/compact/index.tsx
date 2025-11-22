import { createElement } from "@/templating/jsx"
import { fetchProduct } from "@/shopify/graphql/fetchProduct"
import { VariantSelector } from "../VariantSelector"
import { shadowContentFactory } from "@/utils/shadowContentFactory"
import styles from "./styles.css?raw"
import { ShopifyProduct, ShopifyVariant, VariantChangeDetail, ShopifySelectedOption } from "@/shopify/graphql/types"
import { parseId, toVariantGid } from "@/shopify/graphql/utils"

const setShadowContent = shadowContentFactory(styles)

/** Event name for the VariantSelector rendered event */
const VARIANT_SELECTOR_RENDERED_EVENT = "@nosto/VariantSelector/rendered"

export async function loadAndRenderCompact(element: VariantSelector) {
  element.toggleAttribute("loading", true)
  try {
    const productData = await fetchProduct(element.handle)

    const selectorElement = generateCompactSelectorHTML(element, productData)
    setShadowContent(element, selectorElement)

    setupDropdownListener(element)

    element.dispatchEvent(new CustomEvent(VARIANT_SELECTOR_RENDERED_EVENT, { bubbles: true, cancelable: true }))
  } finally {
    element.toggleAttribute("loading", false)
  }
}

function generateCompactSelectorHTML(element: VariantSelector, product: ShopifyProduct) {
  // Don't render if there are no variants
  if (!product.variants || product.variants.length === 0) {
    return <slot></slot>
  }

  // If all variants have only one option combination, don't render the selector
  if (product.variants.length === 1) {
    return <slot></slot>
  }

  // Determine which variant should be selected
  const selectedVariantGid = getSelectedVariantId(element, product)

  // Find option names that have only one value across all variants
  const fixedOptions = product.options.filter(option => option.optionValues.length === 1).map(option => option.name)

  function getOptionIndex({ name, value }: ShopifySelectedOption) {
    const option = product.options.find(o => o.name === name)
    return option?.optionValues.findIndex(ov => ov.name === value) ?? -1
  }

  const sortedVariants = [...product.variants].sort((a, b) => {
    const optsA = a.selectedOptions ?? []
    const optsB = b.selectedOptions ?? []
    const len = Math.min(optsA.length, optsB.length)
    for (let i = 0; i < len; i++) {
      const optionA = optsA[i]
      const optionB = optsB[i]

      if (optionA.value !== optionB.value) {
        return getOptionIndex(optionA) - getOptionIndex(optionB)
      }
    }
    return 0
  })

  // Check if all variants are unavailable
  const allVariantsUnavailable = product.variants.every(variant => !variant.availableForSale)

  return (
    <div class="compact-selector" part="compact-selector">
      <select
        name="variant"
        part="variant-dropdown"
        aria-label="Select variant"
        disabled={allVariantsUnavailable ? true : undefined}
      >
        {sortedVariants.map(variant => generateVariantOption(variant, selectedVariantGid, fixedOptions))}
      </select>
      <slot></slot>
    </div>
  )
}

function getSelectedVariantId(element: VariantSelector, product: ShopifyProduct) {
  if (element.variantId) {
    const variantIdStr = toVariantGid(element.variantId)
    const variant = product.variants.find(v => v.id === variantIdStr)
    if (variant) {
      return variant.id
    }
  }
  const variant = product.variants.find(v => v.availableForSale && v.product.onlineStoreUrl === product.onlineStoreUrl)
  return variant ? variant.id : product.variants[0].id
}

function generateVariantOption(variant: ShopifyVariant, selectedVariantGid: string, fixedOptions: string[]) {
  const isSelected = selectedVariantGid === variant.id
  const isDisabled = !variant.availableForSale

  // Skip options that have only one fixed value across all variants
  const variableOptions = variant.selectedOptions?.filter(o => !fixedOptions.includes(o.name)) || []
  let title = variant.title
  if (variableOptions.length === 1) {
    title = variableOptions[0].value
  } else if (variableOptions.length > 1) {
    title = variableOptions.map(o => o.value).join(" / ")
  }

  return (
    <option value={variant.id} selected={isSelected ? true : undefined} disabled={isDisabled ? true : undefined}>
      {title}
    </option>
  )
}

function setupDropdownListener(element: VariantSelector) {
  element.shadowRoot!.addEventListener("change", async e => {
    const target = e.target as HTMLSelectElement
    if (target.matches("select") && !target.disabled) {
      const variantId = target.value
      await emitVariantChange(element, variantId)
    }
  })
}

async function emitVariantChange(element: VariantSelector, variantId: string) {
  const productData = await fetchProduct(element.handle)
  const variant = productData.variants.find(v => v.id === variantId)

  if (variant) {
    element.variantId = parseId(variant.id)
    const detail: VariantChangeDetail = { variant }
    element.dispatchEvent(
      new CustomEvent("variantchange", {
        detail,
        bubbles: true
      })
    )
  }
}
