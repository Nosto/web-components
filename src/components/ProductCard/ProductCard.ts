import { customElement } from "../decorators"
import { compile } from "@/templating/vue"
import { html } from "@/templating/html"
import { NostoElement } from "../Element"
import { getContext } from "../../templating/context"
import { getTemplate } from "../common"

/**
 * A custom element that renders a product card using a Vue-like template or HTML templating.
 *
 * @property {string} template - The id of the Vue-like template element to use for rendering the product card.
 * @property {boolean} [useHtmlTemplating] - If true, uses HTML templating instead of Vue templating. Defaults to false.
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
export class ProductCard extends NostoElement {
  /** @private */
  static attributes = {
    template: String,
    useHtmlTemplating: Boolean
  }

  template!: string
  useHtmlTemplating?: boolean
  templateElement?: HTMLTemplateElement

  async connectedCallback() {
    this.toggleAttribute("loading", true)
    const product = getData(this) ?? this.dataset

    if (this.useHtmlTemplating) {
      // Use HTML templating approach
      const htmlTemplate = generateProductCardHTML(product)
      this.innerHTML = htmlTemplate
    } else {
      // Use Vue templating approach (default)
      const template = getTemplate(this)
      compile(this, template, getContext({ product }))
    }

    this.toggleAttribute("loading", false)
  }
}

function getData(element: HTMLElement) {
  const data = element.querySelector("script[product-data]")
  return data ? JSON.parse(data.textContent!) : undefined
}

function generateProductCardHTML(product: {
  image?: string
  title?: string
  price?: string
  listPrice?: string
}): string {
  // Example HTML template using html templating for product card
  return html`
    <div class="product-card">
      ${product.image ? html`<img src="${product.image}" alt="${product.title}" class="product-image" />` : ""}
      <h1 class="product-title">${product.title || ""}</h1>
      ${product.price ? html`<p class="price"><span n-price>${product.price}</span></p>` : ""}
      ${product.listPrice ? html`<p class="list-price"><span n-list-price>${product.listPrice}</span></p>` : ""}
    </div>
  `.html
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-product-card": ProductCard
  }
}
