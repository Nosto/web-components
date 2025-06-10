import { assertRequired } from "@/utils"
import { customElement } from "../decorators"
import { nostojs } from "@nosto/nosto-js"
@customElement("nosto-campaign")
export class NostoCampaign extends HTMLElement {
  static attributes = {
    placement: String,
    product: String,
    variant: String
  }

  placement!: string
  product!: string
  variant?: string

  async connectedCallback() {
    assertRequired(this, "placement")
    this.classList.add("nosto_element")
    this.id = this.placement!
    await loadCampaign(this)
  }
}

export async function loadCampaign(element: NostoCampaign) {
  const api = await new Promise(nostojs)
  const request = api
    .createRecommendationRequest({ includeTagging: true })
    // TODO: Temporary workaround – once injectCampaigns() supports full context, update NostoCampaign
    .disableCampaignInjection()
    .setElements([element.placement!])
    .setResponseMode("HTML")

  if (element.product) {
    request.setProducts([
      {
        product_id: element.product,
        ...(element.variant ? { sku_id: element.variant } : {})
      }
    ])
  }

  const result = await request.load()
  const rec = result.recommendations[element.placement!]
  const html =
    typeof rec === "string"
      ? rec
      : typeof rec === "object" && rec !== null && "html" in rec
        ? (rec as { html: string }).html
        : undefined

  if (html) {
    // TODO: this is missing attribution handling and HTML preprocessing which will be added later
    element.innerHTML = html
  } else {
    console.warn(`No recommendation result for div ID: ${element.placement}`)
  }
}
