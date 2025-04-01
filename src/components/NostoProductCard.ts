import { customElement } from "./decorators"
import { NostoProduct } from "./NostoProduct"
import { evaluate } from "@/services/templating"

@customElement("nosto-product-card")
export class NostoProductCard extends HTMLElement {
  static attributes = {
    recoId: String,
    template: String,
    wrap: Boolean
  }

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
    if (!this.recoId) {
      throw new Error("Slot ID is required.")
    }
    if (!this.template) {
      throw new Error("Template is required.")
    }
  }

  private async render() {
    this.toggleAttribute("loading", true)
    const product = this.getData()
    const html = await evaluate(this.template, { product, data: this.dataset })

    if (this.wrap) {
      const wrapper = new NostoProduct()
      wrapper.recoId = this.recoId
      wrapper.productId = product.id
      wrapper.innerHTML = html
      this.appendChild(wrapper)
    } else {
      this.insertAdjacentHTML("beforeend", html)
    }
    this.toggleAttribute("loading", false)
  }

  private getData() {
    const data = this.querySelector("script[product-data]")
    return data ? JSON.parse(data.textContent!) : {}
  }
}
