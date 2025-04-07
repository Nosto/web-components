import { customElement } from "./decorators"
import { NostoProduct } from "./NostoProduct"
import { evaluate } from "@/services/templating"
import { assertRequired } from "@/utils"

/**
 * A custom element that renders a product card based on Nosto recommendation data.
 *
 * @property {string} recoId - The recommendation ID to associate with this product card.
 * @property {string} template - The id of the template element to use for rendering the product card.
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

  connectedCallback() {
    assertRequired(this, "recoId", "template")
    return initProductCard(this)
  }
}

async function initProductCard(element: NostoProductCard) {
  element.toggleAttribute("loading", true)
  const product = getData(element)
  const html = await evaluate(element.template, { product, data: element.dataset })

  if (element.wrap) {
    const wrapper = new NostoProduct()
    wrapper.recoId = element.recoId
    wrapper.productId = product.id
    wrapper.innerHTML = html
    element.appendChild(wrapper)
  } else {
    element.insertAdjacentHTML("beforeend", html)
  }
  element.toggleAttribute("loading", false)
}

function getData(element: HTMLElement) {
  const data = element.querySelector("script[product-data]")
  return data ? JSON.parse(data.textContent!) : {}
}
