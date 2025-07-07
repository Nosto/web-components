import { customElement } from "../decorators"
import { assertRequired } from "@/utils"
import { compile } from "@/vue"
import { NostoElement } from "../NostoElement"

/**
 * A custom element that renders a product card using a Vue-like template.
 *
 * @property {string} template - The id of the Vue-like template element to use for rendering the product card.
 *
 * @throws {Error} - Throws an error if recoId or template is not provided.
 *
 * @example
 * ```html
 * <nosto-product-card template="product-card-template">
 *   <script type="application/json" product-data>
 *     {
 *       "id": "1223456",
 *       "image": "https://example.com/images/awesome-product.jpg",
 *       "title": "Awesome Product",
 *       "price": "19.99",
 *       "listPrice": "29.99"
 *     }
 *   </script>
 * </nosto-product-card>
 *
 * <template id="product-card-template">
 *   <img :src="product.image" :alt="product.title" class="product-image" />
 *   <h1>{{ product.title }}</h1>
 *   <p class="price">
 *     <span n-price>{{ product.price }}</span>
 *   </p>
 *   <p class="list-price">
 *     <span n-list-price>{{ product.listPrice }}</span>
 *   </p>
 * </template>
 * ```
 *
 * @example
 * ```html
 * <nosto-product-card template="product-card-template"
 *   data-id="1223456"
 *   data-image="https://example.com/images/awesome-product.jpg"
 *   data-title="Awesome Product"
 *   data-price="19.99"
 *   data-list-price="29.99">
 * </nosto-product-card>
 * ```
 */
@customElement("nosto-product-card")
export class NostoProductCard extends NostoElement {
  static attributes = {
    template: String
  }

  template!: string

  async connectedCallback() {
    assertRequired(this, "template")
    this.toggleAttribute("loading", true)
    const template = document.querySelector<HTMLTemplateElement>(`template#${this.template}`)
    if (!template) {
      throw new Error(`Template with id "${this.template}" not found.`)
    }
    const product = getData(this) ?? this.dataset
    compile(this, template, { product })
    this.toggleAttribute("loading", false)
  }
}

function getData(element: HTMLElement) {
  const data = element.querySelector("script[product-data]")
  return data ? JSON.parse(data.textContent!) : undefined
}
