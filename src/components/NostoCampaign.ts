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
    .setResponseMode(element.template ? "JSON_ORIGINAL" : "HTML")

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
  if (element.template && typeof rec === "object" && rec !== null && "products" in rec) {
    element.toggleAttribute("loading", true)
    for (const product of rec.products) {
      const html = await evaluate(element.template, { product, data: element.dataset })
      element.insertAdjacentHTML("beforeend", html)
    }
    element.toggleAttribute("loading", false)
  } else if (typeof rec === "object" && "html" in rec) {
    element.innerHTML = rec.html
  }
}
