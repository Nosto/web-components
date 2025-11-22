import { describe, it, expect, beforeEach, vi } from "vitest"
import { shadowContentFactory } from "@/utils/shadowContentFactory"

describe("shadowContentFactory", () => {
  let element: HTMLElement
  let shadowRoot: ShadowRoot

  beforeEach(() => {
    element = document.createElement("div")
    shadowRoot = element.attachShadow({ mode: "open" })

    // Mock CSSStyleSheet.replace since jsdom doesn't support it
    if (typeof CSSStyleSheet !== "undefined" && !CSSStyleSheet.prototype.replace) {
      CSSStyleSheet.prototype.replace = vi.fn().mockResolvedValue(undefined)
    }

    // Ensure adoptedStyleSheets is available (modern browser behavior)
    if (!("adoptedStyleSheets" in shadowRoot)) {
      Object.defineProperty(shadowRoot, "adoptedStyleSheets", {
        value: [],
        writable: true,
        configurable: true
      })
    }
  })

  describe("with adoptedStyleSheets support", () => {
    it("should use adoptedStyleSheets when supported", async () => {
      const styles = "body { color: red; }"
      const content = document.createElement("p")
      content.textContent = "Test content"

      const setShadowContent = shadowContentFactory(styles)
      await setShadowContent(element, content)

      expect(shadowRoot.adoptedStyleSheets).toHaveLength(1)
      expect(shadowRoot.innerHTML).toBe("<p>Test content</p>")
    })

    it("should cache the stylesheet across multiple invocations", async () => {
      const styles = "body { color: blue; }"
      const content1 = document.createElement("p")
      content1.textContent = "First content"
      const content2 = document.createElement("p")
      content2.textContent = "Second content"

      const setShadowContent = shadowContentFactory(styles)

      // First call
      await setShadowContent(element, content1)
      const firstStyleSheet = shadowRoot.adoptedStyleSheets[0]
      expect(shadowRoot.innerHTML).toBe("<p>First content</p>")

      // Second call with same factory
      await setShadowContent(element, content2)
      const secondStyleSheet = shadowRoot.adoptedStyleSheets[0]
      expect(shadowRoot.innerHTML).toBe("<p>Second content</p>")

      // Should reuse the same stylesheet object
      expect(firstStyleSheet).toBe(secondStyleSheet)
    })

    it("should handle different styles for different factories", async () => {
      const styles1 = "body { color: red; }"
      const styles2 = "body { color: green; }"
      const content = document.createElement("p")
      content.textContent = "Content"

      const setShadowContent1 = shadowContentFactory(styles1)
      const setShadowContent2 = shadowContentFactory(styles2)

      await setShadowContent1(element, content.cloneNode(true) as HTMLElement)
      const firstStyleSheet = shadowRoot.adoptedStyleSheets[0]

      // Create a second element for the second factory
      const element2 = document.createElement("div")
      const shadowRoot2 = element2.attachShadow({ mode: "open" })

      // Mock adoptedStyleSheets for the second shadow root too
      Object.defineProperty(shadowRoot2, "adoptedStyleSheets", {
        value: [],
        writable: true,
        configurable: true
      })

      await setShadowContent2(element2, content.cloneNode(true) as HTMLElement)
      const secondStyleSheet = shadowRoot2.adoptedStyleSheets[0]

      // Should be different stylesheet objects
      expect(firstStyleSheet).not.toBe(secondStyleSheet)
    })

    it("should replace existing content on subsequent calls", async () => {
      const styles = "body { color: orange; }"
      const setShadowContent = shadowContentFactory(styles)

      const content1 = document.createElement("p")
      content1.textContent = "Original"
      await setShadowContent(element, content1)
      expect(shadowRoot.innerHTML).toBe("<p>Original</p>")

      const content2 = document.createElement("p")
      content2.textContent = "Updated"
      await setShadowContent(element, content2)
      expect(shadowRoot.innerHTML).toBe("<p>Updated</p>")
    })
  })

  describe("without adoptedStyleSheets support", () => {
    beforeEach(() => {
      // Create new element and remove adoptedStyleSheets to simulate legacy browser
      element = document.createElement("div")
      shadowRoot = element.attachShadow({ mode: "open" })

      // Delete the adoptedStyleSheets property to simulate legacy browser
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (shadowRoot as any).adoptedStyleSheets
    })

    it("should inline styles when adoptedStyleSheets not supported", async () => {
      const styles = "body { color: purple; }"
      const content = document.createElement("p")
      content.textContent = "Legacy content"

      const setShadowContent = shadowContentFactory(styles)
      await setShadowContent(element, content)

      expect(shadowRoot.innerHTML).toContain("<style>")
      expect(shadowRoot.innerHTML).toContain(styles)
      expect(shadowRoot.innerHTML).toContain("Legacy content")
    })

    it("should format inline styles correctly", async () => {
      const styles = ".class { margin: 10px; }"
      const content = document.createElement("div")
      content.className = "class"
      content.textContent = "Text"

      const setShadowContent = shadowContentFactory(styles)
      await setShadowContent(element, content)

      expect(shadowRoot.innerHTML).toContain("<style>")
      expect(shadowRoot.innerHTML).toContain(styles)
      expect(shadowRoot.innerHTML).toContain('class="class"')
      expect(shadowRoot.innerHTML).toContain("Text")
    })

    it("should replace content on subsequent calls", async () => {
      const styles = "body { font-size: 14px; }"
      const setShadowContent = shadowContentFactory(styles)

      const content1 = document.createElement("p")
      content1.textContent = "First"
      await setShadowContent(element, content1)
      const firstHTML = shadowRoot.innerHTML

      const content2 = document.createElement("p")
      content2.textContent = "Second"
      await setShadowContent(element, content2)
      const secondHTML = shadowRoot.innerHTML

      expect(firstHTML).toContain("<p>First</p>")
      expect(secondHTML).toContain("<p>Second</p>")
      expect(secondHTML).not.toContain("<p>First</p>")
    })
  })
})
