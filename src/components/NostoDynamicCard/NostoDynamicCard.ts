import { assertRequired, fetchProductSectionMarkup, extractSectionContent } from "@/utils"
import { customElement } from "../decorators"
import { NostoElement } from "../NostoElement"

/**
 * A custom element that renders a product by fetching the markup from Shopify based on the provided handle and template.
 *
 * This component is designed to be used in a Shopify environment and fetches product data dynamically.
 *
 * @property {string} handle - The product handle to fetch data for. Required.
 * @property {string} section - The section to use for rendering the product. section or template is required.
 * @property {string} template - The template to use for rendering the product. section or template is required.
 * @property {string} [variantId] - The variant ID to fetch specific variant data. Optional.
 * @property {boolean} [placeholder] - If true, the component will display placeholder content while loading. Defaults to false.
 * @property {boolean} [lazy] - If true, the component will only fetch data when it comes into view. Defaults to false.
 *
 * @example
 *  ```html
 * <nosto-dynamic-card handle="awesome-product" template="product-card" variant-id="123456">
 * Placeholder content while loading...
 * </nosto-dynamic-card>
 * ```
 */
@customElement("nosto-dynamic-card", { observe: true })
export class NostoDynamicCard extends NostoElement {
  /** @private */
  static attributes = {
    handle: String,
    section: String,
    template: String,
    variantId: String,
    placeholder: Boolean,
    lazy: Boolean
  }

  handle!: string
  section?: string
  template?: string
  variantId?: string
  placeholder?: boolean
  lazy?: boolean

  async attributeChangedCallback() {
    if (this.isConnected) {
      this.toggleAttribute("loading", true)
      this.innerHTML = await getMarkup(this)
      this.toggleAttribute("loading", false)
    }
  }

  async connectedCallback() {
    assertRequired(this, "handle")
    this.toggleAttribute("loading", true)
    const key = this.template || this.section || ""
    if (this.placeholder && placeholders.has(key)) {
      this.innerHTML = placeholders.get(key) || ""
    }
    if (this.lazy) {
      const observer = new IntersectionObserver(async entries => {
        if (entries[0].isIntersecting) {
          observer.disconnect()
          this.innerHTML = await getMarkup(this)
          this.toggleAttribute("loading", false)
        }
      })
      observer.observe(this)
    } else {
      this.innerHTML = await getMarkup(this)
      this.toggleAttribute("loading", false)
    }
  }
}

const placeholders = new Map<string, string>()

async function getMarkup(element: NostoDynamicCard) {
  const params = new URLSearchParams()
  if (element.template) {
    params.set("view", element.template)
    params.set("layout", "none")
  } else if (element.section) {
    // Use the helper function for section-based rendering
    const markup = await fetchProductSectionMarkup(element.handle, element.section, element.variantId)
    const extractedMarkup = extractSectionContent(markup)
    const key = element.section
    placeholders.set(key, extractedMarkup)
    if (/<(body|html)/.test(extractedMarkup)) {
      throw new Error(
        `Invalid markup for template ${element.template}, make sure that no <body> or <html> tags are included.`
      )
    }
    return extractedMarkup
  }
  if (element.variantId) {
    params.set("variant", element.variantId)
  }
  const result = await fetch(`/products/${element.handle}?${params}`)
  if (!result.ok) {
    throw new Error("Failed to fetch product data")
  }
  const markup = await result.text()
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
    "nosto-dynamic-card": NostoDynamicCard
  }
}
