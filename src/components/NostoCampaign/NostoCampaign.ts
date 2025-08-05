import { customElement } from "../decorators"
import { nostojs } from "@nosto/nosto-js"
import { AttributedCampaignResult, JSONResult } from "@nosto/nosto-js/client"
import { compile } from "@/templating/vue"
import { getContext } from "../../templating/context"
import { NostoElement } from "../NostoElement"
import { getTemplate } from "../common"
import { addRequest } from "./orchestrator"
import { Renderer } from "./types"

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
 * @property {string} [renderer] - The name of a global function that will
 * be called to render the campaign. This function should accept the campaign
 * data and the context as parameters and return a Promise.
 * @property {string} [init] - If set to "false", the component will not
 * automatically load the campaign on connection. Defaults to "true".
 */
@customElement("nosto-campaign")
export class NostoCampaign extends NostoElement {
  /** @private */
  static attributes = {
    placement: String,
    productId: String,
    variantId: String,
    template: String,
    init: String,
    renderer: String
  }

  placement!: string
  productId!: string
  variantId?: string
  template!: string
  init?: string
  renderer?: string

  templateElement?: HTMLTemplateElement

  async connectedCallback() {
    if (!this.placement && !this.id) {
      throw new Error("placement or id attribute is required for NostoCampaign")
    }
    if (this.init !== "false") {
      await loadCampaign(this)
    }
  }

  async load() {
    await loadCampaign(this)
  }
}

export async function loadCampaign(element: NostoCampaign) {
  element.toggleAttribute("loading", true)
  const useTemplate = element.templateElement || element.template || element.querySelector(":scope > template")
  const useJson = useTemplate || element.renderer
  const placement = element.placement ?? element.id
  const api = await new Promise(nostojs)

  const rec = await addRequest({
    placement,
    productId: element.productId,
    variantId: element.variantId,
    responseMode: useJson ? "JSON_ORIGINAL" : "HTML"
  })

  if (rec) {
    if (element.renderer) {
      // @ts-expect-error unsafe access to window
      const fn = window[element.renderer] as Renderer
      await fn(rec as AttributedCampaignResult, element)
      api.attributeProductClicksInCampaign(element, rec as JSONResult)
    } else if (useTemplate) {
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
  element.toggleAttribute("loading", false)
}
