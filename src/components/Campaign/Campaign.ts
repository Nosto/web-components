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
 * @property {string} placement (or id) - The placement identifier for the campaign.
 * @property {string} productId - The ID of the product to associate with
 * the campaign.
 * @property {string} [variantId] - The variant ID of the product.
 * @property {string} template - The ID of the template to use for rendering
 * the campaign. If provided, the campaign will be rendered using this template.
 * @property {string} [init] - If set to "false", the component will not
 * automatically load the campaign on connection. Defaults to "true".
 * @property {boolean} [lazy] - If true, the component will only load the campaign
 * when it comes into view using IntersectionObserver. Defaults to false.
 */
@customElement("nosto-campaign")
export class Campaign extends NostoElement {
  /** @private */
  static attributes = {
    placement: String,
    productId: String,
    variantId: String,
    template: String,
    init: String,
    lazy: Boolean
  }

  placement!: string
  productId!: string
  variantId?: string
  template!: string
  init?: string
  lazy?: boolean

  templateElement?: HTMLTemplateElement

  async connectedCallback() {
    if (!this.placement && !this.id) {
      throw new Error("placement or id attribute is required for Campaign")
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

  /**
   * Template method for overriding in subclasses
   */
  async getContext(rec: JSONResult) {
    return getContext(rec)
  }

  async load() {
    await loadCampaign(this)
  }
}

export async function loadCampaign(element: Campaign) {
  element.toggleAttribute("loading", true)
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
      const context = await element.getContext(rec as JSONResult)
      compile(element, template, context)
      api.attributeProductClicksInCampaign(element, rec as JSONResult)
    } else {
      await api.placements.injectCampaigns(
        { [placement]: rec as string | AttributedCampaignResult },
        { [placement]: element }
      )
    }
  }
  element.toggleAttribute("loading", false)
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-campaign": Campaign
  }
}
