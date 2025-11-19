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

  it("morphs existing content when merging", () => {
    container.innerHTML = "<p>Existing</p>"
    mergeDom(container, "<p>New</p>")
    expect(container.children.length).toBe(1)
    expect(container.children[0].textContent).toBe("New")
  })

  it("removes existing content with empty HTML string", () => {
    container.innerHTML = "<p>Existing</p>"
    mergeDom(container, "")
    expect(container.innerHTML).toBe("")
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

  it("morphs content when called multiple times", () => {
    mergeDom(container, "<p>First</p>")
    expect(container.children[0].textContent).toBe("First")
    mergeDom(container, "<p>Second</p>")
    expect(container.children[0].textContent).toBe("Second")
    mergeDom(container, "<p>Third</p>")
    expect(container.children.length).toBe(1)
    expect(container.children[0].textContent).toBe("Third")
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

  it("updates attributes when morphing elements", () => {
    container.innerHTML = '<div class="old" data-id="1">Content</div>'
    const originalDiv = container.firstElementChild
    mergeDom(container, '<div class="new" data-id="2">Content</div>')
    const updatedDiv = container.firstElementChild
    // Same element instance is reused
    expect(updatedDiv).toBe(originalDiv)
    expect(updatedDiv?.className).toBe("new")
    expect(updatedDiv?.getAttribute("data-id")).toBe("2")
  })

  it("removes attributes that don't exist in new HTML", () => {
    container.innerHTML = '<div class="test" data-id="123" data-remove="me">Content</div>'
    mergeDom(container, '<div class="test" data-id="123">Content</div>')
    const div = container.firstElementChild
    expect(div?.className).toBe("test")
    expect(div?.getAttribute("data-id")).toBe("123")
    expect(div?.hasAttribute("data-remove")).toBe(false)
  })

  it("morphs text content without replacing element", () => {
    container.innerHTML = "<p>Old text</p>"
    const originalP = container.firstElementChild
    mergeDom(container, "<p>New text</p>")
    const updatedP = container.firstElementChild
    expect(updatedP).toBe(originalP)
    expect(updatedP?.textContent).toBe("New text")
  })

  it("replaces element when tag name changes", () => {
    container.innerHTML = "<p>Content</p>"
    const originalP = container.firstElementChild
    mergeDom(container, "<div>Content</div>")
    const newDiv = container.firstElementChild
    expect(newDiv).not.toBe(originalP)
    expect(newDiv?.tagName).toBe("DIV")
  })

  it("morphs nested structures efficiently", () => {
    container.innerHTML = '<div id="wrapper"><p class="old">Text</p><span>Keep</span></div>'
    const originalWrapper = container.firstElementChild
    const originalSpan = container.querySelector("span")
    mergeDom(container, '<div id="wrapper"><p class="new">Updated</p><span>Keep</span></div>')
    const updatedWrapper = container.firstElementChild
    const updatedSpan = container.querySelector("span")
    // Wrapper and span are reused
    expect(updatedWrapper).toBe(originalWrapper)
    expect(updatedSpan).toBe(originalSpan)
    expect(container.querySelector("p")?.className).toBe("new")
    expect(container.querySelector("p")?.textContent).toBe("Updated")
  })

  it("adds new children when target has fewer children", () => {
    container.innerHTML = "<p>First</p>"
    mergeDom(container, "<p>First</p><span>Second</span><div>Third</div>")
    expect(container.children.length).toBe(3)
    expect(container.children[1].tagName).toBe("SPAN")
    expect(container.children[2].tagName).toBe("DIV")
  })

  it("removes extra children when new HTML has fewer children", () => {
    container.innerHTML = "<p>First</p><span>Second</span><div>Third</div>"
    mergeDom(container, "<p>Only one</p>")
    expect(container.children.length).toBe(1)
    expect(container.children[0].textContent).toBe("Only one")
  })
})
