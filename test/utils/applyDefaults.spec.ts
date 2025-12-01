import { describe, it, expect, beforeAll, beforeEach } from "vitest"
import { applyDefaults } from "@/utils/applyDefaults"

describe("applyDefaults", () => {
  class TestElement extends HTMLElement {
    foo?: string
    barBaz?: number
    isActive?: boolean

    constructor() {
      super()
    }
  }

  beforeAll(() => {
    if (!customElements.get("test-element")) {
      customElements.define("test-element", TestElement)
    }
  })

  let element: TestElement

  beforeEach(() => {
    element = document.createElement("test-element") as TestElement
  })

  it("should apply defaults when attributes are not present", () => {
    applyDefaults(element, { foo: "test", barBaz: 42 })

    expect(element.foo).toBe("test")
    expect(element.barBaz).toBe(42)
  })

  it("should not override attributes that are already set in HTML", () => {
    element.setAttribute("foo", "existing")
    applyDefaults(element, { foo: "default" })

    // Since attribute exists, default should not be applied
    expect(element.foo).toBeUndefined()
    expect(element.hasAttribute("foo")).toBe(true)
  })

  it("should convert camelCase property names to kebab-case for attribute checks", () => {
    element.setAttribute("bar-baz", "42")
    applyDefaults(element, { barBaz: 99 })

    // Since bar-baz attribute exists, default should not be applied
    expect(element.barBaz).toBeUndefined()
  })

  it("should handle boolean properties", () => {
    applyDefaults(element, { isActive: true })

    expect(element.isActive).toBe(true)
  })

  it("should handle empty defaults object", () => {
    applyDefaults(element, {})

    expect(element.foo).toBeUndefined()
    expect(element.barBaz).toBeUndefined()
  })

  it("should apply multiple defaults at once", () => {
    applyDefaults(element, {
      foo: "test",
      barBaz: 42,
      isActive: true
    })

    expect(element.foo).toBe("test")
    expect(element.barBaz).toBe(42)
    expect(element.isActive).toBe(true)
  })
})
