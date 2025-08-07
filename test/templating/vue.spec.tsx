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

  it("should process v-bind and set the attribute accordingly", () => {
    container.append(<div id="test" v-bind:title="'Hello'"></div>)
    processElement(container, { title: "Hello" })
    const el = container.querySelector("#test") as HTMLElement
    expect(el.getAttribute("title")).toBe("Hello")
    expect(el.hasAttribute("v-bind:title")).toBe(false)
  })

  it("should support property binding syntax", () => {
    container.innerHTML = `<div .id="'test'"></div>`
    processElement(container, {})
    const el = container.querySelector("div") as HTMLElement
    expect(el.id).toEqual("test")
    expect(el.hasAttribute(".id")).toBe(false)
  })

  it("should support v-bind shorthand with colon", () => {
    container.append(<div id="test" v-bind:title="'Hello'"></div>)
    processElement(container, {})
    const el = container.querySelector("#test") as HTMLElement
    expect(el.getAttribute("title")).toBe("Hello")
    expect(el.hasAttribute(":title")).toBe(false)
  })

  it("should support v-bind object syntax", () => {
    container.append(<div id="test" v-bind="{ title: 'Hello', 'data-val': '123' }"></div>)
    processElement(container, {})
    const el = container.querySelector("#test") as HTMLElement
    expect(el.getAttribute("title")).toBe("Hello")
    expect(el.getAttribute("data-val")).toBe("123")
    expect(el.hasAttribute("v-bind")).toBe(false)
  })

  it("should skip null and undefined values in v-bind", () => {
    container.append(<div id="test" v-bind="{ title: null, 'data-val': undefined }"></div>)
    processElement(container, {})
    const el = container.querySelector("#test") as HTMLElement
    expect(el.hasAttribute("title")).toBe(false)
    expect(el.hasAttribute("data-val")).toBe(false)
    expect(el.hasAttribute("v-bind")).toBe(false)
  })

  it("should process nested directives", () => {
    container.append(
      <div id="test" v-if="true">
        <span v-text="'nested'"></span>
        <p v-bind:data-val="'data'"></p>
      </div>
    )
    processElement(container, {})
    const el = container.querySelector("#test") as HTMLElement
    const span = el.querySelector("span")
    const p = el.querySelector("p")
    expect(span?.textContent).toBe("nested")
    expect(p?.getAttribute("data-val")).toBe("data")
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

  it("should support v-on event binding with expressions", () => {
    container.append(
      <button id="test" v-on:click="handleClick($event, 1, 2)">
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

  it("should support nosto-dynamic-card rendering", () => {
    container.innerHTML = `
      <dynamic-product-card 
        class='ns-product w-full flex' 
        :handle='product.handle' 
        template='product-card' 
        v-for="product in products">
        <div class='product-card-skeleton'></div>
      </dynamic-product-card>`

    processElement(container, { products: [{ handle: "test-product1" }, { handle: "test-product2" }] })
    expect(container.outerHTML).toContain("test-product1")
    expect(container.outerHTML).toContain("test-product2")
  })

  it("should replace template elements with their content", () => {
    container.innerHTML = `
      <div>
        <template>
          <span>Template content</span>
          <p>Another element</p>
        </template>
      </div>`

    processElement(container, {})
    expect(container.querySelector("template")).toBeNull()
    expect(container.querySelector("span")?.textContent).toBe("Template content")
    expect(container.querySelector("p")?.textContent).toBe("Another element")
  })

  it("should handle template elements with Vue directives", () => {
    container.innerHTML = `
      <div>
        <template v-if="show">
          <span>Conditional content</span>
        </template>
      </div>`

    processElement(container, { show: true })
    expect(container.querySelector("template")).toBeNull()
    expect(container.querySelector("span")?.textContent).toBe("Conditional content")
  })

  it("should not render template elements when v-if is false", () => {
    container.innerHTML = `
      <div>
        <template v-if="show">
          <span>Conditional content</span>
        </template>
      </div>`

    processElement(container, { show: false })
    expect(container.querySelector("template")).toBeNull()
    expect(container.querySelector("span")).toBeNull()
  })

  it("should handle template elements with v-for", () => {
    container.innerHTML = `
      <div>
        <template v-for="item in items">
          <div class="item">{{item.name}}</div>
          <span class="desc">{{item.desc}}</span>
        </template>
      </div>`

    processElement(container, { 
      items: [
        { name: "Item 1", desc: "Description 1" }, 
        { name: "Item 2", desc: "Description 2" }
      ] 
    })
    
    expect(container.querySelector("template")).toBeNull()
    const itemDivs = container.querySelectorAll(".item")
    const descSpans = container.querySelectorAll(".desc")
    
    expect(itemDivs.length).toBe(2)
    expect(descSpans.length).toBe(2)
    expect(itemDivs[0].textContent).toBe("Item 1")
    expect(descSpans[0].textContent).toBe("Description 1")
    expect(itemDivs[1].textContent).toBe("Item 2")
    expect(descSpans[1].textContent).toBe("Description 2")
  })

  it("should handle nested template elements", () => {
    container.innerHTML = `
      <div>
        <template v-for="group in groups">
          <h3>{{group.title}}</h3>
          <template v-for="item in group.items">
            <span>{{item}}</span>
          </template>
        </template>
      </div>`

    processElement(container, { 
      groups: [
        { title: "Group 1", items: ["A", "B"] },
        { title: "Group 2", items: ["C"] }
      ]
    })
    
    expect(container.querySelector("template")).toBeNull()
    const headers = container.querySelectorAll("h3")
    const spans = container.querySelectorAll("span")
    
    expect(headers.length).toBe(2)
    expect(spans.length).toBe(3)
    expect(headers[0].textContent).toBe("Group 1")
    expect(headers[1].textContent).toBe("Group 2")
    expect(spans[0].textContent).toBe("A")
    expect(spans[1].textContent).toBe("B")
    expect(spans[2].textContent).toBe("C")
  })
})
