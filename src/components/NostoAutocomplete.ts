import { customElement } from "./decorators"
import { autocomplete } from "@nosto/autocomplete"

@customElement("nosto-autocomplete")
export class NostoAutocomplete extends HTMLElement {
  constructor() {
    super()
  }
  async connectedCallback() {
    // TODO: Handle templateElement
    // const templateElement = this.querySelector<HTMLTemplateElement>("template")

    if (!Object.keys(this.getConfigFromScript()).length) {
      throw new Error("NostoAutocomplete: Missing required config.")
    }

    const config = this.getConfigFromScript()
    return await autocomplete(config)
  }

  private getConfigFromScript() {
    const config = this.querySelector("script[autocomplete-config]")
    return config ? JSON.parse(config.textContent!) : {}
  }
}
