import { describe, it, expect, vi } from "vitest"
import { NostoAutocomplete } from "@/main"
import { AutocompleteConfig } from "@nosto/autocomplete"
import type { DefaultState } from "@nosto/autocomplete"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createElement } from "../utils/jsx"

describe("NostoAutocomplete", () => {
  const config = {
    inputSelector: "#search",
    dropdownSelector: "#dropdown",
    render: vi.fn(),
    fetch: vi.fn()
  }

  it("should be defined as a custom element", () => {
    expect(customElements.get("nosto-autocomplete")).toBe(NostoAutocomplete)
  })

  it("should throw error on missing config script", async () => {
    const element = new NostoAutocomplete()
    await expect(element.connectedCallback()).rejects.toThrow(/Missing required config/)
  })

  it("should throw error on invalid JSON in config script", async () => {
    const element = autocompleteExample({} as AutocompleteConfig<DefaultState>)
    element.querySelector("script")!.textContent = "invalid JSON"
    await expect(element.connectedCallback()).rejects.toThrow(/Unexpected token/)
  })

  it("should initialize autocomplete with valid config", async () => {
    const element = autocompleteExample(config)
    await element.connectedCallback()
    expect(element.querySelector(".ns-autocomplete")).toBeDefined()
  })
})

function autocompleteExample(config: AutocompleteConfig<DefaultState>) {
  return (
    <nosto-autocomplete>
      <form>
        <input type="text" ns-input placeholder="search" />
        <button type="submit" id="search-button">
          Search
        </button>
        <div ns-results className="ns-autocomplete"></div>
      </form>
      <script autocomplete-config>{JSON.stringify(config)}</script>
    </nosto-autocomplete>
  ) as NostoAutocomplete
}
