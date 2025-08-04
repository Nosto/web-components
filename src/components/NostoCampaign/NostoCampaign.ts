import { customElement } from "../decorators"
import { nostojs } from "@nosto/nosto-js"
import { AttributedCampaignResult, JSONResult } from "@nosto/nosto-js/client"
import { compile } from "@/templating/vue"
import { getContext } from "../../templating/context"
import { NostoElement } from "../NostoElement"

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
 */
@customElement("nosto-campaign")
export class NostoCampaign extends NostoElement {
  /** @private */
  static attributes = {
    placement: String,
    productId: String,
    variantId: String,
    template: String,
    init: String
  }

  placement!: string
  productId!: string
  variantId?: string
  template!: string
  init?: string

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

function getTemplate(element: NostoCampaign): HTMLTemplateElement {
  if (element.templateElement) {
    return element.templateElement
  }
  const template = element.template
    ? document.querySelector<HTMLTemplateElement>(`template#${element.template}`)
    : element.querySelector<HTMLTemplateElement>(":scope > template")
  if (!template) {
    throw new Error(`Template with id "${element.template}" not found.`)
  }
  element.templateElement = template
  return template
}

export async function loadCampaign(element: NostoCampaign) {
  element.toggleAttribute("loading", true)
  const useTemplate = element.templateElement || element.template || element.querySelector(":scope > template")
  const placement = element.placement ?? element.id
  const api = await new Promise(nostojs)
  const request = api
    .createRecommendationRequest({ includeTagging: true })
    // TODO: Temporary workaround – once injectCampaigns() supports full context, update NostoCampaign
    .disableCampaignInjection()
    .setElements([placement])
    .setResponseMode(useTemplate ? "JSON_ORIGINAL" : "HTML")

  if (element.productId) {
    request.setProducts([
      {
        product_id: element.productId,
        ...(element.variantId ? { sku_id: element.variantId } : {})
      }
    ])
  }

  const flags = {
    skipPageViews: true,
    // track events for contextual recommendations
    skipEvents: !element.productId
  }

  const { recommendations } = await request.load(flags)
  const rec = recommendations[placement]
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
  element.toggleAttribute("loading", false)
}
