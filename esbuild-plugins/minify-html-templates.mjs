import fs from "fs"
import path from "path"

/**
 * Minifies HTML content by removing unnecessary whitespace while preserving structure
 * @param {string} html - The HTML string to minify
 * @returns {string} - Minified HTML
 */
function minifyHTML(html) {
  return (
    html
      // Remove HTML comments
      .replace(/<!--[\s\S]*?-->/g, "")
      // Remove leading/trailing whitespace from each line
      .replace(/^\s+/gm, "")
      .replace(/\s+$/gm, "")
      // Replace multiple spaces/tabs with single space (but preserve newlines for now)
      .replace(/[ \t]+/g, " ")
      // Remove whitespace between tags
      .replace(/>\s+</g, "><")
      // Remove leading whitespace after >
      .replace(/>\s+/g, ">")
      // Remove trailing whitespace before <
      .replace(/\s+</g, "<")
      // Remove newlines
      .replace(/\n/g, "")
      // Remove whitespace at start and end
      .trim()
  )
}

/**
 * Processes template literal content to minify static HTML parts
 * @param {string} content - The template literal string with placeholders
 * @returns {string} - Processed content with minified static parts
 */
function processTemplateLiteral(content) {
  // Split by ${...} expressions to separate static and dynamic parts
  const parts = []
  let currentIndex = 0
  let braceDepth = 0
  let inExpression = false
  let expressionStart = -1

  let i = 0
  let inString = null // null, or one of "'", '"', '`'
  let stringEscape = false
  for (; i < content.length - 1; i++) {
    const char = content[i]
    const nextChar = content[i + 1]

    if (!inExpression && char === "$" && nextChar === "{") {
      if (currentIndex < i) {
        parts.push({ type: "static", content: content.substring(currentIndex, i) })
      }
      expressionStart = i
      inExpression = true
      braceDepth = 1
      i++ // Skip the '{'
      inString = null
      stringEscape = false
      continue
    }

    if (inExpression) {
      const c = char
      if (inString) {
        if (stringEscape) {
          stringEscape = false
        } else if (c === "\\") {
          stringEscape = true
        } else if (c === inString) {
          inString = null
        } else if (inString === "`" && c === "$" && nextChar === "{") {
          // Nested template literal expression
          // Do nothing, let braceDepth handle it
        }
      } else {
        if (c === "'" || c === '"' || c === "`") {
          inString = c
          stringEscape = false
        } else if (c === "{") {
          braceDepth++
        } else if (c === "}") {
          braceDepth--
          if (braceDepth === 0) {
            parts.push({ type: "dynamic", content: content.substring(expressionStart, i + 1) })
            currentIndex = i + 1
            inExpression = false
          }
        }
      }
    }
  }

  // Handle remaining static content
  if (currentIndex < content.length) {
    parts.push({ type: "static", content: content.substring(currentIndex) })
  }

  // Minify static parts and reconstruct
  return parts
    .map(part => {
      if (part.type === "static") {
        return minifyHTML(part.content)
      }
      return part.content
    })
    .join("")
}

/**
 * Finds html`` template literals and processes them
 * Uses a state machine to properly handle nested templates
 * @param {string} code - The source code
 * @returns {string} - Processed code with minified templates
 */
function processCode(code) {
  let result = ""
  let i = 0

  while (i < code.length) {
    // Look for 'html`' pattern
    if (
      code.substring(i, i + 5) === "html`" &&
      (i === 0 || !/[a-zA-Z0-9_$]/.test(code[i - 1])) // Not part of another identifier
    ) {
      result += "html`"
      i += 5

      // Extract and process the template literal
      const { content, endIndex } = extractTemplateLiteral(code, i)
      const minifiedContent = processTemplateLiteral(content)
      result += minifiedContent + "`"
      i = endIndex + 1
    } else {
      result += code[i]
      i++
    }
  }

  return result
}

/**
 * Extracts a template literal starting at the given index
 * Handles nested template expressions and backticks
 * @param {string} code - The source code
 * @param {number} startIndex - Starting position (after the opening backtick)
 * @returns {{content: string, endIndex: number}}
 */
function extractTemplateLiteral(code, startIndex) {
  let content = ""
  let i = startIndex
  let braceDepth = 0

  while (i < code.length) {
    const char = code[i]
    const nextChar = code[i + 1]

    // Handle escape sequences
    if (char === "\\") {
      content += char + (nextChar || "")
      i += 2
      continue
    }

    // Check for template expression start
    if (char === "$" && nextChar === "{" && braceDepth === 0) {
      braceDepth = 1
      content += char + nextChar
      i += 2
      continue
    }

    // Inside a template expression
    if (braceDepth > 0) {
      if (char === "{") {
        braceDepth++
      } else if (char === "}") {
        braceDepth--
      }
      content += char
      i++
      continue
    }

    // End of template literal
    if (char === "`" && braceDepth === 0) {
      return { content, endIndex: i }
    }

    content += char
    i++
  }

  // Should not reach here if code is valid
  return { content, endIndex: i }
}

/**
 * esbuild plugin to minify HTML template literals
 * @returns {import('esbuild').Plugin}
 */
export function minifyHtmlTemplatesPlugin() {
  return {
    name: "minify-html-templates",
    setup(build) {
      // Only process .ts files (not .tsx, .js, or .mjs)
      build.onLoad({ filter: /\.ts$/, namespace: "file" }, async args => {
        // Skip .d.ts files
        if (args.path.endsWith(".d.ts")) {
          return null
        }

        const source = await fs.promises.readFile(args.path, "utf8")

        // Only process files that contain html template literals
        if (!source.includes("html`")) {
          return null
        }

        const processedContents = processCode(source)

        return {
          contents: processedContents,
          loader: "ts"
        }
      })
    }
  }
}
