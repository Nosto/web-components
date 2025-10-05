import { describe, it, expect, beforeEach, vi } from "vitest"
import { processElement } from "@/templating/vue"
import { el } from "@/templating/html"

describe("vue:compile", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
  })

  it("should handle v-html correctly", () => {
    container.append(el`<div id="test" v-html="text"></div>`)
    processElement(container, { text: "<b>test</b>" })
    expect(container.querySelector("#test")?.innerHTML).toEqual("<b>test</b>")
  })

  it("should support style binding", () => {
    container.append(el`<div id="test" v-bind:style="{ color: 'red' }"></div>`)
    processElement(container, {})
    const element = container.querySelector("#test") as HTMLElement
    expect(element.style.color).toBe("red")
    expect(element.hasAttribute("v-bind:style")).toBe(false)
  })

  it("should remove element if v-if condition is false", () => {
    container.append(el`<div id="test" v-if="false"></div>`)
    processElement(container, {})
    expect(container.querySelector("#test")).toBeNull()
  })

  it("should keep element if v-if condition is true and remove the v-if attribute", () => {
    container.append(el`<div id="test" v-if="true"></div>`)
    processElement(container, {})
    const processedEl = container.querySelector("#test")
    expect(processedEl).not.toBeNull()
    expect(processedEl?.hasAttribute("v-if")).toBe(false)
  })

  it("should handle v-else-if correctly", () => {
    container.append(
      el`<div id="test1" v-if="num <= 2"></div>`,
      el`<div id="test2" v-else-if="num > 2"></div>`
    )
    processElement(container, { num: 3 })
    expect(container.querySelector("#test1")).toBeNull()
    expect(container.querySelector("#test2")).not.toBeNull()
  })

  it("should handle v-else-if correctly 2", () => {
    container.append(
      el`<div id="test1" v-if="num === 1"></div>`,
      el`<div id="test2" v-else-if="num === 2"></div>`,
      el`<div id="test3" v-else></div>`
    )
    processElement(container, { num: 3 })
    expect(container.querySelector("#test1")).toBeNull()
    expect(container.querySelector("#test2")).toBeNull()
    expect(container.querySelector("#test3")).not.toBeNull()
  })

  it("should handle v-else correctly", () => {
    container.append(
      el`<div id="test1" v-if="false"></div>`,
      el`<div id="test2" v-else"></div>`
    )
    processElement(container, {})
    expect(container.querySelector("#test1")).toBeNull()
    expect(container.querySelector("#test2")).not.toBeNull()
  })

  it("should process v-for and clone element for each item in the list", () => {
    container.append(
      el`<ul id="list">
        <li v-for="item in items" v-text="item"></li>
      </ul>`
    )
    processElement(container, { items: ["a", "b", "c"] })
    const liElements = container.querySelectorAll("li")
    expect(liElements.length).toBe(3)
    const texts = Array.from(liElements).map(li => li.textContent)
    expect(texts).toEqual(["a", "b", "c"])
  })

  it("should support v-for with index", () => {
    container.append(
      el`<ul id="list">
        <li v-for="(item, index) in items" v-text="\`\${index}: \${item}\`"></li>
      </ul>`
    )
    processElement(container, { items: ["a", "b", "c"] })
    const liElements = container.querySelectorAll("li")
    expect(liElements.length).toBe(3)
    const texts = Array.from(liElements).map(li => li.textContent)
    expect(texts).toEqual(["0: a", "1: b", "2: c"])
  })

  it("should process v-bind and set the attribute accordingly", () => {
    container.append(el`<div id="test" v-bind:title="'Hello'"></div>`)
    processElement(container, { title: "Hello" })
    const element = container.querySelector("#test") as HTMLElement
    expect(element.getAttribute("title")).toBe("Hello")
    expect(element.hasAttribute("v-bind:title")).toBe(false)
  })

  it("should support property binding syntax", () => {
    container.innerHTML = `<div .id="'test'"></div>`
    processElement(container, {})
    const element = container.querySelector("div") as HTMLElement
    expect(element.id).toEqual("test")
    expect(element.hasAttribute(".id")).toBe(false)
  })

  it("should support v-bind shorthand with colon", () => {
    container.append(el`<div id="test" v-bind:title="'Hello'"></div>`)
    processElement(container, {})
    const element = container.querySelector("#test") as HTMLElement
    expect(element.getAttribute("title")).toBe("Hello")
    expect(element.hasAttribute(":title")).toBe(false)
  })

  it("should support v-bind object syntax", () => {
    container.append(el`<div id="test" v-bind="{ title: 'Hello', 'data-val': '123' }"></div>`)
    processElement(container, {})
    const element = container.querySelector("#test") as HTMLElement
    expect(element.getAttribute("title")).toBe("Hello")
    expect(element.getAttribute("data-val")).toBe("123")
    expect(element.hasAttribute("v-bind")).toBe(false)
  })

  it("should skip null and undefined values in v-bind", () => {
    container.append(el`<div id="test" v-bind="{ title: null, 'data-val': undefined }"></div>`)
    processElement(container, {})
    const element = container.querySelector("#test") as HTMLElement
    expect(element.hasAttribute("title")).toBe(false)
    expect(element.hasAttribute("data-val")).toBe(false)
    expect(element.hasAttribute("v-bind")).toBe(false)
  })

  it("should process nested directives", () => {
    container.append(
      el`<div id="test" v-if="true">
        <span v-text="'nested'"></span>
        <p v-bind:data-val="'data'"></p>
      </div>`
    )
    processElement(container, {})
    const element = container.querySelector("#test") as HTMLElement
    const span = element.querySelector("span")
    const p = element.querySelector("p")
    expect(span?.textContent).toBe("nested")
    expect(p?.getAttribute("data-val")).toBe("data")
  })

  it("should support v-on event binding", () => {
    container.append(
      el`<button id="test" v-on:click="handleClick">
        Click me
      </button>`
    )
    const mockHandler = vi.fn()
    processElement(container, { handleClick: mockHandler })
    const button = container.querySelector("#test") as HTMLButtonElement
    button.click()
    expect(mockHandler).toHaveBeenCalled()
  })

  it("should support v-on event binding with expressions", () => {
    container.append(
      el`<button id="test" v-on:click="handleClick($event, 1, 2)">
        Click me
      </button>`
    )
    const mockHandler = vi.fn()
    processElement(container, { handleClick: mockHandler })
    const button = container.querySelector("#test") as HTMLButtonElement
    button.click()
    expect(mockHandler).toHaveBeenCalled()
  })

  it("should support mustache interpolation in text elements", () => {
    container.append(
      el`<div id="test" v-if="true">
        <span>${"{{hello}}"}</span>
        <p v-bind:data-val="'data'"></p>
      </div>`
    )

    processElement(container, { hello: "world" })
    const element = container.querySelector("#test") as HTMLElement
    const span = element.querySelector("span")
    const p = element.querySelector("p")
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

  it("should replace nested templates with content", () => {
    container.innerHTML = `
      <div id="test">
        <template v-if="condition">
          <span>Nested Content</span>
        </template>
      </div>`

    processElement(container, { condition: true })
    const el = container.querySelector("#test")
    expect(el?.innerHTML.trim()).toEqual("<span>Nested Content</span>")
  })

  it("should render v-for on template elements correctly", () => {
    container.innerHTML = `
      <template v-for="item in items">
        <div class="item">{{ item }}</div>
      </template>`

    processElement(container, { items: ["Item 1", "Item 2", "Item 3"] })
    expect(container.innerHTML.trim().replace(/\s+/g, " ")).toEqual(
      `<div class="item">{{ item }}</div> <div class="item">{{ item }}</div> <div class="item">{{ item }}</div>`
    )
  })
})
