import { describe, it, expect } from "vitest"
import { html, el, type TemplateExpression } from "@/templating/html"

describe("html templating function", () => {
  it("returns a TemplateExpression object with html property", () => {
    const result = html`<div>Hello World</div>`
    expect(result).toHaveProperty("html")
    expect(typeof result.html).toBe("string")
    expect(result.html).toBe("<div>Hello World</div>")
  })

  it("handles simple string interpolation with HTML escaping", () => {
    const result = html`<h1>Hello ${"<script>alert('xss')</script>"}!</h1>`
    expect(result.html).toBe("<h1>Hello &lt;script&gt;alert(&#039;xss&#039;)&lt;/script&gt;!</h1>")
  })

  it("escapes dangerous HTML characters in strings", () => {
    const result = html`<div>${`<>&"'`}</div>`
    expect(result.html).toBe("<div>&lt;&gt;&amp;&quot;&#039;</div>")
  })

  it("handles primitive value expressions", () => {
    const result = html`<div>${undefined} ${null} ${42} ${true} ${false}</div>`
    expect(result.html).toBe("<div>  42 true false</div>")
  })

  it("flattens and joins array contents", () => {
    const items = ["apple", "banana", "cherry"]
    const result = html`<ul>
      ${items}
    </ul>`
    expect(result.html).toBe("<ul>\n      applebananacherry\n    </ul>")
  })

  it("processes array elements with HTML escaping", () => {
    const items = ["<b>apple</b>", "<i>banana</i>"]
    const result = html`<ul>
      ${items}
    </ul>`
    expect(result.html).toBe("<ul>\n      &lt;b&gt;apple&lt;/b&gt;&lt;i&gt;banana&lt;/i&gt;\n    </ul>")
  })

  it("handles nested arrays", () => {
    const nested = [
      ["a", "b"],
      ["c", "d"]
    ]
    const result = html`<div>${nested}</div>`
    expect(result.html).toBe("<div>abcd</div>")
  })

  it("injects TemplateExpression objects as raw HTML", () => {
    const rawHtml: TemplateExpression = { html: "<em>emphasized</em>" }
    const result = html`<p>This is ${rawHtml} text</p>`
    expect(result.html).toBe("<p>This is <em>emphasized</em> text</p>")
  })

  it("handles arrays of TemplateExpression objects", () => {
    const items: TemplateExpression[] = [{ html: "<li>Item 1</li>" }, { html: "<li>Item 2</li>" }]
    const result = html`<ul>
      ${items}
    </ul>`
    expect(result.html).toBe("<ul>\n      <li>Item 1</li><li>Item 2</li>\n    </ul>")
  })

  it("handles mixed array of strings and TemplateExpression objects", () => {
    const mixed = ["plain text", { html: "<strong>bold</strong>" }, "more text"]
    const result = html`<div>${mixed}</div>`
    expect(result.html).toBe("<div>plain text<strong>bold</strong>more text</div>")
  })

  it("handles nested template expressions", () => {
    const inner = html`<span>nested</span>`
    const result = html`<div>Outer ${inner} content</div>`
    expect(result.html).toBe("<div>Outer <span>nested</span> content</div>")
  })

  it("handles complex example with arrays of template expressions", () => {
    const items = ["apple", "banana", "cherry"]
    const listItems = items.map(item => html`<li>${item}</li>`)
    const result = html`<ul>
      ${listItems}
    </ul>`
    expect(result.html).toBe("<ul>\n      <li>apple</li><li>banana</li><li>cherry</li>\n    </ul>")
  })

  it("handles empty template", () => {
    const result = html``
    expect(result.html).toBe("")
  })

  it("handles template with only static content", () => {
    const result = html`<div class="static">Static content</div>`
    expect(result.html).toBe('<div class="static">Static content</div>')
  })

  it("preserves whitespace in template", () => {
    const result = html` <div>Hello ${"World"}!</div> `
    expect(result.html).toBe(" <div>Hello World!</div> ")
  })
})

describe("el function", () => {
  it("returns an HTMLElement", () => {
    const element = el`<div>Hello World</div>`
    expect(element).toBeInstanceOf(HTMLElement)
    expect(element.tagName).toBe("DIV")
    expect(element.textContent).toBe("Hello World")
  })

  it("handles string interpolation with HTML escaping", () => {
    const name = "<script>alert('xss')</script>"
    const element = el`<h1>Hello ${name}!</h1>`
    expect(element.tagName).toBe("H1")
    expect(element.textContent).toBe("Hello <script>alert('xss')</script>!")
    // Check that HTML is escaped but don't rely on specific quote escaping
    expect(element.innerHTML).toContain("&lt;script&gt;")
    expect(element.innerHTML).toContain("&lt;/script&gt;")
  })

  it("handles complex attributes and nested content", () => {
    const className = "btn-primary"
    const id = "my-button"
    const text = "Click me"
    const element = el`<button class="${className}" id="${id}">${text}</button>`
    expect(element.tagName).toBe("BUTTON")
    expect(element.getAttribute("class")).toBe("btn-primary")
    expect(element.getAttribute("id")).toBe("my-button")
    expect(element.textContent).toBe("Click me")
  })

  it("handles TemplateExpression objects as raw HTML", () => {
    const rawHtml: TemplateExpression = { html: "<em>emphasized</em>" }
    const element = el`<p>This is ${rawHtml} text</p>`
    expect(element.tagName).toBe("P")
    expect(element.innerHTML).toBe("This is <em>emphasized</em> text")
  })

  it("throws error when template contains no elements", () => {
    expect(() => el`Just plain text`).toThrow("el() template must contain at least one HTML element")
    expect(() => el``).toThrow("el() template must contain at least one HTML element")
  })

  it("throws error when template contains multiple root elements", () => {
    expect(() => el`<div>First</div><div>Second</div>`).toThrow(
      "el() template must contain exactly one root HTML element"
    )
  })

  it("handles nested elements correctly", () => {
    const element = el`<div class="container"><span>nested content</span></div>`
    expect(element.tagName).toBe("DIV")
    expect(element.getAttribute("class")).toBe("container")
    const span = element.querySelector("span")
    expect(span?.textContent).toBe("nested content")
  })

  it("handles arrays in expressions", () => {
    const items = ["apple", "banana", "cherry"]
    // Use html helper function to properly handle arrays
    const listItems = items.map(item => html`<li>${item}</li>`)
    const element = el`<ul>${listItems}</ul>`
    expect(element.tagName).toBe("UL")
    const lis = element.querySelectorAll("li")
    expect(lis.length).toBe(3)
    expect(Array.from(lis).map(li => li.textContent)).toEqual(["apple", "banana", "cherry"])
  })
})
