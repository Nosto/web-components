import { fetchProduct } from "@/shopify/graphql/fetchProduct"
import { VariantSelector } from "../VariantSelector"
import { shadowContentFactory } from "@/utils/shadowContentFactory"
import { html } from "@/templating/html"
import styles from "./styles.css?raw"
import { ShopifyProduct, ShopifyVariant, VariantChangeDetail } from "@/shopify/graphql/types"
import { parseId, toVariantGid } from "@/shopify/graphql/utils"

const setShadowContent = shadowContentFactory(styles)

let placeholder = ""

/** Event name for the VariantSelector rendered event */
const VARIANT_SELECTOR_RENDERED_EVENT = "@nosto/VariantSelector/rendered"

export async function loadAndRenderCompact(element: VariantSelector, initial = false) {
  if (initial && element.placeholder && placeholder) {
    element.toggleAttribute("loading", true)
    setShadowContent(element, placeholder)
  }
  element.toggleAttribute("loading", true)
  try {
    const productData = await fetchProduct(element.handle)

    // Initialize selections with first available variant or specified variant
    initializeDefaultSelections(element, productData)

    const selectorHTML = generateCompactSelectorHTML(element, productData)
    setShadowContent(element, selectorHTML.html)

    // Cache the rendered HTML for placeholder use
    placeholder = selectorHTML.html

    // Setup event listeners for dropdown
    setupDropdownListener(element)

    if (Object.keys(element.selectedOptions).length > 0) {
      emitVariantChange(element, productData)
    }

    element.dispatchEvent(new CustomEvent(VARIANT_SELECTOR_RENDERED_EVENT, { bubbles: true, cancelable: true }))
  } finally {
    element.toggleAttribute("loading", false)
  }
}

function initializeDefaultSelections(element: VariantSelector, product: ShopifyProduct) {
  let variant: ShopifyVariant | undefined
  if (element.variantId) {
    const variantIdStr = toVariantGid(element.variantId)
    variant = product.variants.find(v => v.id === variantIdStr)
  } else if (element.preselect) {
    variant = product.variants.find(v => v.availableForSale)
  }
  if (variant && variant.selectedOptions) {
    variant.selectedOptions.forEach(selectedOption => {
      element.selectedOptions[selectedOption.name] = selectedOption.value
    })
  } else {
    product.options.forEach(option => {
      if (option.optionValues.length === 1) {
        element.selectedOptions[option.name] = option.optionValues[0].name
      }
    })
  }
}

function generateCompactSelectorHTML(element: VariantSelector, product: ShopifyProduct) {
  // Don't render if there are no variants
  if (!product.variants || product.variants.length === 0) {
    return html`<slot></slot>`
  }

  // If all variants have only one option combination, don't render the selector
  if (product.variants.length === 1) {
    return html`<slot></slot>`
  }

  const selectedVariant = getSelectedVariant(element, product)
  const selectedVariantId = selectedVariant ? selectedVariant.id : ""

  return html`
    <div class="compact-selector" part="compact-selector">
      <select class="variant-dropdown" part="variant-dropdown" aria-label="Select variant">
        ${product.variants.map(variant => generateVariantOption(variant, selectedVariantId))}
      </select>
      <slot></slot>
    </div>
  `
}

function generateVariantOption(variant: ShopifyVariant, selectedVariantId: string) {
  const attrs = [`value="${variant.id}"`]

  if (selectedVariantId === variant.id) {
    attrs.push("selected")
  }

  if (!variant.availableForSale) {
    attrs.push("disabled")
  }

  const title = variant.title + (!variant.availableForSale ? " (Unavailable)" : "")

  return html`<option ${{ html: attrs.join(" ") }}>${title}</option>`
}

function setupDropdownListener(element: VariantSelector) {
  element.shadowRoot!.addEventListener("change", async e => {
    const target = e.target as HTMLSelectElement
    if (target.classList.contains("variant-dropdown")) {
      const variantId = target.value
      await selectVariant(element, variantId)
    }
  })
}

async function selectVariant(element: VariantSelector, variantId: string) {
  const productData = await fetchProduct(element.handle)
  const variant = productData.variants.find(v => v.id === variantId)

  if (variant && variant.selectedOptions) {
    // Update selected options based on the chosen variant
    variant.selectedOptions.forEach(selectedOption => {
      element.selectedOptions[selectedOption.name] = selectedOption.value
    })

    emitVariantChange(element, productData)
  }
}

function emitVariantChange(element: VariantSelector, product: ShopifyProduct) {
  const variant = getSelectedVariant(element, product)
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

export function getSelectedVariant(element: VariantSelector, product: ShopifyProduct): ShopifyVariant | null {
  return (
    product.variants?.find(variant => {
      if (!variant.selectedOptions) return false
      return product.options.every(option => {
        const selectedValue = element.selectedOptions[option.name]
        const variantOption = variant.selectedOptions!.find(so => so.name === option.name)
        return variantOption && selectedValue === variantOption.value
      })
    }) || null
  )
}
