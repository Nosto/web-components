import { fetchProduct } from "@/shopify/graphql/fetchProduct"
import { VariantSelector } from "../VariantSelector"
import { shadowContentFactory } from "@/utils/shadowContentFactory"
import { html } from "@/templating/html"
import styles from "./styles.css?raw"
import { ShopifyProduct, ShopifyVariant, VariantChangeDetail } from "@/shopify/graphql/types"
import { parseId, toVariantGid } from "@/shopify/graphql/utils"

const setShadowContent = shadowContentFactory(styles)

/** Event name for the VariantSelector rendered event */
const VARIANT_SELECTOR_RENDERED_EVENT = "@nosto/VariantSelector/rendered"

export async function loadAndRenderCompact(element: VariantSelector) {
  element.toggleAttribute("loading", true)
  try {
    const productData = await fetchProduct(element.handle)

    const selectorHTML = generateCompactSelectorHTML(element, productData)
    setShadowContent(element, selectorHTML.html)

    // Setup event listeners for dropdown
    setupDropdownListener(element)

    // Emit initial variant change if there's a selection
    const dropdown = element.shadowRoot!.querySelector(".variant-dropdown") as HTMLSelectElement
    if (dropdown && dropdown.value) {
      await emitVariantChange(element, dropdown.value)
    }

    element.dispatchEvent(new CustomEvent(VARIANT_SELECTOR_RENDERED_EVENT, { bubbles: true, cancelable: true }))
  } finally {
    element.toggleAttribute("loading", false)
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

  // Determine which variant should be selected
  let selectedVariantId = ""
  if (element.variantId) {
    const variantIdStr = toVariantGid(element.variantId)
    const variant = product.variants.find(v => v.id === variantIdStr)
    if (variant) {
      selectedVariantId = variant.id
    }
  } else if (element.preselect) {
    const variant = product.variants.find(v => v.availableForSale)
    if (variant) {
      selectedVariantId = variant.id
    }
  }

  // Find option names that have only one value across all variants
  const fixedOptions = product.options.filter(option => option.optionValues.length === 1).map(option => option.name)

  return html`
    <div class="compact-selector" part="compact-selector">
      <select class="variant-dropdown" part="variant-dropdown" aria-label="Select variant">
        ${product.variants.map(variant => generateVariantOption(variant, selectedVariantId, fixedOptions))}
      </select>
      <slot></slot>
    </div>
  `
}

function generateVariantOption(variant: ShopifyVariant, selectedVariantId: string, fixedOptions: string[]) {
  const parts: string[] = []

  if (selectedVariantId === variant.id) {
    parts.push("selected")
  }

  if (!variant.availableForSale) {
    parts.push("disabled")
  }

  // Skip options that have only one fixed value across all variants
  const variableOptions = variant.selectedOptions?.filter(o => !fixedOptions.includes(o.name)) || []
  const title = variableOptions.map(o => o.value).join(" / ") || variant.title
  const additionalAttrs = parts.join(" ").trim()

  return html`<option value="${variant.id}" ${additionalAttrs}>${title}</option>`
}

function setupDropdownListener(element: VariantSelector) {
  element.shadowRoot!.addEventListener("change", async e => {
    const target = e.target as HTMLSelectElement
    if (target.classList.contains("variant-dropdown")) {
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
