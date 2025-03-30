import { getSettings } from "@nosto/nosto-js"
import { customElement } from "./decorators"
import { NostoProduct } from "./NostoProduct"
import { evaluate } from "../services/templating"

@customElement("nosto-card")
export class NostoCard extends HTMLElement {
  static attributes = {
    handle: String,
    recoId: String,
    template: String,
    wrap: Boolean
  }

  handle!: string
  recoId!: string
  template!: string
  wrap!: boolean

  constructor() {
    super()
  }

  connectedCallback() {
    this.validate()
    return this.render()
  }

  private validate() {
    if (!this.handle) {
      throw new Error("Product handle is required.")
    }
    if (!this.recoId) {
      throw new Error("Slot ID is required.")
    }
    if (!this.template) {
      throw new Error("Template is required.")
    }
  }

  private async render() {
    // shopify start
    this.toggleAttribute("loading", true)
    const data = await fetch(`products/${this.handle}.json`)
    const product = (await data.json()).product
    const { parameterlessAttribution, nostoRefParam } = getSettings() ?? {}
    // TODO how to handle parameterless attribution
    if (!parameterlessAttribution) {
      product.url = `/products/${this.handle}?${nostoRefParam}=${this.recoId}`
    }
    // shopify end

    const html = await evaluate(this.template, product)

    if (this.wrap) {
      const wrapper = new NostoProduct()
      wrapper.recoId = this.recoId
      wrapper.productId = product.id
      wrapper.innerHTML = html
      this.appendChild(wrapper)
    } else {
      this.innerHTML = html
    }
    this.toggleAttribute("loading", false)
  }
}
