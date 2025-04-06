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
    validate(this)
    return render(this)
  }
}

function validate(element: NostoProductCard) {
  if (!element.recoId) {
    throw new Error("Slot ID is required.")
  }
  if (!element.template) {
    throw new Error("Template is required.")
  }
}

async function render(element: NostoProductCard) {
  element.toggleAttribute("loading", true)
  const product = getData(element)
  const html = await evaluate(element.template, { product, data: element.dataset })

  if (element.wrap) {
    const wrapper = new NostoProduct()
    wrapper.recoId = element.recoId
    wrapper.productId = product.id
    wrapper.innerHTML = html
    element.appendChild(wrapper)
  } else {
    element.insertAdjacentHTML("beforeend", html)
  }
  element.toggleAttribute("loading", false)
}

function getData(element: HTMLElement) {
  const data = element.querySelector("script[product-data]")
  return data ? JSON.parse(data.textContent!) : {}
}
