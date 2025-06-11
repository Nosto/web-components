import { assertRequired } from "@/utils"
import { customElement } from "./decorators"
import { nostojs } from "@nosto/nosto-js"
import { evaluate } from "@/services/templating"

@customElement("nosto-campaign")
export class NostoCampaign extends HTMLElement {
  static attributes = {
    placement: String,
    product: String,
    variant: String,
    template: String
  }

  placement!: string
  product!: string
  variant?: string
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
    // TODO: Temporary workaround – once injectCampaigns() supports full context, update NostoCampaign
    .disableCampaignInjection()
    .setElements([element.placement!])
    .setResponseMode(element.template ? "JSON_ORIGINAL" : "HTML")

  if (element.product) {
    request.setProducts([
      {
        product_id: element.product,
        ...(element.variant ? { sku_id: element.variant } : {})
      }
    ])
  }

  const { recommendations } = await request.load()
  const rec = recommendations[element.placement!]
  if (rec) {
    if (element.template) {
      const html = await evaluate(element.template, rec as object)
      element.innerHTML = html
    } else if (typeof rec === "object" && "html" in rec) {
      element.innerHTML = rec.html
    } else if (typeof rec === "string") {
      element.innerHTML = rec
    }
  }
  element.toggleAttribute("loading", false)
}
