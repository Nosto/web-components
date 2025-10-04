import { describe, it, expect, beforeEach, vi } from "vitest"
import { processElement } from "@/templating/vue"
import { createElement } from "../utils/jsx"

describe("vue:compile", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
  })

  it("should handle v-html correctly", () => {
    container.append(<div id="test" v-html="text"></div>)
    processElement(container, { text: "<b>test</b>" })
    expect(container.querySelector("#test")?.innerHTML).toEqual("<b>test</b>")
  })

  it("should support style binding", () => {
    container.append(<div id="test" v-bind:style="{ color: 'red' }"></div>)
    processElement(container, {})
    const el = container.querySelector("#test") as HTMLElement
    expect(el.style.color).toBe("red")
    expect(el.hasAttribute("v-bind:style")).toBe(false)
  })

  it("should remove element if v-if condition is false", () => {
    container.append(<div id="test" v-if="false"></div>)
    processElement(container, {})
    expect(container.querySelector("#test")).toBeNull()
  })

  it("should keep element if v-if condition is true and remove the v-if attribute", () => {
    container.append(<div id="test" v-if="true"></div>)
    processElement(container, {})
    const processedEl = container.querySelector("#test")
    expect(processedEl).not.toBeNull()
    expect(processedEl?.hasAttribute("v-if")).toBe(false)
  })

  it("should handle v-else-if correctly", () => {
    container.append(<div id="test1" v-if="num <= 2"></div>, <div id="test2" v-else-if="num > 2"></div>)
    processElement(container, { num: 3 })
    expect(container.querySelector("#test1")).toBeNull()
    expect(container.querySelector("#test2")).not.toBeNull()
  })

  it("should handle v-else-if correctly 2", () => {
    container.append(
      <div id="test1" v-if="num === 1"></div>,
      <div id="test2" v-else-if="num === 2"></div>,
      <div id="test3" v-else></div>
    )
    processElement(container, { num: 3 })
    expect(container.querySelector("#test1")).toBeNull()
    expect(container.querySelector("#test2")).toBeNull()
    expect(container.querySelector("#test3")).not.toBeNull()
  })

  it("should handle v-else correctly", () => {
    container.append(<div id="test1" v-if="false"></div>, <div id="test2" v-else></div>)
    processElement(container, {})
    expect(container.querySelector("#test1")).toBeNull()
    expect(container.querySelector("#test2")).not.toBeNull()
  })

  it("should process v-for and clone element for each item in the list", () => {
    container.append(
      <ul id="list">
        <li v-for="item in items" v-text="item"></li>
      </ul>
    )
    processElement(container, { items: ["a", "b", "c"] })
    const liElements = container.querySelectorAll("li")
    expect(liElements.length).toBe(3)
    const texts = Array.from(liElements).map(li => li.textContent)
    expect(texts).toEqual(["a", "b", "c"])
  })

  it("should support v-for with index", () => {
    container.append(
      <ul id="list">
        <li v-for="(item, index) in items" v-text="`${index}: ${item}`"></li>
      </ul>
    )
    processElement(container, { items: ["a", "b", "c"] })
    const liElements = container.querySelectorAll("li")
    expect(liElements.length).toBe(3)
    const texts = Array.from(liElements).map(li => li.textContent)
    expect(texts).toEqual(["0: a", "1: b", "2: c"])
  })

  it("should handle v-else-if when previous sibling has vif flag", () => {
    container.append(
      <div>
        <span id="first" v-if="true" v-text="'if content'"></span>
        <span id="second" v-else-if="true" v-text="'else-if content'"></span>
        <span id="third" v-else v-text="'else content'"></span>
      </div>
    )
    processElement(container, {})

    // First should remain with vif flag, second should be removed due to vif flag, third should be removed due to vif flag
    expect(container.querySelector("#first")?.textContent).toBe("if content")
    expect(container.querySelector("#second")).toBeNull()
    expect(container.querySelector("#third")).toBeNull()
  })

  it("should process v-else-if when previous sibling doesn't have vif flag", () => {
    container.append(
      <div>
        <span id="first" v-if="true" v-text="'if content'"></span>
        <span id="second" v-else-if="true" v-text="'else-if content'"></span>
      </div>
    )
    processElement(container, {})

    expect(container.querySelector("#first")?.textContent).toBe("if content")
    expect(container.querySelector("#second")).toBeNull() // Should be removed due to vif flag
  })

  it("should handle v-on event handlers with method references", () => {
    const mockHandler = vi.fn()
    container.append(<button id="btn" v-on:click="handleClick"></button>)

    processElement(container, { handleClick: mockHandler })

    const button = container.querySelector("#btn") as HTMLButtonElement
    button.click()
    expect(mockHandler).toHaveBeenCalled()
  })

  it("should handle v-on event handlers with expressions", () => {
    let eventReceived: Event | null = null
    const mockHandler = vi.fn((e: Event) => {
      eventReceived = e
    })

    container.append(<button id="btn" v-on:click="handleEvent($event)"></button>)

    processElement(container, { handleEvent: mockHandler })

    const button = container.querySelector("#btn") as HTMLButtonElement
    button.click()

    expect(mockHandler).toHaveBeenCalled()
    expect(eventReceived).toBeInstanceOf(Event)
  })

  it("should handle property binding with dot notation", () => {
    const mockElement = document.createElement("input") as HTMLInputElement
    mockElement.id = "input"
    // Use a valid attribute name and set it manually since JSX/HTML won't accept invalid attribute names
    Object.defineProperty(mockElement, "attributes", {
      get() {
        return [{ name: ".value", value: "inputValue" }]
      }
    })
    // Mock setAttribute to avoid the InvalidCharacterError

    mockElement.setAttribute = vi.fn()
    // Mock getAttribute to return the dot attribute
    mockElement.getAttribute = vi.fn((name: string) => {
      if (name === ".value") return "inputValue"
      return null
    })
    // Mock hasAttribute
    mockElement.hasAttribute = vi.fn((name: string) => name === ".value")
    // Mock removeAttribute
    mockElement.removeAttribute = vi.fn()

    container.append(mockElement)

    processElement(container, { inputValue: "test value" })

    const input = container.querySelector("#input") as HTMLInputElement
    expect(input.value).toBe("test value")
  })

  it("should handle v-bind with object syntax", () => {
    container.append(<div id="test" v-bind="{ 'data-test': 'value', class: 'test-class' }"></div>)

    processElement(container, {})

    const el = container.querySelector("#test")
    expect(el?.getAttribute("data-test")).toBe("value")
    expect(el?.getAttribute("class")).toBe("test-class")
  })

  it("should remove non-element non-text child nodes", () => {
    const div = document.createElement("div")
    const comment = document.createComment("test comment")
    const text = document.createTextNode("keep this text")

    div.appendChild(comment)
    div.appendChild(text)
    container.appendChild(div)

    processElement(container, {})

    // Comment should be removed, text should remain
    expect(div.childNodes.length).toBe(1)
    expect(div.childNodes[0].nodeType).toBe(Node.TEXT_NODE)
  })

  it("should process v-bind and set the attribute accordingly", () => {
    container.append(<div id="test" v-bind:title="'Hello'"></div>)
    processElement(container, { title: "Hello" })
    const el = container.querySelector("#test") as HTMLElement
    expect(el.getAttribute("title")).toBe("Hello")
    expect(el.hasAttribute("v-bind:title")).toBe(false)
  })

  it("should support v-bind object syntax", () => {
    container.append(<div id="test" v-bind="{ title: 'Hello', 'data-val': '123' }"></div>)
    processElement(container, {})
    const el = container.querySelector("#test") as HTMLElement
    expect(el.getAttribute("title")).toBe("Hello")
    expect(el.getAttribute("data-val")).toBe("123")
    expect(el.hasAttribute("v-bind")).toBe(false)
  })

  it("should support v-on event binding", () => {
    container.append(
      <button id="test" v-on:click="handleClick">
        Click me
      </button>
    )
    const mockHandler = vi.fn()
    processElement(container, { handleClick: mockHandler })
    const button = container.querySelector("#test") as HTMLButtonElement
    button.click()
    expect(mockHandler).toHaveBeenCalled()
  })

  it("should support mustache interpolation in text elements", () => {
    container.append(
      <div id="test" v-if="true">
        <span>{"{{hello}}"}</span>
        <p v-bind:data-val="'data'"></p>
      </div>
    )

    processElement(container, { hello: "world" })
    const el = container.querySelector("#test") as HTMLElement
    const span = el.querySelector("span")
    const p = el.querySelector("p")
    expect(span?.textContent).toBe("world")
    expect(p?.getAttribute("data-val")).toBe("data")
  })
})
