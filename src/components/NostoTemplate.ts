import { customElement } from "./decorators"

const liquidJs = "https://cdn.jsdelivr.net/npm/liquidjs@latest/dist/liquid.browser.esm.js"
const handlebarsJs = "https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.esm.js"

@customElement("nosto-template")
export class NostoTemplate extends HTMLElement {
  static attributes = {
    language: String,
    template: String
  }

  language!: "liquid" | "handlebars"
  template!: string

  constructor() {
    super()
  }

  connectedCallback() {
    switch (this.language) {
      case "liquid":
        return this.renderLiquid(this.getData(), this.getTemplate())
      case "handlebars":
        return this.renderHandlebars(this.getData(), this.getTemplate())
      default:
        throw new Error("Unsupported template language " + this.language)
    }
  }

  async renderHandlebars(data: object, templateString: string) {
    const Handlebars = window.Handlebars ?? (await import(handlebarsJs))
    const template = Handlebars.compile(templateString)
    const evaluated = template(data)
    const fragment = document.createRange().createContextualFragment(evaluated)
    this.appendChild(fragment)
  }

  async renderLiquid(data: object, templateString: string) {
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

  private getData() {
    const element = this.querySelector<HTMLScriptElement>("script[type='application/json']")
    if (!element) {
      throw new Error("No data element found.")
    }
    return JSON.parse(element.textContent!)
  }
}
