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
  const isJsonMode = Boolean(element.template)
  const responseMode = isJsonMode ? "JSON_ORIGINAL" : "HTML"
  const request = api
    .createRecommendationRequest({ includeTagging: true })
    .setElements([element.placement!])
    .setResponseMode(responseMode)

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
  if (rec) {
    if (isJsonMode) {
      const html = await evaluate(element.template, rec as object)
      element.innerHTML = html
      api.attributeProductClicksInCampaign(element, rec)
    } else {
      await api.placements.injectCampaigns({ [element.placement]: rec.html }, { [element.placement]: element })
    }
  }
  element.toggleAttribute("loading", false)
}
