import { describe, it, expect } from "vitest"
import { provide, inject } from "../../src/components/inject"

describe("inject", () => {
  const createElement = () => document.createElement("div")

  it("returns a value provided on the same element", () => {
    const element = createElement()
    const key = Symbol("value")
    const value = { foo: "bar" }
    provide(element, key, value)
    expect(inject<typeof value>(element, key)).toBe(value)
  })

  it("resolves a value from the closest ancestor", () => {
    const parent = createElement()
    const child = createElement()
    parent.appendChild(child)

    const key = Symbol("parent-value")
    const value = "from-parent"

    provide(parent, key, value)

    expect(inject<string>(child, key)).toBe(value)
  })

  it("returns undefined when no value is provided for the key", () => {
    const element = createElement()
    const key = Symbol("missing")

    expect(inject(element, key)).toBeUndefined()
  })

  it("provide across shadow DOM boundaries", () => {
    const host = createElement()
    const shadow = host.attachShadow({ mode: "open" })
    const child = createElement()
    shadow.appendChild(child)
    const key = Symbol("shadow-value")
    const value = [1, 2, 3]
    provide(host, key, value)

    expect(inject<number[]>(child, key)).toBe(value)
  })
})
