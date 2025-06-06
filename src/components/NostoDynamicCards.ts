import { assertRequired } from "@/utils"
import { customElement } from "./decorators"
import { nostojs } from "@nosto/nosto-js"
import { getMarkup } from "./NostoDynamicCard"
import { API } from "@nosto/nosto-js/client"

@customElement("nosto-dynamic-cards")
export class NostoDynamicCards extends HTMLElement {
  static attributes = {
    placement: String,
    template: String
  }

  placement!: string
  template!: string

  async connectedCallback() {
    assertRequired(this, "placement", "template")
    this.toggleAttribute("loading", true)
    const api = await new Promise(nostojs)
    // TODO await api.pageTaggingAsync()
    const campaignResult = await getResult(api, this.placement)
    if (campaignResult) {
      await renderResult(this, campaignResult, this.template)
      // TODO parameterless attribution hook
    } else {
      console.warn(`No recommendations found for placement "${this.placement}"`)
    }
    this.toggleAttribute("loading", false)
  }
}

async function getResult(api: API, placement: string) {
  const result = await api
    .createRecommendationRequest({ includeTagging: true })
    .disableCampaignInjection()
    .setElements([placement])
    .setResponseMode("JSON_ORIGINAL")
    .load()
  return result.recommendations[placement] as JSONResult
}

async function renderResult(el: HTMLElement, result: JSONResult, template: string) {
  const handles = result.products.map(p => getHandle(p.url))
  const products = await Promise.all(handles.map(handle => getMarkup({ handle, template })))
  const fragment = document.createRange().createContextualFragment(products.join(""))
  if (el.querySelector("template")) {
    const template = el.querySelector<HTMLTemplateElement>("template")!
    const content = template.content.cloneNode(true) as HTMLElement
    // TODO add support for a product card template to wrap the products
    content.querySelector("slot[name='heading']")?.replaceWith(result.title)
    content.querySelector("slot[name='products']")?.replaceWith(fragment)
    template.replaceWith(content)
  } else {
    el.appendChild(fragment)
  }
}

function getHandle(url: string) {
  const match = url.match(/\/products\/([^/]+)/)
  return match ? match[1] : ""
}

// TODO get this from nostos types instead of duplicating
type JSONResult = {
  result_id: string
  title: string
  products: {
    url: string
  }[]
}
