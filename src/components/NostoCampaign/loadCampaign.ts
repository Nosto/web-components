import { nostojs } from "@nosto/nosto-js"
import type { NostoCampaign } from "./NostoCampaign"

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
  // TODO: Replace manual innerHTML assignment once injectCampaigns() can target contextual containers
  const rec = result.recommendations[element.placement!]
  const html =
    typeof rec === "string"
      ? rec
      : typeof rec === "object" && rec !== null && "html" in rec
        ? (rec as { html: string }).html
        : undefined

  if (html) {
    element.innerHTML = html
  } else {
    console.warn(`No recommendation result for div ID: ${element.placement}`)
  }
}
