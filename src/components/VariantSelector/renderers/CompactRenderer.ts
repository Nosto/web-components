import { fetchProduct } from "@/shopify/graphql/fetchProduct"
import type { VariantSelector } from "../VariantSelector"
import { shadowContentFactory } from "@/utils/shadowContentFactory"
import { html } from "@/templating/html"
import styles from "../compact/styles.css?raw"
import { ShopifyProduct, ShopifyVariant, VariantChangeDetail } from "@/shopify/graphql/types"
import { parseId, toVariantGid } from "@/shopify/graphql/utils"
import type { VariantSelectorRenderer } from "./types"

const setShadowContent = shadowContentFactory(styles)

const VARIANT_SELECTOR_RENDERED_EVENT = "@nosto/VariantSelector/rendered"

export class CompactRenderer implements VariantSelectorRenderer {
  async render(element: VariantSelector) {
    element.toggleAttribute("loading", true)
    try {
      const productData = await fetchProduct(element.handle)

      const selectorHTML = generateCompactSelectorHTML(element, productData)
      setShadowContent(element, selectorHTML.html)

      this.setupEventListeners(element)

      element.dispatchEvent(new CustomEvent(VARIANT_SELECTOR_RENDERED_EVENT, { bubbles: true, cancelable: true }))
    } finally {
      element.toggleAttribute("loading", false)
    }
  }

  setupEventListeners(element: VariantSelector) {
    element.shadowRoot!.addEventListener("change", async e => {
      const target = e.target as HTMLSelectElement
      if (target.classList.contains("variant-dropdown")) {
        const variantId = target.value
        await emitVariantChange(element, variantId)
      }
    })
  }

  updateSelection() {
    // Compact mode doesn't need to update selection state since
    // the dropdown natively manages its own selection
  }
}

function generateCompactSelectorHTML(element: VariantSelector, product: ShopifyProduct) {
  if (!product.variants || product.variants.length === 0) {
    return html`<slot></slot>`
  }

  if (product.variants.length === 1) {
    return html`<slot></slot>`
  }

  const selectedVariantGid = getSelectedVariantId(element, product)

  const fixedOptions = product.options.filter(option => option.optionValues.length === 1).map(option => option.name)

  return html`
    <div class="compact-selector" part="compact-selector">
      <select class="variant-dropdown" part="variant-dropdown" aria-label="Select variant">
        ${product.variants.map(variant => generateVariantOption(variant, selectedVariantGid, fixedOptions))}
      </select>
      <slot></slot>
    </div>
  `
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
  const parts: string[] = []

  if (selectedVariantGid === variant.id) {
    parts.push("selected")
  }

  if (!variant.availableForSale) {
    parts.push("disabled")
  }

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
