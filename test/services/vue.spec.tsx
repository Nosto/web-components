import { describe, it, expect, beforeEach } from "vitest"
import { compile } from "../../src/services/vue"
import { createElement } from "../utils/jsx"

describe("vue:compile", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
  })

  it("should handle n-html correctly", () => {
    container.append(<div id="test" n-html="text"></div>)
    compile(container, { text: "<b>test</b>" })
    expect(container.querySelector("#test")?.innerHTML).toEqual("<b>test</b>")
  })

  it("should support style binding", () => {
    container.append(<div id="test" n-bind:style="{ color: 'red' }"></div>)
    compile(container, {})
    const el = container.querySelector("#test") as HTMLElement
    expect(el.style.color).toBe("red")
    expect(el.hasAttribute("n-bind:style")).toBe(false)
  })

  it("should remove element if n-if condition is false", () => {
    container.append(<div id="test" n-if="false"></div>)
    compile(container, {})
    expect(container.querySelector("#test")).toBeNull()
  })

  it("should keep element if n-if condition is true and remove the n-if attribute", () => {
    container.append(<div id="test" n-if="true"></div>)
    compile(container, {})
    const processedEl = container.querySelector("#test")
    expect(processedEl).not.toBeNull()
    expect(processedEl?.hasAttribute("n-if")).toBe(false)
  })

  it("should handle n-else-if correctly", () => {
    container.append(<div id="test1" n-if="num <= 2"></div>, <div id="test2" n-else-if="num > 2"></div>)
    compile(container, { num: 3 })
    expect(container.querySelector("#test1")).toBeNull()
    expect(container.querySelector("#test2")).not.toBeNull()
  })

  it("should handle n-else-if correctly 2", () => {
    container.append(
      <div id="test1" n-if="num === 1"></div>,
      <div id="test2" n-else-if="num === 2"></div>,
      <div id="test3" n-else></div>
    )
    compile(container, { num: 3 })
    expect(container.querySelector("#test1")).toBeNull()
    expect(container.querySelector("#test2")).toBeNull()
    expect(container.querySelector("#test3")).not.toBeNull()
  })

  it("should handle n-else correctly", () => {
    container.append(<div id="test1" n-if="false"></div>, <div id="test2" n-else></div>)
    compile(container, {})
    expect(container.querySelector("#test1")).toBeNull()
    expect(container.querySelector("#test2")).not.toBeNull()
  })

  it("should process n-for and clone element for each item in the list", () => {
    container.append(
      <ul id="list">
        <li n-for="item in items" n-text="item"></li>
      </ul>
    )
    compile(container, { items: ["a", "b", "c"] })
    const liElements = container.querySelectorAll("li")
    expect(liElements.length).toBe(3)
    const texts = Array.from(liElements).map(li => li.textContent)
    expect(texts).toEqual(["a", "b", "c"])
  })

  it("should support n-for with index", () => {
    container.append(
      <ul id="list">
        <li n-for="(item, index) in items" n-text="`${index}: ${item}`"></li>
      </ul>
    )
    compile(container, { items: ["a", "b", "c"] })
    const liElements = container.querySelectorAll("li")
    expect(liElements.length).toBe(3)
    const texts = Array.from(liElements).map(li => li.textContent)
    expect(texts).toEqual(["0: a", "1: b", "2: c"])
  })

  it("should process n-bind and set the attribute accordingly", () => {
    container.append(<div id="test" n-bind:title="'Hello'"></div>)
    compile(container, { title: "Hello" })
    const el = container.querySelector("#test") as HTMLElement
    expect(el.getAttribute("title")).toBe("Hello")
    expect(el.hasAttribute("n-bind:title")).toBe(false)
  })

  it("should support property binding syntax", () => {
    container.innerHTML = `<div .id="'test'"></div>`
    compile(container, {})
    const el = container.querySelector("div") as HTMLElement
    expect(el.id).toEqual("test")
    expect(el.hasAttribute(".id")).toBe(false)
  })

  it("should support n-bind shorthand with colon", () => {
    container.append(<div id="test" n-bind:title="'Hello'"></div>)
    compile(container, {})
    const el = container.querySelector("#test") as HTMLElement
    expect(el.getAttribute("title")).toBe("Hello")
    expect(el.hasAttribute(":title")).toBe(false)
  })

  it("should support n-bind object syntax", () => {
    container.append(<div id="test" n-bind="{ title: 'Hello', 'data-val': '123' }"></div>)
    compile(container, {})
    const el = container.querySelector("#test") as HTMLElement
    expect(el.getAttribute("title")).toBe("Hello")
    expect(el.getAttribute("data-val")).toBe("123")
    expect(el.hasAttribute("n-bind")).toBe(false)
  })

  it("should process nested directives", () => {
    container.append(
      <div id="test" n-if="true">
        <span n-text="'nested'"></span>
        <p n-bind:data-val="'data'"></p>
      </div>
    )
    compile(container, {})
    const el = container.querySelector("#test") as HTMLElement
    const span = el.querySelector("span")
    const p = el.querySelector("p")
    expect(span?.textContent).toBe("nested")
    expect(p?.getAttribute("data-val")).toBe("data")
  })

  it("should support mustache interpolation in text elements", () => {
    container.append(
      <div id="test" n-if="true">
        <span>{"{{hello}}"}</span>
        <p n-bind:data-val="'data'"></p>
      </div>
    )

    compile(container, { hello: "world" })
    const el = container.querySelector("#test") as HTMLElement
    const span = el.querySelector("span")
    const p = el.querySelector("p")
    expect(span?.textContent).toBe("world")
    expect(p?.getAttribute("data-val")).toBe("data")
  })

  it("should support nosto-dynamic-card rendering", () => {
    container.innerHTML = `
      <dynamic-product-card 
        class='ns-product w-full flex' 
        :handle='product.handle' 
        template='product-card' 
        n-for="product in products">
        <div class='product-card-skeleton'></div>
      </dynamic-product-card>`

    compile(container, { products: [{ handle: "test-product1" }, { handle: "test-product2" }] })
    expect(container.outerHTML).toContain("test-product1")
    expect(container.outerHTML).toContain("test-product2")
  })
})
