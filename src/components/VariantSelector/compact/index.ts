import { fetchProduct } from "@/shopify/graphql/fetchProduct"
import { VariantSelector } from "../VariantSelector"
import { shadowContentFactory } from "@/utils/shadowContentFactory"
import { html } from "@/templating/html"
import styles from "./styles.css?raw"
import { ShopifyProduct, ShopifyVariant, ShopifySelectedOption } from "@/shopify/graphql/types"
import { toVariantGid } from "@/shopify/graphql/utils"
import { emitVariantChange } from "../emitVariantChange"

const VARIANT_SELECTOR_RENDERED_EVENT = "@nosto/VariantSelector/rendered"

const setShadowContent = shadowContentFactory(styles)

export async function loadAndRenderCompact(element: VariantSelector) {
  element.toggleAttribute("loading", true)
  try {
    const productData = await fetchProduct(element.handle)

    // Determine which variant should be selected
    const selectedVariant = getSelectedVariant(element, productData)

    const template = getCompactSelectorHTML(productData, selectedVariant.id)
    setShadowContent(element, template.html)

    if (selectedVariant) {
      emitVariantChange(element, { productId: productData.id, handle: productData.handle }, selectedVariant)
    }

    setupDropdownListener(element)

    element.dispatchEvent(new CustomEvent(VARIANT_SELECTOR_RENDERED_EVENT, { bubbles: true, cancelable: true }))
  } finally {
    element.toggleAttribute("loading", false)
  }
}

function getCompactSelectorHTML(product: ShopifyProduct, selectedVariantGid: string) {
  // Don't render if there are no variants
  if (!product.combinedVariants || product.combinedVariants.length <= 1) {
    return html`<slot></slot>`
  }

  // Find option names that have only one value across all variants
  const fixedOptions = product.options.filter(option => option.optionValues.length === 1).map(option => option.name)

  function getOptionIndex({ name, value }: ShopifySelectedOption) {
    const option = product.options.find(o => o.name === name)
    return option?.optionValues.findIndex(ov => ov.name === value) ?? -1
  }

  const sortedVariants = [...product.combinedVariants].sort((a, b) => {
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
  const allVariantsUnavailable = product.combinedVariants.every(variant => !variant.availableForSale)
  const disabledAttr = allVariantsUnavailable ? "disabled" : ""

  return html`
    <div class="compact-selector" part="compact-selector">
      <select name="variant" part="variant-dropdown" aria-label="Select variant" ${disabledAttr}>
        ${sortedVariants.map(variant => generateVariantOption(variant, selectedVariantGid, fixedOptions))}
      </select>
      <slot></slot>
    </div>
  `
}

function getSelectedVariant(element: VariantSelector, product: ShopifyProduct) {
  if (element.variantId) {
    const variantIdStr = toVariantGid(element.variantId)
    const variant = product.combinedVariants.find(v => v.id === variantIdStr)
    if (variant) {
      return variant
    }
  }
  const variant = product.combinedVariants.find(
    v => v.availableForSale && v.product.onlineStoreUrl === product.onlineStoreUrl
  )
  return variant ? variant : product.combinedVariants[0]
}

function generateVariantOption(variant: ShopifyVariant, selectedVariantGid: string, fixedOptions: string[]) {
  const parts: string[] = []

  if (selectedVariantGid === variant.id) {
    parts.push("selected")
  }

  if (!variant.availableForSale) {
    parts.push("disabled")
  }

  // Skip options that have only one fixed value across all variants
  const variableOptions = variant.selectedOptions?.filter(o => !fixedOptions.includes(o.name)) || []
  let title = variant.title
  if (variableOptions.length === 1) {
    title = variableOptions[0].value
  } else if (variableOptions.length > 1) {
    title = variableOptions.map(o => o.value).join(" / ")
  }
  const additionalAttrs = parts.join(" ").trim()

  return html`<option value="${variant.id}" ${additionalAttrs}>${title}</option>`
}

function setupDropdownListener(element: VariantSelector) {
  element.shadowRoot!.addEventListener("change", async e => {
    const target = e.target as HTMLSelectElement
    if (target.matches("select") && !target.disabled) {
      const productData = await fetchProduct(element.handle)
      const variant = productData.combinedVariants.find(v => v.id === target.value)
      if (variant) {
        emitVariantChange(element, { productId: productData.id, handle: productData.handle }, variant)
      }
    }
  })
}
