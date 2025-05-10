import { assertRequired } from "@/utils"
import { customElement } from "./decorators"

@customElement("nosto-dynamic-card")
export class NostoDynamicCard extends HTMLElement {
  static attributes = {
    handle: String,
    template: String,
    variantId: String
  }

  handle!: string
  template!: string
  variantId!: string
  // TODO lazy mode to load the markup only when in viewport

  async connectedCallback() {
    assertRequired(this, "handle", "template")
    this.toggleAttribute("loading", true)
    this.innerHTML = await getMarkup(this)
    this.toggleAttribute("loading", false)
  }
}

async function getMarkup(element: NostoDynamicCard) {
  const params = new URLSearchParams()
  params.set("view", element.template)
  params.set("layout", "none")
  if (element.variantId) {
    params.set("variant", element.variantId)
  }
  const result = await fetch(`/products/${element.handle}?${params}`)
  if (!result.ok) {
    throw new Error("Failed to fetch product data")
  }
  const markup = await result.text()
  if (/<(body|html)/i.test(markup)) {
    throw new Error("Invalid markup for template " + element.template)
  }
  return markup
}
