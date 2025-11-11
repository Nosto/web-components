import { assertRequired } from "@/utils/assertRequired"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import { getText } from "@/utils/fetch"
import { customElement, property } from "../decorators"
import { NostoElement } from "../Element"

/** Event name for the DynamicCard loaded event */
const DYNAMIC_CARD_LOADED_EVENT = "@nosto/DynamicCard/loaded"

/**
 * A custom element that renders a product by fetching the markup from Shopify based on the provided handle and template.
 *
 * This component is designed to be used in a Shopify environment and fetches product data dynamically.
 *
 * {@include ./examples.md}
 *
 * @category Campaign level templating
 *
 * @property {string} handle - The product handle to fetch data for. Required.
 * @property {string} section - The section to use for rendering the product. section or template is required.
 * @property {string} template - The template to use for rendering the product. section or template is required.
 * @property {string} [variantId] (`variant-id`) - The variant ID to fetch specific variant data. Optional.
 * @property {boolean} [placeholder] - If true, the component will display placeholder content while loading. Defaults to false.
 * @property {boolean} [lazy] - If true, the component will only fetch data when it comes into view. Defaults to false.
 * @property {boolean} [mock] - If true, renders a visual placeholder instead of fetching real product data. Defaults to false.
 */
@customElement("nosto-dynamic-card", { observe: true })
export class DynamicCard extends NostoElement {
  @property(String) handle!: string
  @property(String) section?: string
  @property(String) template?: string
  @property(String) variantId?: string
  @property(Boolean) placeholder?: boolean
  @property(Boolean) lazy?: boolean
  @property(Boolean) mock?: boolean

  async attributeChangedCallback(_: string, oldValue: string | null, newValue: string | null) {
    if (this.isConnected && oldValue !== newValue) {
      await loadAndRenderMarkup(this)
    }
  }

  async connectedCallback() {
    assertRequired(this, "handle")
    const key = this.template || this.section || ""
    if (this.placeholder && placeholders.has(key)) {
      this.toggleAttribute("loading", true)
      this.innerHTML = placeholders.get(key) || ""
    }
    if (this.lazy) {
      const observer = new IntersectionObserver(async entries => {
        if (entries[0].isIntersecting) {
          observer.disconnect()
          await loadAndRenderMarkup(this)
        }
      })
      observer.observe(this)
    } else {
      await loadAndRenderMarkup(this)
    }
  }
}

const placeholders = new Map<string, string>()

function generateMockMarkup() {
  return `
    <div style="border: 2px dashed #ccc; padding: 1rem; background: #f9f9f9; opacity: 0.8; text-align: center;">
      <div style="background: linear-gradient(135deg, #e0e0e0 25%, #f5f5f5 25%, #f5f5f5 50%, #e0e0e0 50%, #e0e0e0 75%, #f5f5f5 75%, #f5f5f5); background-size: 40px 40px; min-height: 200px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
        <span style="font-weight: bold; font-size: 1.2rem; color: #999;">MOCK PREVIEW</span>
      </div>
      <h3 style="margin: 0.5rem 0; color: #666;">Mock Product Title</h3>
      <p style="margin: 0.5rem 0; color: #999;">Mock Brand</p>
      <div style="margin: 0.5rem 0;">
        <span style="font-weight: bold; color: #333;">$99.99</span>
        <span style="text-decoration: line-through; color: #999; margin-left: 0.5rem;">$129.99</span>
      </div>
    </div>
  `
}

async function loadAndRenderMarkup(element: DynamicCard) {
  // If mock mode is enabled, render mock template and skip fetching
  if (element.mock) {
    element.innerHTML = generateMockMarkup()
    element.dispatchEvent(new CustomEvent(DYNAMIC_CARD_LOADED_EVENT, { bubbles: true, cancelable: true }))
    return
  }

  element.toggleAttribute("loading", true)
  try {
    element.innerHTML = await getMarkup(element)
    element.dispatchEvent(new CustomEvent(DYNAMIC_CARD_LOADED_EVENT, { bubbles: true, cancelable: true }))
  } finally {
    element.toggleAttribute("loading", false)
  }
}

async function getMarkup(element: DynamicCard) {
  const target = createShopifyUrl(`/products/${element.handle}`)

  if (element.template) {
    target.searchParams.set("view", element.template)
    target.searchParams.set("layout", "none")
  } else if (element.section) {
    target.searchParams.set("section_id", element.section)
  }

  if (element.variantId) {
    target.searchParams.set("variant", element.variantId)
  }

  let markup = await getText(target.href, { cached: true })

  if (element.section) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(markup, "text/html")
    markup = doc.body.firstElementChild?.innerHTML?.trim() || markup
  }
  const key = element.template || element.section || ""
  placeholders.set(key, markup)
  if (/<(body|html)/.test(markup)) {
    throw new Error(
      `Invalid markup for template ${element.template}, make sure that no <body> or <html> tags are included.`
    )
  }
  return markup
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-dynamic-card": DynamicCard
  }
}
