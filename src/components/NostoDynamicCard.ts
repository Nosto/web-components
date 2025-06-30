import { assertRequired } from "@/utils"
import { customElement } from "./decorators"

/**
 * A custom elements that renders a product by fetching the markup from Shopify based on the provided handle and template.
 *
 * This component is designed to be used in a Shopify environment and fetches product data dynamically.
 *
 * @property {string} handle - The product handle to fetch data for. Required.
 * @property {string} template - The template to use for rendering the product. Required.
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
@customElement("nosto-dynamic-card")
export class NostoDynamicCard extends HTMLElement {
  static attributes = {
    handle: String,
    template: String,
    variantId: String,
    placeholder: Boolean,
    lazy: Boolean
  }

  handle!: string
  template!: string
  variantId?: string
  placeholder?: boolean
  lazy?: boolean

  async connectedCallback() {
    assertRequired(this, "handle", "template")
    this.toggleAttribute("loading", true)
    if (this.placeholder && placeholders.has(this.template)) {
      this.innerHTML = placeholders.get(this.template) || ""
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
  params.set("view", element.template)
  params.set("layout", "none")
  if (element.variantId) {
    params.set("variant", element.variantId)
  }
  const result = await fetch(`/products/${element.handle}?${params}`)
  if (!result.ok) {
    throw new Error("Failed to fetch product data")
  }
  const markup = await result.text()
  placeholders.set(element.template, markup)
  if (/<(body|html)/.test(markup)) {
    throw new Error(
      `Invalid markup for template ${element.template}, make sure that no <body> or <html> tags are included.`
    )
  }
  return markup
}
