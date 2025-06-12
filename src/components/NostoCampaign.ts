import { assertRequired } from "@/utils"
import { customElement } from "./decorators"
import { nostojs } from "@nosto/nosto-js"
import { evaluate } from "@/services/templating"

@customElement("nosto-campaign")
export class NostoCampaign extends HTMLElement {
  static attributes = {
    placement: String,
    productId: String,
    variantId: String,
    template: String
  }

  placement!: string
  productId!: string
  variantId?: string
  template!: string

  async connectedCallback() {
    assertRequired(this, "placement")
    await loadCampaign(this)
  }
}

export async function loadCampaign(element: NostoCampaign) {
  element.toggleAttribute("loading", true)
  const api = await new Promise(nostojs)
  const request = api
    .createRecommendationRequest({ includeTagging: true })
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

  const { recommendations } = await request.load()
  const rec = recommendations[element.placement!]
  if (rec && element.template) {
    const html = await evaluate(element.template, rec as object)
    await api.placements.injectCampaigns({ [element.placement]: html }, { [element.placement]: element })
  }
  element.toggleAttribute("loading", false)
}
