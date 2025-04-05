import { customElement } from "./decorators"
import { NostoProduct } from "./NostoProduct"
import { evaluate } from "@/services/templating"

/**
 * A custom element that renders a product card based on Nosto recommendation data.
 *
 * @property {string} recoId - The recommendation ID to associate with this product card.
 * @property {string} template - The id of the template element to use for rendering the product card.
 * @property {boolean} wrap - Whether to wrap the rendered content in a NostoProduct element.
 *
 * @throws {Error} - Throws an error if recoId or template is not provided.
 * 
 * @example
 * ```html
 * <nosto-product-card reco-id="789011" template="product-card-template">
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
 * <template id="product-card-template" type="text/liquid">
 *   <img src="{{ product.image }}" alt="{{ product.title }}" class="product-image" />
 *   <h1>{{ product.title }}</h1>
 *   <p class="price">
 *     <span n-price>{{ product.price }}</span>
 *   </p>
 *   <p class="list-price">
 *     <span n-list-price>{{ product.listPrice }}</span>
 *   </p>
 * </template>
 * ```
 */
@customElement("nosto-product-card")
export class NostoProductCard extends HTMLElement {
  static attributes = {
    recoId: String,
    template: String,
    wrap: Boolean
  }

  recoId!: string
  template!: string
  wrap!: boolean

  constructor() {
    super()
  }

  connectedCallback() {
    this.validate()
    return this.render()
  }

  private validate() {
    if (!this.recoId) {
      throw new Error("Slot ID is required.")
    }
    if (!this.template) {
      throw new Error("Template is required.")
    }
  }

  private async render() {
    this.toggleAttribute("loading", true)
    const product = this.getData()
    const html = await evaluate(this.template, { product, data: this.dataset })

    if (this.wrap) {
      const wrapper = new NostoProduct()
      wrapper.recoId = this.recoId
      wrapper.productId = product.id
      wrapper.innerHTML = html
      this.appendChild(wrapper)
    } else {
      this.insertAdjacentHTML("beforeend", html)
    }
    this.toggleAttribute("loading", false)
  }

  private getData() {
    const data = this.querySelector("script[product-data]")
    return data ? JSON.parse(data.textContent!) : {}
  }
}
