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
        baz: Number,
        qux: Array
      }

      foo!: string
      bar!: boolean
      baz!: number
      qux!: number[]
    }

    const e = new constructor()
    e.foo = "hello"
    e.bar = true
    e.baz = 42
    e.qux = [1, 2, 3]

    expect(e.getAttribute("foo")).toBe("hello")
    expect(e.getAttribute("bar")).toBe("")
    expect(e.getAttribute("baz")).toBe("42")
    expect(e.getAttribute("qux")).toBe("[1,2,3]")
  })

  it("should handle array attributes correctly", () => {
    const tagName = "my-element4"
    @customElement(tagName)
    class constructor extends HTMLElement {
      static attributes = {
        numbers: Array
      }

      numbers!: number[]
    }

    const e = new constructor()

    // Test setting array value
    e.numbers = [100, 200, 300]
    expect(e.getAttribute("numbers")).toBe("[100,200,300]")
    expect(e.numbers).toEqual([100, 200, 300])

    // Test setting attribute directly with valid JSON
    e.setAttribute("numbers", "[400, 500, 600]")
    expect(e.numbers).toEqual([400, 500, 600])

    // Test setting invalid JSON should return undefined
    e.setAttribute("numbers", "invalid json")
    expect(e.numbers).toBeUndefined()

    // Test empty string should return undefined
    e.setAttribute("numbers", "")
    expect(e.numbers).toBeUndefined()

    // Test non-array JSON value should return undefined
    e.setAttribute("numbers", '"not an array"')
    expect(e.numbers).toBeUndefined()
    e.setAttribute("numbers", "42")
    expect(e.numbers).toBeUndefined()
    e.setAttribute("numbers", '{"key": "value"}')
    expect(e.numbers).toBeUndefined()

    // Test removing attribute
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(e as any).numbers = undefined
    expect(e.hasAttribute("numbers")).toBe(false)
  })
})
