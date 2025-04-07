import { customElement } from "./decorators"
import { NostoProduct } from "./NostoProduct"
import { evaluate } from "@/services/templating"
import { assertRequired } from "@/utils"

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

  connectedCallback() {
    assertRequired(this, "recoId", "template")
    return initProductCard(this)
  }
}

async function initProductCard(element: NostoProductCard) {
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
