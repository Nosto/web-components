import { assertRequired } from "@/utils"
import { customElement } from "./decorators"
import { nostojs } from "@nosto/nosto-js"
import { AttributedCampaignResult, JSONResult } from "@nosto/nosto-js/client"
import { evaluate } from "@/services/templating"

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
