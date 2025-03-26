import { RenderMode } from "@nosto/nosto-js/client"
import { customElement } from "./decorators"
import { nostojs } from "@nosto/nosto-js"

const liquidJs = "https://cdn.jsdelivr.net/npm/liquidjs@latest/dist/liquid.browser.esm.js"

@customElement("nosto-placement")
export class NostoPlacement extends HTMLElement {
  static attributes = {
    responseMode: String,
    template: String
  }

  responseMode: RenderMode | undefined
  template: string | undefined

  constructor() {
    super()
  }

  connectedCallback() {
    if (!this.id) {
      throw new Error("NostoPlacement must have an id attribute")
    }
    this.fetchAndRender()
  }

  async fetchAndRender() {
    const api = await new Promise(nostojs)
    // TODO how to combine the requests for multiple placements?
    // TODO how to re-render on tagging context change?
    const result = await api
      .createRecommendationRequest({ includeTagging: true })
      .disableCampaignInjection()
      .setElements([this.id])
      .setResponseMode(this.responseMode ?? "JSON_ORIGINAL")
      .load()
    if (result.recommendations[this.id]) {
      if (this.responseMode === "HTML") {
        // TODO injection via client script?
        this.innerHTML = result.recommendations[this.id] as string
      } else {
        const template = this.getTemplate()
        this.render(template, result.recommendations[this.id])
      }
    } else {
      // TODO handle error
    }
  }

  async render(templateString: string, data: unknown) {
    const Liquid = window.Liquid ?? (await import(liquidJs))
    const engine = new Liquid.Liquid()
    const evaluated = await engine.parseAndRender(templateString, data)
    const fragment = document.createRange().createContextualFragment(evaluated)
    this.appendChild(fragment)
  }

  private getTemplate() {
    if (this.template) {
      return document.querySelector(this.template)!.innerHTML
    }
    return this.querySelector("template")!.innerHTML
  }
}
