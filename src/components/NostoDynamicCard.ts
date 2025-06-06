import { assertRequired } from "@/utils"
import { customElement } from "./decorators"

/**
 * A custom element that renders a product by fetching the markup from Shopify based on the provided handle and template.
 *
 * This component is designed to be used in a Shopify environment and fetches product data dynamically.
 *
 * @property {string} handle - The product handle to fetch data for. Required.
 * @property {string} template - The template to use for rendering the product. Required.
 * @property {string} [variantId] - The variant ID to fetch specific variant data. Optional.
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
    variantId: String
  }

  handle!: string
  template!: string
  variantId?: string
  // TODO lazy mode to load the markup only when in viewport

  async connectedCallback() {
    assertRequired(this, "handle", "template")
    this.toggleAttribute("loading", true)
    this.innerHTML = await getMarkup(this)
    this.toggleAttribute("loading", false)
  }
}

type CardProps = Pick<NostoDynamicCard, "handle" | "template" | "variantId">

export async function getMarkup({ handle, template, variantId }: CardProps) {
  const params = new URLSearchParams()
  params.set("view", template)
  params.set("layout", "none")
  if (variantId) {
    params.set("variant", variantId)
  }
  const result = await fetch(`/products/${handle}?${params}`)
  if (!result.ok) {
    throw new Error("Failed to fetch product data")
  }
  const markup = await result.text()
  if (/<(body|html)/.test(markup)) {
    throw new Error("Invalid markup for template " + template)
  }
  return markup
}
