import { customElement } from "./decorators"
import { NostoProduct } from "./NostoProduct"
import { evaluate } from "@/services/templating"
import { assertRequired } from "@/utils"

/**
 * A custom element that renders a product card based on Nosto recommendation data.
 *
 * @property {string} recoId - The recommendation ID to associate with this product card.
 * @property {string} template - The id of the template element to use for rendering the product card.
 * @property {string} [handle] - The product handle to fetch product data from the server.
 * @property {boolean} [wrap] - Whether to wrap the rendered content in a NostoProduct element.
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
    recoId: String,
    template: String,
    handle: String,
    wrap: Boolean
  }

  recoId!: string
  template!: string
  handle!: string
  wrap!: boolean

  async connectedCallback() {
    assertRequired(this, "recoId", "template")
    this.toggleAttribute("loading", true)
    const product = await getData(this)
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
}

async function getData(element: NostoProductCard) {
  if (element.handle) {
    const response = await fetch(`/products/${element.handle}.js`)
    if (!response.ok) {
      throw new Error(`Failed to fetch product data: ${response.statusText}`)
    }
    return await response.json()
    // TODO map Shopify response to Nosto product data model?
  }
  const data = element.querySelector("script[product-data]")
  return data ? JSON.parse(data.textContent!) : {}
}
