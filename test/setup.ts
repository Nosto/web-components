import { beforeAll, beforeEach, vi } from "vitest"
import * as components from "@/main"

beforeAll(() => {
  Object.entries(components).forEach(([name, component]) => {
    const kebabCased = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
    if (!customElements.get(kebabCased)) {
      customElements.define(kebabCased, component)
    }
  })
})

beforeEach(() => {
  document.body.innerHTML = ""
  vi.resetAllMocks()
})
