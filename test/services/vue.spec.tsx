import { describe, it, expect, beforeEach } from "vitest"
import { compile } from "../../src/services/vue"
import { createElement } from "../utils/jsx"

describe("vue:compile", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
  })

  it("should handle v-html correctly", () => {
    container.append(<div id="test" v-html="text"></div>)
    compile(container, { text: "<b>test</b>" })
    expect(container.querySelector("#test")?.innerHTML).toEqual("<b>test</b>")
  })

  it("should support style binding", () => {
    container.append(<div id="test" v-bind:style="{ color: 'red' }"></div>)
    compile(container, {})
    const el = container.querySelector("#test") as HTMLElement
    expect(el.style.color).toBe("red")
    expect(el.hasAttribute("v-bind:style")).toBe(false)
  })

  it("should remove element if v-if condition is false", () => {
    container.append(<div id="test" v-if="false"></div>)
    compile(container, {})
    expect(container.querySelector("#test")).toBeNull()
  })

  it("should keep element if v-if condition is true and remove the v-if attribute", () => {
    container.append(<div id="test" v-if="true"></div>)
    compile(container, {})
    const processedEl = container.querySelector("#test")
    expect(processedEl).not.toBeNull()
    expect(processedEl?.hasAttribute("v-if")).toBe(false)
  })

  it("should handle v-else-if correctly", () => {
    container.append(<div id="test1" v-if="num <= 2"></div>, <div id="test2" v-else-if="num > 2"></div>)
    compile(container, { num: 3 })
    expect(container.querySelector("#test1")).toBeNull()
    expect(container.querySelector("#test2")).not.toBeNull()
  })

  it("should handle v-else-if correctly 2", () => {
    container.append(
      <div id="test1" v-if="num === 1"></div>,
      <div id="test2" v-else-if="num === 2"></div>,
      <div id="test3" v-else></div>
    )
    compile(container, { num: 3 })
    expect(container.querySelector("#test1")).toBeNull()
    expect(container.querySelector("#test2")).toBeNull()
    expect(container.querySelector("#test3")).not.toBeNull()
  })

  it("should handle v-else correctly", () => {
    container.append(<div id="test1" v-if="false"></div>, <div id="test2" v-else></div>)
    compile(container, {})
    expect(container.querySelector("#test1")).toBeNull()
    expect(container.querySelector("#test2")).not.toBeNull()
  })

  it("should process v-for and clone element for each item in the list", () => {
    container.append(
      <ul id="list">
        <li v-for="item in items" v-text="item"></li>
      </ul>
    )
    compile(container, { items: ["a", "b", "c"] })
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
    compile(container, { items: ["a", "b", "c"] })
    const liElements = container.querySelectorAll("li")
    expect(liElements.length).toBe(3)
    const texts = Array.from(liElements).map(li => li.textContent)
    expect(texts).toEqual(["0: a", "1: b", "2: c"])
  })

  it("should process v-bind and set the attribute accordingly", () => {
    container.append(<div id="test" v-bind:title="'Hello'"></div>)
    compile(container, { title: "Hello" })
    const el = container.querySelector("#test") as HTMLElement
    expect(el.getAttribute("title")).toBe("Hello")
    expect(el.hasAttribute("v-bind:title")).toBe(false)
  })

  it("should support property binding syntax", () => {
    container.innerHTML = `<div .id="'test'"></div>`
    compile(container, {})
    const el = container.querySelector("div") as HTMLElement
    expect(el.id).toEqual("test")
    expect(el.hasAttribute(".id")).toBe(false)
  })

  it("should support v-bind shorthand with colon", () => {
    container.append(<div id="test" v-bind:title="'Hello'"></div>)
    compile(container, {})
    const el = container.querySelector("#test") as HTMLElement
    expect(el.getAttribute("title")).toBe("Hello")
    expect(el.hasAttribute(":title")).toBe(false)
  })

  it("should support v-bind object syntax", () => {
    container.append(<div id="test" v-bind="{ title: 'Hello', 'data-val': '123' }"></div>)
    compile(container, {})
    const el = container.querySelector("#test") as HTMLElement
    expect(el.getAttribute("title")).toBe("Hello")
    expect(el.getAttribute("data-val")).toBe("123")
    expect(el.hasAttribute("v-bind")).toBe(false)
  })

  it("should process nested directives", () => {
    container.append(
      <div id="test" v-if="true">
        <span v-text="'nested'"></span>
        <p v-bind:data-val="'data'"></p>
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
      <div id="test" v-if="true">
        <span>{"{{hello}}"}</span>
        <p v-bind:data-val="'data'"></p>
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
        v-for="product in products">
        <div class='product-card-skeleton'></div>
      </dynamic-product-card>`

    compile(container, { products: [{ handle: "test-product1" }, { handle: "test-product2" }] })
    expect(container.outerHTML).toContain("test-product1")
    expect(container.outerHTML).toContain("test-product2")
  })
})
