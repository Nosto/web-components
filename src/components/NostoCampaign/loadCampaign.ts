import { nostojs } from "@nosto/nosto-js"
import type { NostoCampaign } from "./NostoCampaign"

export async function loadCampaign(element: NostoCampaign) {
  const api = await new Promise(nostojs)
  const request = api
    .createRecommendationRequest({ includeTagging: true })
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

  await request.load()
}
