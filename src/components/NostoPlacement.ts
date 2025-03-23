import { EventResponseMessage } from "@nosto/nosto-js/client"
import { customElement } from "./decorators"
import { nostojs } from "@nosto/nosto-js"

const liquidJs = "https://cdn.jsdelivr.net/npm/liquidjs@latest/dist/liquid.browser.esm.js"

@customElement("nosto-placement")
export class NostoPlacement extends HTMLElement {
  static attributes = {
    template: String
  }
  template: string | undefined

  constructor() {
    super()
    this.classList.add("nosto_element")
  }

  connectedCallback() {
    if (!this.id) {
      throw new Error("NostoPlacement must have an id attribute")
    }
    // TODO how to set the response mode?
    register(this.id, this)
  }

  disconnectedCallback() {
    unregister(this.id)
  }

  renderResult(result: unknown) {
    const template = this.getTemplate()
    this.render(template, result)
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

const placements = new Map<string, NostoPlacement>()
let listenerRegistered = false

function handleResults(result: EventResponseMessage) {
  Object.entries(result.recommendations).forEach(([placementId, result]) => {
    placements.get(placementId)?.renderResult(result)
  })
}

function register(id: string, placement: NostoPlacement) {
  placements.set(id, placement)
  if (!listenerRegistered) {
    nostojs(api => api.listen("taggingsent", handleResults))
    listenerRegistered = true
  }
}

function unregister(id: string) {
  placements.delete(id)
}
