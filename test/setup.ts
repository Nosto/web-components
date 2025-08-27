import { beforeAll, beforeEach, vi } from "vitest"
import * as components from "@/main"

beforeAll(() => {
  Object.entries(components).forEach(([name, component]) => {
    // Skip abstract classes like NostoBaseCampaign
    if (name === "NostoBaseCampaign") return

    const kebabCased = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
    if (!customElements.get(kebabCased)) {
      try {
        customElements.define(kebabCased, component as CustomElementConstructor)
      } catch (error) {
        // Skip if can't be defined (e.g., abstract classes)
        console.warn(`Could not define custom element ${kebabCased}:`, error)
      }
    }
  })
})

beforeEach(() => {
  document.body.innerHTML = ""
  vi.resetAllMocks()
})
