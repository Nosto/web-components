import { describe, it, expect, vi, beforeEach } from "vitest"
import { customElement, attribute } from "../../src/components/decorators"

describe("customElement", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.spyOn(window.customElements, "define")
  })

  it("should define a custom element if not already defined", () => {
    const tagName = "my-element"
    const constructor = class extends HTMLElement {}

    customElement(tagName)(constructor)

    expect(window.customElements.define).toHaveBeenCalledWith(tagName, constructor)
  })

  it("should not redefine a custom element if already defined", () => {
    const tagName = "my-element2"
    const constructor = class extends HTMLElement {}

    customElement(tagName)(constructor)
    expect(window.customElements.define).toHaveBeenCalledTimes(1)

    customElement(tagName)(constructor)
    expect(window.customElements.define).toHaveBeenCalledTimes(1)
  })
})

@customElement("example-element")
class Example extends HTMLElement {
  @attribute("name")
  accessor name!: string

  @attribute("disabled", Boolean)
  accessor disabled!: boolean
}

describe("attribute", () => {
  it("should map attributes to properties", () => {
    const example = new Example()
    example.setAttribute("name", "John")
    example.toggleAttribute("disabled", true)

    expect(example.name).toBe("John")
    expect(example.disabled).toBe(true)
  })
})
