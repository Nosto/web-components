import { logFirstUsage } from "@/logger"
import { customElement } from "./decorators"
import { evaluate } from "@/services/templating"
import { assertRequired } from "@/utils"

/**
 * A custom element that renders a product card based on Nosto recommendation data.
 *
 * @property {string} template - The id of the template element to use for rendering the product card.
 *
 * @throws {Error} - Throws an error if recoId or template is not provided.
 *
 * @example
 * ```html
 * <nosto-product-card template="product-card-template">
 *   <script type="application/json" product-data>
 *   {
 *     "id": "1223456",
 *     "image": "https://example.com/images/awesome-product.jpg",
 *     "title": "Awesome Product",
 *     "price": "19.99",
 *     "listPrice": "29.99"
 *   }
 *   </script>
 * </nosto-product-card>
 *
 * <script id="product-card-template" type="text/x-liquid-template">
 *   <img src="{{ product.image }}" alt="{{ product.title }}" class="product-image" />
 *   <h1>{{ product.title }}</h1>
 *   <p class="price">
 *     <span n-price>{{ product.price }}</span>
 *   </p>
 *   <p class="list-price">
 *     <span n-list-price>{{ product.listPrice }}</span>
 *   </p>
 * </script>
 * ```
 */
@customElement("nosto-product-card")
export class NostoProductCard extends HTMLElement {
  static attributes = {
    template: String
  }

  template!: string

  async connectedCallback() {
    assertRequired(this, "template")
    logFirstUsage()
    this.toggleAttribute("loading", true)
    const product = getData(this)
    const html = await evaluate(this.template, { product, data: this.dataset })
    this.insertAdjacentHTML("beforeend", html)
    this.toggleAttribute("loading", false)
  }
}

function getData(element: HTMLElement) {
  const data = element.querySelector("script[product-data]")
  return data ? JSON.parse(data.textContent!) : {}
}
