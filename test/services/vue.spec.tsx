import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { compile } from "../../src/services/vue"
import { createElement } from "../utils/jsx"

describe("vue:compile", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it("should remove element if v-if condition is false", () => {
    container.append(<div id="test" v-if="false"></div>)
    const el = container.querySelector("#test") as HTMLElement
    compile(el, {})
    expect(document.getElementById("test")).toBeNull()
  })

  it("should keep element if v-if condition is true and remove the v-if attribute", () => {
    container.append(<div id="test" v-if="true"></div>)
    const el = container.querySelector("#test") as HTMLElement
    compile(el, {})
    const processedEl = document.getElementById("test")
    expect(processedEl).not.toBeNull()
    expect(processedEl?.hasAttribute("v-if")).toBe(false)
  })

  it("should handle v-else correctly", () => {
    container.append(<div id="test1" v-if="false"></div>, <div id="test2" v-else></div>)
    const el1 = container.querySelector("#test1") as HTMLElement
    const el2 = container.querySelector("#test2") as HTMLElement
    compile(el1, {})
    compile(el2, {})
    expect(document.getElementById("test1")).toBeNull()
    expect(document.getElementById("test2")).not.toBeNull()
  })

  it("should process v-for and clone element for each item in the list", () => {
    container.append(
      <ul id="list">
        <li v-for="item in items" v-text="item"></li>
      </ul>
    )
    const ul = container.querySelector("#list") as HTMLElement
    compile(ul, { items: ["a", "b", "c"] })
    const liElements = ul.querySelectorAll("li")
    expect(liElements.length).toBe(3)
    const texts = Array.from(liElements).map(li => li.textContent)
    expect(texts).toEqual(["a", "b", "c"])
  })

  it("should process v-bind and set the attribute accordingly", () => {
    container.append(<div id="test" v-bind:title="'Hello'"></div>)
    const el = container.querySelector("#test") as HTMLElement
    compile(el, {})
    expect(el.getAttribute("title")).toBe("Hello")
    expect(el.hasAttribute("v-bind:title")).toBe(false)
  })

  it("should support property binding syntax", () => {
    container.innerHTML = `<div .id="'test'"></div>`
    const el = container.querySelector("div") as HTMLElement
    compile(el, {})
    expect(el.id).toEqual("test")
    expect(el.hasAttribute(".id")).toBe(false)
  })

  it("should support v-bind shorthand with colon", () => {
    container.append(<div id="test" v-bind:title="'Hello'"></div>)
    const el = container.querySelector("#test") as HTMLElement
    compile(el, {})
    expect(el.getAttribute("title")).toBe("Hello")
    expect(el.hasAttribute(":title")).toBe(false)
  })

  it("should support v-bind object syntax", () => {
    container.append(<div id="test" v-bind="{ title: 'Hello', 'data-val': '123' }"></div>)
    const el = container.querySelector("#test") as HTMLElement
    compile(el, {})
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
    const el = container.querySelector("#test") as HTMLElement
    compile(el, {})
    const span = el.querySelector("span")
    const p = el.querySelector("p")
    expect(span?.textContent).toBe("nested")
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
