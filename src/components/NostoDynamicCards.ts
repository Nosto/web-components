import { assertRequired } from "@/utils"
import { customElement } from "./decorators"
import { getMarkup } from "./NostoDynamicCard"

/**
 * A custom element that renders multiple products by fetching the markup from Shopify based on the provided handles and template.
 *
 * This component is designed to be used in a Shopify environment and fetches product data dynamically.
 *
 * @property {string} handles - A comma separated list of product handles to fetch data for. Required.
 * @property {string} variants - A comma separated list of variant IDs to fetch specific variant data. Optional.
 * @property {string} template - The template to use for rendering the product. Required.
 *
 * @example
 *  ```html
 * <nosto-dynamic-cards handles="handle1,handle2,handle3" template="product-card">
 * Placeholder content while loading...
 * </nosto-dynamic-cards>
 * ```
 *
 * @example
 *  ```html
 * <nosto-dynamic-cards handles="handle1,handle2,handle3" template="product-card">
 *   <template>
 *     <div class="product">
 *       <slot></slot>
 *     </div>
 *   </template>
 * </nosto-dynamic-cards>
 * ```
 */
@customElement("nosto-dynamic-cards")
export class NostoDynamicCards extends HTMLElement {
  static attributes = {
    handles: String,
    variants: String,
    template: String
  }

  handles!: string
  variants!: string
  template!: string

  async connectedCallback() {
    assertRequired(this, "handles", "template")
    this.toggleAttribute("loading", true)
    const variants = this.variants ? this.variants.split(",") : []
    const products = await Promise.all(
      this.handles.split(",").map((handle, i) => getMarkup({ handle, template: this.template, variantId: variants[i] }))
    )
    if (this.querySelector("template")) {
      const template = this.querySelector<HTMLTemplateElement>("template")!
      const content = products.map(product => {
        const clone = template.content.cloneNode(true) as DocumentFragment
        clone.querySelector("slot")!.replaceWith(document.createRange().createContextualFragment(product))
        return clone
      })
      template.replaceWith(...content)
    } else {
      this.innerHTML = products.join("")
    }
    this.toggleAttribute("loading", false)
  }
}
