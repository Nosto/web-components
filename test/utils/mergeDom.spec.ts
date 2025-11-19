import { describe, it, expect, beforeEach } from "vitest"
import { mergeDom } from "@/utils/mergeDom"

describe("mergeDom", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
  })

  it("merges simple HTML string into element", () => {
    mergeDom(container, "<p>Hello World</p>")
    expect(container.innerHTML).toBe("<p>Hello World</p>")
  })

  it("merges multiple elements", () => {
    mergeDom(container, "<p>First</p><span>Second</span>")
    expect(container.children.length).toBe(2)
    expect(container.children[0].tagName).toBe("P")
    expect(container.children[0].textContent).toBe("First")
    expect(container.children[1].tagName).toBe("SPAN")
    expect(container.children[1].textContent).toBe("Second")
  })

  it("merges nested HTML structures", () => {
    mergeDom(container, "<div><p>Nested <span>content</span></p></div>")
    expect(container.querySelector("div p span")?.textContent).toBe("content")
  })

  it("preserves existing content when merging", () => {
    container.innerHTML = "<p>Existing</p>"
    mergeDom(container, "<p>New</p>")
    expect(container.children.length).toBe(2)
    expect(container.children[0].textContent).toBe("Existing")
    expect(container.children[1].textContent).toBe("New")
  })

  it("handles empty HTML string", () => {
    container.innerHTML = "<p>Existing</p>"
    mergeDom(container, "")
    expect(container.innerHTML).toBe("<p>Existing</p>")
  })

  it("handles text nodes", () => {
    mergeDom(container, "Plain text content")
    expect(container.textContent).toBe("Plain text content")
  })

  it("handles mixed text and element nodes", () => {
    mergeDom(container, "Text before <strong>bold</strong> text after")
    expect(container.childNodes.length).toBe(3)
    expect(container.textContent).toBe("Text before bold text after")
  })

  it("handles HTML with attributes", () => {
    mergeDom(container, '<div class="test" data-id="123">Content</div>')
    const div = container.querySelector("div")
    expect(div?.className).toBe("test")
    expect(div?.getAttribute("data-id")).toBe("123")
    expect(div?.textContent).toBe("Content")
  })

  it("handles self-closing tags", () => {
    mergeDom(container, '<img src="test.jpg" alt="Test"><br>')
    expect(container.children.length).toBe(2)
    expect(container.children[0].tagName).toBe("IMG")
    expect(container.children[1].tagName).toBe("BR")
  })

  it("handles HTML entities", () => {
    mergeDom(container, "<p>&lt;Hello&gt; &amp; &quot;World&quot;</p>")
    expect(container.textContent).toBe('<Hello> & "World"')
  })

  it("handles complex nested structures with attributes", () => {
    const html = `
      <article class="card">
        <header>
          <h2>Title</h2>
        </header>
        <div class="content">
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
        </div>
      </article>
    `
    mergeDom(container, html)
    expect(container.querySelector("article.card")).toBeTruthy()
    expect(container.querySelectorAll("p").length).toBe(2)
  })

  it("can be called multiple times to merge more content", () => {
    mergeDom(container, "<p>First</p>")
    mergeDom(container, "<p>Second</p>")
    mergeDom(container, "<p>Third</p>")
    expect(container.children.length).toBe(3)
    expect(container.children[0].textContent).toBe("First")
    expect(container.children[1].textContent).toBe("Second")
    expect(container.children[2].textContent).toBe("Third")
  })

  it("handles whitespace-only strings", () => {
    mergeDom(container, "   \n   \t   ")
    expect(container.textContent?.trim()).toBe("")
  })

  it("handles HTML comments", () => {
    mergeDom(container, "<!-- Comment --><p>Content</p>")
    expect(container.children.length).toBe(1)
    expect(container.children[0].textContent).toBe("Content")
  })

  it("handles malformed HTML gracefully", () => {
    mergeDom(container, "<p>Unclosed paragraph")
    expect(container.querySelector("p")?.textContent).toBe("Unclosed paragraph")
  })
})
