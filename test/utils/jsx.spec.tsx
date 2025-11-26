import { describe, it, expect, beforeAll } from "vitest"
import { createElement } from "./jsx"
import { property } from "@/components/decorators"

// Define a test custom element for property binding tests
class TestElement extends HTMLElement {
  @property(String) stringProp?: string | null
  @property(Boolean) booleanProp?: boolean
  @property(Number) numberProp?: number

  objectProp?: Record<string, unknown>
  arrayProp?: unknown[]

  constructor() {
    super()
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "test-element": TestElement
  }
}

describe("jsx", () => {
  beforeAll(() => {
    if (!customElements.get("test-element")) {
      customElements.define("test-element", TestElement)
    }
  })

  describe("createElement", () => {
    it("should create basic HTML element", () => {
      const div = <div />
      expect(div).toBeInstanceOf(HTMLDivElement)
    })

    it("should create custom element", () => {
      const element = <test-element />
      expect(element).toBeInstanceOf(TestElement)
    })

    it("should append children", () => {
      const div = (
        <div>
          <span>Child 1</span>
          <span>Child 2</span>
        </div>
      )
      expect(div.children.length).toBe(2)
      expect(div.children[0].tagName).toBe("SPAN")
      expect(div.children[1].tagName).toBe("SPAN")
    })

    it("should append text nodes", () => {
      const div = <div>Hello World</div>
      expect(div.textContent).toBe("Hello World")
    })
  })

  describe("property binding", () => {
    describe("boolean properties", () => {
      it("should set boolean property directly on element when true", () => {
        const element = (<test-element booleanProp={true} />) as TestElement
        expect(element.booleanProp).toBe(true)
        // Boolean properties use toggleAttribute, so check for attribute
        expect(element.hasAttribute("boolean-prop")).toBe(true)
      })

      it("should set boolean property directly on element when false", () => {
        const element = (<test-element booleanProp={false} />) as TestElement
        expect(element.booleanProp).toBe(false)
        expect(element.hasAttribute("boolean-prop")).toBe(false)
      })

      it("should set standard boolean attributes as properties", () => {
        const button = (<button disabled={true} />) as HTMLButtonElement
        expect(button.disabled).toBe(true)
        expect(button.hasAttribute("disabled")).toBe(true)
      })

      it("should handle false for standard boolean attributes", () => {
        const button = (<button disabled={false} />) as HTMLButtonElement
        expect(button.disabled).toBe(false)
        expect(button.hasAttribute("disabled")).toBe(false)
      })
    })

    describe("object properties", () => {
      it("should set object property directly on element", () => {
        const testObj = { key1: "value1", key2: 123 }
        const element = (<test-element objectProp={testObj} />) as TestElement
        expect(element.objectProp).toBe(testObj)
        expect(element.objectProp).toEqual({ key1: "value1", key2: 123 })
      })

      it("should handle nested objects", () => {
        const testObj = { nested: { deep: { value: "test" } } }
        const element = (<test-element objectProp={testObj} />) as TestElement
        expect(element.objectProp).toBe(testObj)
        expect(element.objectProp).toEqual({ nested: { deep: { value: "test" } } })
      })
    })

    describe("array properties", () => {
      it("should set array property directly on element", () => {
        const testArray = ["item1", "item2", "item3"]
        const element = (<test-element arrayProp={testArray} />) as TestElement
        expect(element.arrayProp).toBe(testArray)
        expect(element.arrayProp).toEqual(["item1", "item2", "item3"])
      })

      it("should handle array of objects", () => {
        const testArray = [{ id: 1 }, { id: 2 }]
        const element = (<test-element arrayProp={testArray} />) as TestElement
        expect(element.arrayProp).toBe(testArray)
        expect(element.arrayProp).toEqual([{ id: 1 }, { id: 2 }])
      })
    })

    describe("property existence check", () => {
      it("should set property when it exists on element prototype", () => {
        const element = (<test-element stringProp="test" />) as TestElement
        expect(element.stringProp).toBe("test")
      })

      it("should set as attribute for non-existent properties", () => {
        const element = (<test-element nonExistentProp="value" />) as TestElement
        expect(element.getAttribute("non-existent-prop")).toBe("value")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((element as any).nonExistentProp).toBeUndefined()
      })
    })
  })

  describe("attribute fallback", () => {
    it("should set string attributes when not a property", () => {
      const div = <div data-test="value" />
      expect(div.getAttribute("data-test")).toBe("value")
    })

    it("should handle kebab-case conversion for attributes", () => {
      const div = <div dataTestValue="value" />
      expect(div.getAttribute("data-test-value")).toBe("value")
    })

    it("should handle className alias", () => {
      const div = <div className="my-class" />
      expect(div.className).toBe("my-class")
      expect(div.getAttribute("class")).toBe("my-class")
    })

    it("should handle htmlFor alias", () => {
      const label = (<label htmlFor="input-id" />) as HTMLLabelElement
      expect(label.htmlFor).toBe("input-id")
      expect(label.getAttribute("for")).toBe("input-id")
    })
  })

  describe("style property", () => {
    it("should apply style object", () => {
      const div = <div style={{ color: "red", fontSize: "16px" }} />
      expect(div.style.color).toBe("red")
      expect(div.style.fontSize).toBe("16px")
    })
  })

  describe("event handlers", () => {
    it("should attach event listeners", () => {
      let clicked = false
      const button = <button onClick={() => (clicked = true)} />
      button.click()
      expect(clicked).toBe(true)
    })

    it("should handle multiple event types", () => {
      let mouseEntered = false
      let mouseLeft = false
      const div = <div onMouseenter={() => (mouseEntered = true)} onMouseleave={() => (mouseLeft = true)} />
      div.dispatchEvent(new MouseEvent("mouseenter"))
      div.dispatchEvent(new MouseEvent("mouseleave"))
      expect(mouseEntered).toBe(true)
      expect(mouseLeft).toBe(true)
    })
  })

  describe("mixed property and attribute scenarios", () => {
    it("should handle string property on custom element", () => {
      const element = (<test-element stringProp="test-value" />) as TestElement
      expect(element.stringProp).toBe("test-value")
    })

    it("should handle number property on custom element", () => {
      const element = (<test-element numberProp={42} />) as TestElement
      // Numbers are not boolean or object, and numberProp exists on element
      expect(element.numberProp).toBe(42)
    })

    it("should handle multiple properties at once", () => {
      const testObj = { test: "data" }
      const element = (<test-element stringProp="text" booleanProp={true} objectProp={testObj} />) as TestElement
      expect(element.stringProp).toBe("text")
      expect(element.booleanProp).toBe(true)
      expect(element.objectProp).toBe(testObj)
    })
  })

  describe("edge cases", () => {
    it("should handle null values", () => {
      const element = (<test-element objectProp={null} />) as TestElement
      // null is technically an object but should be handled as attribute
      expect(element.getAttribute("object-prop")).toBe("null")
    })

    it("should handle undefined values", () => {
      const element = (<test-element />) as TestElement
      // Properties backed by attributes return null when not set
      expect(element.stringProp).toBeNull()
      expect(element.objectProp).toBeUndefined()
      expect(element.arrayProp).toBeUndefined()
    })

    it("should handle empty object", () => {
      const element = (<test-element objectProp={{}} />) as TestElement
      expect(element.objectProp).toEqual({})
    })

    it("should handle empty array", () => {
      const element = (<test-element arrayProp={[]} />) as TestElement
      expect(element.arrayProp).toEqual([])
    })
  })
})
