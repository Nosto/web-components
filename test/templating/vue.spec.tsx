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

  describe("property binding", () => {
    it("should bind to native input value property instead of attribute", () => {
      container.innerHTML = `<input id="test" v-bind:value="inputValue" />`
      processElement(container, { inputValue: "test-value" })
      const input = container.querySelector("#test") as HTMLInputElement
      expect(input.value).toBe("test-value")
      expect(input.hasAttribute("v-bind:value")).toBe(false)
    })

    it("should bind to native checkbox checked property", () => {
      container.innerHTML = `<input type="checkbox" id="test" v-bind:checked="isChecked" />`
      processElement(container, { isChecked: true })
      const checkbox = container.querySelector("#test") as HTMLInputElement
      expect(checkbox.checked).toBe(true)
      expect(checkbox.hasAttribute("v-bind:checked")).toBe(false)
    })

    it("should bind to native button disabled property", () => {
      container.innerHTML = `<button id="test" v-bind:disabled="isDisabled">Click</button>`
      processElement(container, { isDisabled: true })
      const button = container.querySelector("#test") as HTMLButtonElement
      expect(button.disabled).toBe(true)
      expect(button.hasAttribute("v-bind:disabled")).toBe(false)
    })

    it("should bind to native textarea value property", () => {
      container.innerHTML = `<textarea id="test" v-bind:value="textValue"></textarea>`
      processElement(container, { textValue: "multi\nline\ntext" })
      const textarea = container.querySelector("#test") as HTMLTextAreaElement
      expect(textarea.value).toBe("multi\nline\ntext")
      expect(textarea.hasAttribute("v-bind:value")).toBe(false)
    })

    it("should bind to select element's value property", () => {
      container.innerHTML = `
        <select id="test" v-bind:value="selectedValue">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>`
      processElement(container, { selectedValue: "option2" })
      const select = container.querySelector("#test") as HTMLSelectElement
      expect(select.value).toBe("option2")
      expect(select.hasAttribute("v-bind:value")).toBe(false)
    })

    it("should fallback to attribute binding for non-existent properties", () => {
      container.innerHTML = `<div id="test" v-bind:data-custom="customAttr"></div>`
      processElement(container, { customAttr: "custom-value" })
      const div = container.querySelector("#test") as HTMLDivElement
      expect(div.getAttribute("data-custom")).toBe("custom-value")
      expect(div.hasAttribute("v-bind:data-custom")).toBe(false)
    })

    it("should bind boolean false to disabled property correctly", () => {
      container.innerHTML = `<button id="test" v-bind:disabled="isDisabled">Click</button>`
      processElement(container, { isDisabled: false })
      const button = container.querySelector("#test") as HTMLButtonElement
      expect(button.disabled).toBe(false)
      expect(button.hasAttribute("disabled")).toBe(false)
    })

    it("should bind numeric values to properties", () => {
      container.innerHTML = `<input type="number" id="test" v-bind:value="numValue" />`
      processElement(container, { numValue: 42 })
      const input = container.querySelector("#test") as HTMLInputElement
      expect(input.value).toBe("42")
      expect(input.hasAttribute("v-bind:value")).toBe(false)
    })

    it("should work with v-bind object syntax for properties", () => {
      container.innerHTML = `<input id="test" v-bind="{ value: 'obj-value', disabled: true }" />`
      processElement(container, {})
      const input = container.querySelector("#test") as HTMLInputElement
      expect(input.value).toBe("obj-value")
      expect(input.disabled).toBe(true)
      expect(input.hasAttribute("v-bind")).toBe(false)
    })

    it("should maintain style object binding behavior", () => {
      container.innerHTML = `<div id="test" v-bind:style="{ color: 'blue', fontSize: '20px' }"></div>`
      processElement(container, {})
      const div = container.querySelector("#test") as HTMLDivElement
      expect(div.style.color).toBe("blue")
      expect(div.style.fontSize).toBe("20px")
      expect(div.hasAttribute("v-bind:style")).toBe(false)
    })
  })
})
