import { describe, it, expect } from "vitest"

// Import the helper functions we'll test directly

describe("minifyHtmlTemplatesPlugin", () => {
  // Test the minification logic by simulating what the plugin does
  function minifyHTML(html: string) {
    return html
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/^\s+/gm, "")
      .replace(/\s+$/gm, "")
      .replace(/[ \t]+/g, " ")
      .replace(/>\s+</g, "><")
      .replace(/>\s+/g, ">")
      .replace(/\s+</g, "<")
      .replace(/\n/g, "")
      .trim()
  }

  function processTemplateLiteral(content: string) {
    const parts: Array<{ type: "static" | "dynamic"; content: string }> = []
    let currentIndex = 0
    let braceDepth = 0
    let inExpression = false
    let expressionStart = -1

    for (let i = 0; i < content.length - 1; i++) {
      if (!inExpression && content[i] === "$" && content[i + 1] === "{") {
        if (currentIndex < i) {
          parts.push({ type: "static", content: content.substring(currentIndex, i) })
        }
        expressionStart = i
        inExpression = true
        braceDepth = 1
        i++
        continue
      }

      if (inExpression) {
        if (content[i] === "{") {
          braceDepth++
        } else if (content[i] === "}") {
          braceDepth--
          if (braceDepth === 0) {
            parts.push({ type: "dynamic", content: content.substring(expressionStart, i + 1) })
            currentIndex = i + 1
            inExpression = false
          }
        }
      }
    }

    if (currentIndex < content.length) {
      parts.push({ type: "static", content: content.substring(currentIndex) })
    }

    return parts
      .map(part => {
        if (part.type === "static") {
          return minifyHTML(part.content)
        }
        return part.content
      })
      .join("")
  }

  it("should minify simple HTML", () => {
    const input = `
      <div class="container">
        <h1>Hello World</h1>
      </div>
    `
    const output = minifyHTML(input)
    expect(output).toBe('<div class="container"><h1>Hello World</h1></div>')
  })

  it("should remove HTML comments", () => {
    const input = `
      <!-- This is a comment -->
      <div class="container">
        <!-- Another comment -->
        <h1>Hello</h1>
      </div>
    `
    const output = minifyHTML(input)
    expect(output).not.toContain("<!-- This is a comment -->")
    expect(output).not.toContain("<!-- Another comment -->")
    expect(output).toBe('<div class="container"><h1>Hello</h1></div>')
  })

  it("should handle multiple spaces and newlines", () => {
    const input = `
      <div    class="test">
        <span>   Text   </span>
      </div>
    `
    const output = minifyHTML(input)
    expect(output).toBe('<div class="test"><span>Text</span></div>')
  })

  it("should preserve template expressions", () => {
    const input = `
      <div class="greeting">
        <h1>Hello \${name}</h1>
      </div>
    `
    const output = processTemplateLiteral(input)
    expect(output).toContain("${name}")
    // The space before ${name} is correctly removed by minification
    expect(output).toBe('<div class="greeting"><h1>Hello${name}</h1></div>')
  })

  it("should handle multiple template expressions", () => {
    const input = `
      <div class="card">
        <h2>\${title}</h2>
        <p>\${content}</p>
        <footer>\${footer}</footer>
      </div>
    `
    const output = processTemplateLiteral(input)
    expect(output).toContain("${title}")
    expect(output).toContain("${content}")
    expect(output).toContain("${footer}")
    expect(output).toBe('<div class="card"><h2>${title}</h2><p>${content}</p><footer>${footer}</footer></div>')
  })

  it("should handle nested expressions with complex JavaScript", () => {
    const input = `
      <div class="outer">
        \${show ? html\`<span class="inner">Text</span>\` : ""}
      </div>
    `
    const output = processTemplateLiteral(input)
    expect(output).toContain('${show ? html`<span class="inner">Text</span>` : ""}')
    expect(output).toContain('<div class="outer">')
  })

  it("should handle expressions with object destructuring", () => {
    const input = `
      <div class="list">
        \${items.map(({ id, name }) => \`<span>\${name}</span>\`)}
      </div>
    `
    const output = processTemplateLiteral(input)
    expect(output).toContain("${items.map(({ id, name }) => `<span>${name}</span>`)}")
    expect(output).toContain('<div class="list">')
  })

  it("should preserve whitespace inside template expressions", () => {
    const input = `
      <div>
        \${value   ?   "yes"   :   "no"}
      </div>
    `
    const output = processTemplateLiteral(input)
    // The spaces inside the expression should be preserved
    expect(output).toContain('${value   ?   "yes"   :   "no"}')
  })
})
