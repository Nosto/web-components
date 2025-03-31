import { customElement } from "./decorators"
import { NostoProduct } from "./NostoProduct"
import { evaluate } from "@/services/templating"
import { getData } from "@/services/products"

@customElement("nosto-product-card")
export class NostoProductCard extends HTMLElement {
  static attributes = {
    handle: String,
    recoId: String,
    data: String,
    template: String,
    wrap: Boolean
  }

  handle!: string
  recoId!: string
  data!: string
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
    if (!this.data && !this.handle) {
      throw new Error("Product data or handle is required.")
    }
    if (!this.recoId) {
      throw new Error("Slot ID is required.")
    }
    if (!this.template) {
      throw new Error("Template is required.")
    }
  }

  private async render() {
    this.toggleAttribute("loading", true)
    const product = this.data
      ? getJsonFromElement(this.data)
      : await getData({ handle: this.handle, recoId: this.recoId })
    const html = await evaluate(this.template, { product, dataset: this.dataset })

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

function getJsonFromElement(id: string) {
  const element = document.getElementById(id)
  if (!element) {
    throw new Error(`Element with id ${id} not found`)
  }
  return JSON.parse(element.textContent!)
}
