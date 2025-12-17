import { customElement, property } from "../decorators"
import { nostojs } from "@nosto/nosto-js"
import { AttributedCampaignResult, JSONResult } from "@nosto/nosto-js/client"
import { compile } from "@/templating/vue"
import { getContext } from "../../templating/context"
import { NostoElement } from "../Element"
import { getTemplate } from "../common"
import { addRequest } from "./orchestrator"
import { isNavigationApiSupported } from "@/utils/navigationApi"

/**
 * A custom element that renders a Nosto campaign based on the provided placement and fetched campaign data.
 * This component fetches campaign data from Nosto and injects it into the DOM.
 * It supports both HTML and JSON response modes, allowing for flexible rendering.
 * The placement or id attribute will be used as the identifier of the placement to be fetched.
 *
 * {@include ./examples.md}
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
 * @property {boolean} [navSynced] (`nav-synced`) - If true, the component will reload the campaign
 * whenever a successful page navigation occurs via the Navigation API. Useful for keeping
 * campaigns in sync with URL changes (e.g., category-specific recommendations). Requires
 * browser support for the Navigation API. Defaults to false.
 */
@customElement("nosto-campaign")
export class Campaign extends NostoElement {
  @property(String) placement!: string
  @property(String) productId?: string
  @property(String) variantId?: string
  @property(String) template?: string
  @property(String) init?: string
  @property(Boolean) lazy?: boolean
  @property(Boolean) cartSynced?: boolean
  @property(Boolean) navSynced?: boolean

  /** @hidden */
  templateElement?: HTMLTemplateElement

  #load = this.load.bind(this)

  async connectedCallback() {
    if (!this.placement && !this.id) {
      throw new Error("placement or id attribute is required for Campaign")
    }

    if (this.cartSynced) {
      const api = await new Promise(nostojs)
      api.listen("cartupdated", this.#load)
    }
    if (this.navSynced) {
      if (isNavigationApiSupported()) {
        navigation.addEventListener("navigatesuccess", this.#load)
      } else {
        console.warn("Navigation API is not supported in this browser. The nav-synced feature will not work.")
      }
    }

    if (this.init !== "false") {
      if (this.lazy) {
        const observer = new IntersectionObserver(async entries => {
          if (entries[0].isIntersecting) {
            observer.disconnect()
            await this.load()
          }
        })
        observer.observe(this)
      } else {
        await this.load()
      }
    }
  }

  async disconnectedCallback() {
    if (this.cartSynced) {
      const api = await new Promise(nostojs)
      api.unlisten("cartupdated", this.#load)
    }
    if (this.navSynced && isNavigationApiSupported()) {
      navigation.removeEventListener("navigatesuccess", this.#load)
    }
  }

  async load() {
    this.toggleAttribute("loading", true)
    try {
      const useTemplate = this.templateElement || this.template || this.querySelector(":scope > template")
      const placement = this.placement ?? this.id
      const api = await new Promise(nostojs)

      const rec = await addRequest({
        placement,
        productId: this.productId,
        variantId: this.variantId,
        responseMode: useTemplate ? "JSON_ORIGINAL" : "HTML"
      })

      if (rec) {
        if (useTemplate) {
          const template = getTemplate(this)
          compile(this, template, getContext(rec as JSONResult))
          api.attributeProductClicksInCampaign(this, rec as JSONResult)
        } else {
          await api.placements.injectCampaigns(
            { [placement]: rec as string | AttributedCampaignResult },
            { [placement]: this }
          )
        }
      }
    } finally {
      this.toggleAttribute("loading", false)
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-campaign": Campaign
  }
}
