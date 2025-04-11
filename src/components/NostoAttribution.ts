import { customElement } from "./decorators"
import { nostojs } from "@nosto/nosto-js"

/**
 * Custom element for handling Nosto attribution functionality.
 * This component tracks and attributes various user interactions with products.
 *
 * @property {string} productId - The ID of the product being attributed
 * @property {string} [recoId] - The recommendation ID for attribution tracking
 * @property {string} [search] - The search context type, must be one of: "serp", "category", or "autocomplete"
 *
 * @example
 * ```html
 * <nosto-attribution product-id="123" reco-id="abc123">
 *   ...
 * </nosto-attribution>
 * ```
 *
 * @example
 * ```html
 * <nosto-attribution product-id="123" search="serp">
 *   ...
 * </nosto-attribution>
 * ```
 */
@customElement("nosto-attribution")
export class NostoAttribution extends HTMLElement {
  static attributes = {
    productId: String,
    recoId: String,
    search: String
  }

  productId!: string
  recoId!: string
  search!: "serp" | "category" | "autocomplete"

  connectedCallback() {
    validate(this)
    initAttribution(this)
  }
}

function initAttribution(element: NostoAttribution) {
  if (element.recoId) {
    // @ts-expect-error not yet available
    nostojs(api => api.attributeCampaignElement(element, { ref: element.recoId }))
  } else if (element.search) {
    element.addEventListener("click", () => {
      // TODO provide url as well
      nostojs(api => api.recordSearchClick(element.search, { productId: element.productId }))
    })
  }
}

function validate(element: NostoAttribution) {
  if (!element.productId) {
    throw new Error("Product ID is required.")
  }
  if (!element.recoId && !element.search) {
    throw new Error("Either recoId or search is required.")
  }
}
