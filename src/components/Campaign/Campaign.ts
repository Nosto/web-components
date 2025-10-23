import { customElement } from "../decorators"
import { nostojs } from "@nosto/nosto-js"
import { AttributedCampaignResult, JSONResult } from "@nosto/nosto-js/client"
import { compile } from "@/templating/vue"
import { getContext } from "../../templating/context"
import { NostoElement } from "../Element"
import { getTemplate } from "../common"
import { addRequest } from "./orchestrator"

/**
 * A custom element that renders a Nosto campaign based on the provided placement and fetched campaign data.
 * This component fetches campaign data from Nosto and injects it into the DOM.
 * It supports both HTML and JSON response modes, allowing for flexible rendering.
 * The placement or id attribute will be used as the identifier of the placement to be fetched.
 *
 * @category Store level templating
 *
 * @property {string} placement (or id) - The placement identifier for the campaign.
 * @property {string} productId (`product-id`) - The ID of the product to associate with
 * the campaign.
 * @property {string} [variantId] (`variant-id`) - The variant ID of the product.
 * @property {string} template - The ID of the template to use for rendering
 * the campaign. If provided, the campaign will be rendered using this template.
 * @property {string} [init] - If set to "false", the component will not
 * automatically load the campaign on connection. Defaults to "true".
 * @property {boolean} [lazy] - If true, the component will only load the campaign
 * when it comes into view using IntersectionObserver. Defaults to false.
 * @property {boolean} [cartSynced] (`cart-synced`) - If true, the component will reload the campaign
 * whenever a cart update event occurs. Useful for keeping cart-related campaigns in sync
 * with cart changes. Defaults to false.
 *
 * @example
 * Basic campaign rendering with HTML mode:
 * ```html
 * <nosto-campaign placement="front-page"></nosto-campaign>
 * ```
 *
 * @example
 * Campaign with template-based rendering:
 * ```html
 * <nosto-campaign placement="front-page" template="my-template">
 *   <template id="my-template">
 *     <div class="campaign">
 *       <h2>{{ title }}</h2>
 *       <div class="products">
 *         <div v-for="product in products" class="product">
 *           <img :src="product.imageUrl" :alt="product.name" />
 *           <h3>{{ product.name }}</h3>
 *           <span class="price">{{ product.price }}</span>
 *         </div>
 *       </div>
 *     </div>
 *   </template>
 * </nosto-campaign>
 * ```
 *
 * @example
 * Campaign with lazy loading and product context:
 * ```html
 * <nosto-campaign placement="product-recommendations" product-id="123" variant-id="456" lazy></nosto-campaign>
 * ```
 *
 * @example
 * Campaign with cart-synced functionality for dynamic cart updates:
 * ```html
 * <nosto-campaign placement="cart-recommendations" cart-synced></nosto-campaign>
 * ```
 */
@customElement("nosto-campaign")
export class Campaign extends NostoElement {
  /** @private */
  static properties = {
    placement: String,
    productId: String,
    variantId: String,
    template: String,
    init: String,
    lazy: Boolean,
    cartSynced: Boolean
  }

  placement!: string
  productId?: string
  variantId?: string
  template?: string
  init?: string
  lazy?: boolean
  cartSynced?: boolean

  /** @hidden */
  templateElement?: HTMLTemplateElement

  #load = this.load.bind(this)

  async connectedCallback() {
    if (!this.placement && !this.id) {
      throw new Error("placement or id attribute is required for Campaign")
    }

    // Register cart update listener if cart-synced is enabled
    if (this.cartSynced) {
      const api = await new Promise(nostojs)
      api.listen("cartupdated", this.#load)
    }

    if (this.init !== "false") {
      if (this.lazy) {
        const observer = new IntersectionObserver(async entries => {
          if (entries[0].isIntersecting) {
            observer.disconnect()
            await loadCampaign(this)
          }
        })
        observer.observe(this)
      } else {
        await loadCampaign(this)
      }
    }
  }

  async disconnectedCallback() {
    // Unregister cart update listener
    if (!this.cartSynced) {
      return
    }
    const api = await new Promise(nostojs)
    api.unlisten("cartupdated", this.#load)
  }

  async load() {
    await loadCampaign(this)
  }
}

export async function loadCampaign(element: Campaign) {
  element.toggleAttribute("loading", true)
  try {
    const useTemplate = element.templateElement || element.template || element.querySelector(":scope > template")
    const placement = element.placement ?? element.id
    const api = await new Promise(nostojs)

    const rec = await addRequest({
      placement,
      productId: element.productId,
      variantId: element.variantId,
      responseMode: useTemplate ? "JSON_ORIGINAL" : "HTML"
    })

    if (rec) {
      if (useTemplate) {
        const template = getTemplate(element)
        compile(element, template, getContext(rec as JSONResult))
        api.attributeProductClicksInCampaign(element, rec as JSONResult)
      } else {
        await api.placements.injectCampaigns(
          { [placement]: rec as string | AttributedCampaignResult },
          { [placement]: element }
        )
      }
    }
  } finally {
    element.toggleAttribute("loading", false)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-campaign": Campaign
  }
}
