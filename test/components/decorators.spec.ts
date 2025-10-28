import { describe, it, expect, vi, beforeEach } from "vitest"
import { customElement, attrString, attrBoolean, attrNumber, attrArray } from "../../src/components/decorators"

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
      static properties = {
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
      static properties = {
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

  it("should ignore non-array values in array attribute setter", () => {
    const tagName = "my-element5"
    @customElement(tagName)
    class constructor extends HTMLElement {
      static properties = {
        list: Array
      }

      list!: unknown[]
    }

    const e = new constructor()

    // Set initial array value
    e.list = [1, 2, 3]
    expect(e.getAttribute("list")).toBe("[1,2,3]")
    expect(e.list).toEqual([1, 2, 3])

    // Test that non-array values are ignored (attribute remains unchanged)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(e as any).list = "string value"
    expect(e.getAttribute("list")).toBe("[1,2,3]")
    expect(e.list).toEqual([1, 2, 3])

    // Test that null removes attribute
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(e as any).list = null
    expect(e.hasAttribute("list")).toBe(false)
    expect(e.list).toBeUndefined()
  })
})

describe("Property decorators", () => {
  it("should work with property decorators instead of static properties", () => {
    const tagName = "new-element1"
    @customElement(tagName)
    class NewElement extends HTMLElement {
      @attrString
      name!: string

      @attrBoolean  
      active!: boolean

      @attrNumber
      count!: number

      @attrArray
      items!: unknown[]
    }

    const e = new NewElement()

    // Test string attribute
    e.name = "test"
    expect(e.getAttribute("name")).toBe("test")
    
    // Test boolean attribute  
    e.active = true
    expect(e.getAttribute("active")).toBe("")
    expect(e.active).toBe(true)

    // Test number attribute
    e.count = 42
    expect(e.getAttribute("count")).toBe("42")
    expect(e.count).toBe(42)

    // Test array attribute
    e.items = [1, 2, 3]
    expect(e.getAttribute("items")).toBe("[1,2,3]")
    expect(e.items).toEqual([1, 2, 3])
  })

  it("should support kebab-case attribute names for property decorators", () => {
    const tagName = "new-element2"
    @customElement(tagName)
    class NewElement extends HTMLElement {
      @attrString
      myProperty!: string

      @attrBoolean
      isActive!: boolean
    }

    const e = new NewElement()

    // Test that camelCase properties map to kebab-case attributes
    e.myProperty = "test"
    expect(e.getAttribute("my-property")).toBe("test")
    
    e.isActive = true
    expect(e.getAttribute("is-active")).toBe("")
  })

  it("should support observe flag with property decorators", () => {
    const tagName = "new-element3"
    @customElement(tagName, { observe: true })
    class NewElement extends HTMLElement {
      @attrString
      name!: string

      @attrBoolean
      active!: boolean

      attributeChangedCallback() {
        // This would be called if observedAttributes is set correctly
      }
    }

    // Check that observedAttributes is set correctly
    expect(NewElement.observedAttributes).toEqual(['name', 'active'])
  })
})
