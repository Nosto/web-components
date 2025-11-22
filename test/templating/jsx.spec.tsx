import { describe, it, expect } from "vitest"
import { jsx, jsxs, Fragment, type TemplateExpression } from "@/templating/jsx/jsx-runtime"

describe("JSX runtime", () => {
  it("creates simple elements", () => {
    const result = jsx("div", { children: "Hello World" })
    expect(result).toHaveProperty("html")
    expect(result.html).toBe("<div>Hello World</div>")
  })

  it("creates elements with attributes", () => {
    const result = jsx("div", { class: "container", id: "main", children: "Content" })
    expect(result.html).toBe('<div class="container" id="main">Content</div>')
  })

  it("handles string children with HTML escaping", () => {
    const result = jsx("h1", { children: "<script>alert('xss')</script>" })
    expect(result.html).toBe("<h1>&lt;script&gt;alert(&#039;xss&#039;)&lt;/script&gt;</h1>")
  })

  it("escapes dangerous HTML characters in children", () => {
    const result = jsx("div", { children: `<>&"'` })
    expect(result.html).toBe("<div>&lt;&gt;&amp;&quot;&#039;</div>")
  })

  it("escapes attribute values", () => {
    const result = jsx("div", { title: '<script>alert("xss")</script>', children: "Content" })
    expect(result.html).toBe('<div title="&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;">Content</div>')
  })

  it("handles primitive value children", () => {
    const result1 = jsx("div", { children: undefined })
    expect(result1.html).toBe("<div></div>")

    const result2 = jsx("div", { children: null })
    expect(result2.html).toBe("<div></div>")

    const result3 = jsx("div", { children: 42 })
    expect(result3.html).toBe("<div>42</div>")

    const result4 = jsx("div", { children: true })
    expect(result4.html).toBe("<div>true</div>")

    const result5 = jsx("div", { children: false })
    expect(result5.html).toBe("<div></div>")
  })

  it("handles array children", () => {
    const items = ["apple", "banana", "cherry"]
    const result = jsx("ul", { children: items })
    expect(result.html).toBe("<ul>applebananacherry</ul>")
  })

  it("processes array elements with HTML escaping", () => {
    const items = ["<b>apple</b>", "<i>banana</i>"]
    const result = jsx("ul", { children: items })
    expect(result.html).toBe("<ul>&lt;b&gt;apple&lt;/b&gt;&lt;i&gt;banana&lt;/i&gt;</ul>")
  })

  it("handles nested arrays", () => {
    const nested = [
      ["a", "b"],
      ["c", "d"]
    ]
    const result = jsx("div", { children: nested })
    expect(result.html).toBe("<div>abcd</div>")
  })

  it("injects TemplateExpression objects as raw HTML", () => {
    const rawHtml: TemplateExpression = { html: "<em>emphasized</em>" }
    const result = jsx("p", { children: ["This is ", rawHtml, " text"] })
    expect(result.html).toBe("<p>This is <em>emphasized</em> text</p>")
  })

  it("handles arrays of TemplateExpression objects", () => {
    const items: TemplateExpression[] = [{ html: "<li>Item 1</li>" }, { html: "<li>Item 2</li>" }]
    const result = jsx("ul", { children: items })
    expect(result.html).toBe("<ul><li>Item 1</li><li>Item 2</li></ul>")
  })

  it("handles mixed array of strings and TemplateExpression objects", () => {
    const mixed = ["plain text", { html: "<strong>bold</strong>" }, "more text"]
    const result = jsx("div", { children: mixed })
    expect(result.html).toBe("<div>plain text<strong>bold</strong>more text</div>")
  })

  it("handles self-closing tags", () => {
    const result = jsx("img", { src: "test.jpg", alt: "Test" })
    expect(result.html).toBe('<img src="test.jpg" alt="Test" />')
  })

  it("handles boolean attributes", () => {
    const result1 = jsx("input", { disabled: true, type: "text" })
    expect(result1.html).toBe('<input disabled type="text" />')

    const result2 = jsx("input", { disabled: false, type: "text" })
    expect(result2.html).toBe('<input type="text" />')
  })

  it("handles null and undefined attributes", () => {
    const result = jsx("div", { title: null, "data-value": undefined, class: "test", children: "Content" })
    expect(result.html).toBe('<div class="test">Content</div>')
  })

  it("handles style objects", () => {
    const result = jsx("div", { style: { color: "red", "font-size": "14px" }, children: "Styled" })
    expect(result.html).toBe('<div style="color: red; font-size: 14px">Styled</div>')
  })

  it("handles Fragment component", () => {
    const result = Fragment({ children: ["Hello", " ", "World"] })
    expect(result.html).toBe("Hello World")
  })

  it("jsxs delegates to jsx", () => {
    const result = jsxs("div", { children: ["a", "b", "c"] })
    expect(result.html).toBe("<div>abc</div>")
  })

  it("handles empty children", () => {
    const result = jsx("div", null)
    expect(result.html).toBe("<div></div>")
  })

  it("handles nested elements with TemplateExpression", () => {
    const inner = jsx("span", { children: "nested" })
    const result = jsx("div", { children: ["Outer ", inner, " content"] })
    expect(result.html).toBe("<div>Outer <span>nested</span> content</div>")
  })

  it("handles complex nested structures", () => {
    const items = ["apple", "banana", "cherry"]
    const listItems = items.map(item => jsx("li", { children: item }))
    const result = jsx("ul", { children: listItems })
    expect(result.html).toBe("<ul><li>apple</li><li>banana</li><li>cherry</li></ul>")
  })
})
