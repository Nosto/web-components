import { describe, it, expect } from "vitest"
import { provide, inject, unprovide } from "../../src/components/inject"

describe("inject", () => {
  const createElement = () => document.createElement("div")

  it("returns a value provided on the same element", () => {
    const testElement = createElement()
    const key = Symbol("value")
    const value = { foo: "bar" }
    provide(testElement, key, value)
    expect(inject<typeof value>(testElement, key)).toBe(value)
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
    const testElement = createElement()
    const key = Symbol("missing")

    expect(inject(testElement, key)).toBeUndefined()
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

describe("unprovide", () => {
  const createElement = () => document.createElement("div")

  it("removes entire element mapping", () => {
    const testElement = createElement()
    const key1 = Symbol("value1")
    const key2 = Symbol("value2")
    const value1 = "test1"
    const value2 = "test2"

    provide(testElement, key1, value1)
    provide(testElement, key2, value2)

    expect(inject<string>(testElement, key1)).toBe(value1)
    expect(inject<string>(testElement, key2)).toBe(value2)

    unprovide(testElement)

    expect(inject<string>(testElement, key1)).toBeUndefined()
    expect(inject<string>(testElement, key2)).toBeUndefined()
  })
})
