import { describe, it, expect } from "vitest"
import { provide, inject, unprovide } from "../../src/components/inject"

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

describe("unprovide", () => {
  const createElement = () => document.createElement("div")

  it("removes entire element mapping", () => {
    const element = createElement()
    const key1 = Symbol("value1")
    const key2 = Symbol("value2")
    const value1 = "test1"
    const value2 = "test2"

    provide(element, key1, value1)
    provide(element, key2, value2)

    expect(inject<string>(element, key1)).toBe(value1)
    expect(inject<string>(element, key2)).toBe(value2)

    unprovide(element)

    expect(inject<string>(element, key1)).toBeUndefined()
    expect(inject<string>(element, key2)).toBeUndefined()
  })

  it("handles calling unprovide on non-existent element", () => {
    const element = createElement()

    expect(() => unprovide(element)).not.toThrow()
  })

  it("does not affect parent values when unproviding child", () => {
    const parent = createElement()
    const child = createElement()
    parent.appendChild(child)

    const key = Symbol("value")
    const parentValue = "parent-value"
    const childValue = "child-value"

    provide(parent, key, parentValue)
    provide(child, key, childValue)

    expect(inject<string>(child, key)).toBe(childValue)

    unprovide(child)

    expect(inject<string>(child, key)).toBe(parentValue)
    expect(inject<string>(parent, key)).toBe(parentValue)
  })

  it("works across shadow DOM boundaries", () => {
    const host = createElement()
    const shadow = host.attachShadow({ mode: "open" })
    const child = createElement()
    shadow.appendChild(child)

    const key = Symbol("shadow-value")
    const value = "shadow-test"

    provide(host, key, value)
    expect(inject<string>(child, key)).toBe(value)

    unprovide(host)
    expect(inject<string>(child, key)).toBeUndefined()
  })
})
