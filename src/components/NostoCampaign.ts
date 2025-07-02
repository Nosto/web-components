import { assertRequired, maybeLogFirstUsage } from "@/utils"
import { customElement } from "./decorators"
import { nostojs } from "@nosto/nosto-js"
import { AttributedCampaignResult, JSONResult } from "@nosto/nosto-js/client"
import { evaluate } from "@/services/templating"

/**
 * A custom element that renders a Nosto campaign based on the provided placement and fetched campaign data.
 * This component fetches campaign data from Nosto and injects it into the DOM.
 * It supports both HTML and JSON response modes, allowing for flexible rendering.
 *
 * @property {string} placement - The placement identifier for the campaign.
 * @property {string} productId - The ID of the product to associate with
 * the campaign.
 * @property {string} [variantId] - The variant ID of the product.
 * @property {string} template - The ID of the template to use for rendering
 * the campaign. If provided, the campaign will be rendered using this template.
 * @property {string} [init] - If set to "false", the component will not
 * automatically load the campaign on connection. Defaults to "true".
 */
@customElement("nosto-campaign")
export class NostoCampaign extends HTMLElement {
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

  async connectedCallback() {
    assertRequired(this, "placement")

    maybeLogFirstUsage()

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
  const api = await new Promise(nostojs)
  const request = api
    .createRecommendationRequest({ includeTagging: true })
    // TODO: Temporary workaround – once injectCampaigns() supports full context, update NostoCampaign
    .disableCampaignInjection()
    .setElements([element.placement!])
    .setResponseMode(element.template ? "JSON_ORIGINAL" : "HTML")

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
  const rec = recommendations[element.placement!]
  if (rec) {
    if (element.template) {
      const html = await evaluate(element.template, rec as JSONResult)
      element.innerHTML = html
      api.attributeProductClicksInCampaign(element, rec as JSONResult)
    } else {
      await api.placements.injectCampaigns(
        { [element.placement]: rec as string | AttributedCampaignResult },
        { [element.placement]: element }
      )
    }
  }
  element.toggleAttribute("loading", false)
}
