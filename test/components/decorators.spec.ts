import { describe, it, expect, vi } from "vitest"
import { customElement } from "../../src/components/decorators"

describe("customElement", () => {
  it("should define a custom element if not already defined", () => {
    const tagName = "my-element"
    const constructor = class extends HTMLElement {}

    // Mock the customElements registry
    const defineSpy = vi.spyOn(window.customElements, "define")
    const getSpy = vi.spyOn(window.customElements, "get").mockReturnValue(undefined)

    customElement(tagName)(constructor)

    expect(getSpy).toHaveBeenCalledWith(tagName)
    expect(defineSpy).toHaveBeenCalledWith(tagName, constructor)

    // Restore the original implementation
    defineSpy.mockRestore()
    getSpy.mockRestore()
  })

  it("should not redefine a custom element if already defined", () => {
    const tagName = "my-element"
    const constructor = class extends HTMLElement {}

    // Mock the customElements registry
    const defineSpy = vi.spyOn(window.customElements, "define")
    const getSpy = vi.spyOn(window.customElements, "get").mockReturnValue(constructor)

    customElement(tagName)(constructor)

    expect(getSpy).toHaveBeenCalledWith(tagName)
    expect(defineSpy).not.toHaveBeenCalled()

    // Restore the original implementation
    defineSpy.mockRestore()
    getSpy.mockRestore()
  })
})
