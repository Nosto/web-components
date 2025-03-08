import { describe, it, expect, vi } from "vitest"
import { customElement, withProperties } from "../../src/components/decorators"

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

describe("withProperties", () => {
  it("should define observedAttributes on the constructor", () => {
    const properties = { prop1: "attr1", prop2: "attr2" }
    const constructor = class extends HTMLElement {}

    withProperties(properties)(constructor)

    // @ts-expect-error added via decorator
    expect(constructor.observedAttributes).toEqual(["attr1", "attr2"])
  })

  it("should define getters for each property on the prototype", () => {
    const properties = { prop1: "attr1", prop2: "attr2" }
    const constructor = class extends HTMLElement {
      prop1!: string
      prop2!: string
    }

    customElement("my-element2")(constructor)
    withProperties(properties)(constructor)

    const instance = new constructor()
    instance.setAttribute("attr1", "value1")
    instance.setAttribute("attr2", "value2")

    expect(instance.prop1).toBe("value1")
    expect(instance.prop2).toBe("value2")
  })
})
