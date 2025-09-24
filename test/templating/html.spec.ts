import { describe, it, expect } from "vitest"
import { html, type TemplateExpression } from "@/templating/html"

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

  it("handles undefined expressions", () => {
    const result = html`<div>${undefined}</div>`
    expect(result.html).toBe("<div></div>")
  })

  it("handles number expressions", () => {
    const result = html`<div>${42}</div>`
    expect(result.html).toBe("<div>42</div>")
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

  it("handles objects that are not TemplateExpression", () => {
    const obj = { name: "test", value: 123 }
    // @ts-expect-error Testing non-TemplateExpression object
    const result = html`<div>${obj}</div>`
    expect(result.html).toBe("<div>[object Object]</div>")
  })
})
