import { nostojs } from "@nosto/nosto-js"
import { JSONResult } from "@nosto/nosto-js/client"

export class NostoRenderer extends HTMLElement {
  async connectedCallback() {
    const api = await new Promise(nostojs)
    const placement = this.getAttribute("placement")
    if (placement) {
      const results = await api
        .createRecommendationRequest({ includeTagging: true })
        .setElements([placement])
        .setResponseMode("JSON_ORIGINAL")
        .load()
      if (results.recommendations[placement]) {
        const rec = results.recommendations[placement]
        // TODO render results
        api.attributeProductClicksInCampaign(this, rec as JSONResult)
      }
    }
  }
}

if (!customElements.get("nosto-renderer")) {
  customElements.define("nosto-renderer", NostoRenderer)
}
