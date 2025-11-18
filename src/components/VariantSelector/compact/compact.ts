import { html } from "@/templating/html"
import { ShopifyProduct, ShopifyVariant } from "@/shopify/graphql/types"
import { fetchProduct } from "@/shopify/graphql/fetchProduct"
import type { VariantSelector } from "../VariantSelector"
import { getSelectedVariant } from "../VariantSelector"

export function generateCompactSelectorHTML(product: ShopifyProduct) {
  return html`
    <div class="selector compact" part="selector compact">
      <select class="variant-select" part="variant-select">
        <option value="">Choose a variant</option>
        ${product.variants.map(variant => generateVariantOptionHTML(variant))}
      </select>
      <slot></slot>
    </div>
  `
}

function generateVariantOptionHTML(variant: ShopifyVariant) {
  // Generate option text from variant's selectedOptions (e.g., "Red / Large / Cotton")
  const optionText = variant.selectedOptions?.map(opt => opt.value).join(" / ") || variant.title
  const disabled = !variant.availableForSale ? " disabled" : ""

  return html`<option value="${variant.id}" ${disabled}>${optionText}</option>`
}

export function setupCompactListeners(element: VariantSelector) {
  // Handle change events for select element in compact mode
  element.shadowRoot!.addEventListener("change", async e => {
    const target = e.target as HTMLSelectElement
    if (target.classList.contains("variant-select")) {
      const variantId = target.value
      if (variantId) {
        await selectVariantById(element, variantId)
      }
    }
  })
}

async function selectVariantById(element: VariantSelector, variantId: string) {
  // Fetch product data to get the variant details
  const productData = await fetchProduct(element.handle)
  const variant = productData.variants.find(v => v.id === variantId)

  if (variant && variant.selectedOptions) {
    // Update selected options based on variant
    element.selectedOptions = {}
    variant.selectedOptions.forEach(selectedOption => {
      element.selectedOptions[selectedOption.name] = selectedOption.value
    })

    updateCompactActiveStates(element)
    const { emitVariantChange } = await import("../VariantSelector")
    emitVariantChange(element, productData)
  }
}

export function updateCompactActiveStates(element: VariantSelector) {
  // Update select element to show the currently selected variant
  const selectElement = element.shadowRoot!.querySelector<HTMLSelectElement>(".variant-select")
  if (selectElement && Object.keys(element.selectedOptions).length > 0) {
    // Find the variant that matches current selections
    fetchProduct(element.handle).then(product => {
      const variant = getSelectedVariant(element, product)
      if (variant && selectElement) {
        selectElement.value = variant.id
      }
    })
  }
}
