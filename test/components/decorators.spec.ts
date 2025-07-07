import { describe, it, expect, vi, beforeEach } from "vitest"
import { customElement } from "../../src/components/decorators"

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

  it("should define properties for attributes", () => {
    const tagName = "my-element3"
    @customElement(tagName)
    class constructor extends HTMLElement {
      static attributes = {
        foo: String,
        bar: Boolean,
        baz: Number
      }

      foo!: string
      bar!: boolean
      baz!: number
    }

    const e = new constructor()
    e.foo = "hello"
    e.bar = true
    e.baz = 42

    expect(e.getAttribute("foo")).toBe("hello")
    expect(e.getAttribute("bar")).toBe("")
    expect(e.getAttribute("baz")).toBe("42")
  })
})
