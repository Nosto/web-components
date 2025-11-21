import fs from "fs"
import esbuild from "esbuild"
import { minify } from "html-minifier-terser"

/**
 * esbuild plugin that loads CSS files as minified text strings
 * Uses esbuild's built-in CSS minifier for optimal compression
 */
export function cssPlugin() {
  return {
    name: "css-loader",
    setup(build) {
      build.onLoad({ filter: /\.css$/ }, async args => {
        const css = await fs.promises.readFile(args.path, "utf8")

        // Minify CSS using esbuild's transform API
        const result = await esbuild.transform(css, {
          loader: "css",
          minify: true
        })

        return {
          contents: `export default ${JSON.stringify(result.code)}`,
          loader: "js"
        }
      })
    }
  }
}

/**
 * esbuild plugin that loads GraphQL files as minified text strings
 * Removes whitespace and comments to reduce bundle size
 */
export function graphqlPlugin() {
  return {
    name: "graphql-loader",
    setup(build) {
      build.onLoad({ filter: /\.graphql$/ }, async args => {
        const graphql = await fs.promises.readFile(args.path, "utf8")

        // Minify GraphQL by removing comments and unnecessary whitespace
        const minified = graphql
          .replace(/#[^\n]*/g, "") // Remove comments
          .replace(/\s+/g, " ") // Collapse multiple spaces
          .replace(/\s*([{}():,@])\s*/g, "$1") // Remove spaces around GraphQL syntax
          .trim()

        return {
          contents: `export default ${JSON.stringify(minified)}`,
          loader: "js"
        }
      })
    }
  }
}

/**
 * esbuild plugin that minifies HTML in template literals
 * Processes html`` tagged template literals in TypeScript files
 * Only runs when minify is enabled in esbuild config
 */
export function htmlMinifierPlugin() {
  return {
    name: "html-minifier",
    setup(build) {
      // Process TypeScript files in components directory
      build.onLoad({ filter: /src\/components\/.*\.ts$/ }, async args => {
        const contents = await fs.promises.readFile(args.path, "utf8")

        // Skip files that don't use html template literals
        if (!contents.includes("html`")) {
          return null
        }
      build.onLoad({ filter: /[/\\]src[/\\]components[/\\].*\.ts$/ }, async args => {
        // Only minify when minification is enabled
        const shouldMinify = build.initialOptions.minify || build.initialOptions.minifyWhitespace
        if (!shouldMinify) {
          return null
        }

        try {
          const minifiedContents = await minifyHtmlTemplates(contents)
          return {
            contents: minifiedContents,
            loader: "ts"
          }
        } catch (error) {
          // Fall back to original content if minification fails
          console.warn(`Failed to minify HTML templates in ${args.path}:`, error.message)
          return null
        }
      })
    }
  }
}

/**
 * Minifies HTML content in template literals while preserving dynamic expressions
 */
async function minifyHtmlTemplates(contents) {
  const matches = []
  let searchIndex = 0

  // Find all html` template literals
  while (true) {
    const htmlIndex = contents.indexOf("html`", searchIndex)
    if (htmlIndex === -1) break

    const templateStart = htmlIndex + 5
    const templateEnd = findTemplateEnd(contents, templateStart)

    if (templateEnd !== -1) {
      matches.push({
        start: htmlIndex,
        end: templateEnd + 1,
        templateContent: contents.slice(templateStart, templateEnd)
      })
      searchIndex = templateEnd + 1
    } else {
      searchIndex = templateStart
    }
  }

  // Process matches in reverse order to maintain correct string positions
  let result = contents
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i]

    try {
      const minifiedTemplate = await minifyTemplateContent(match.templateContent)
      const replacement = `html\`${minifiedTemplate}\``
      result = result.slice(0, match.start) + replacement + result.slice(match.end)
    } catch (error) {
      console.warn(`Failed to minify template:`, error.message)
    }
  }

  return result
}

/**
 * Finds the end of a template literal, handling nested expressions and backticks
 */
function findTemplateEnd(contents, start) {
  let depth = 0
  let inExpression = false

  for (let i = start; i < contents.length; i++) {
    const char = contents[i]
    const nextChar = contents[i + 1]

    if (!inExpression) {
      if (char === "`") {
        return i
      }
      if (char === "$" && nextChar === "{") {
        inExpression = true
        depth = 1
        i++ // Skip the '{'
      }
    } else {
      if (char === "{") {
        depth++
      } else if (char === "}") {
        depth--
        if (depth === 0) {
          inExpression = false
        }
      }
    }
  }

  return -1
}

/**
 * Minifies template content by splitting into static and dynamic parts
 */
async function minifyTemplateContent(templateContent) {
  // Split template into static HTML parts and dynamic expressions
  const parts = []
  let currentPos = 0
  let depth = 0
  let inExpression = false
  let expressionStart = 0

  for (let i = 0; i < templateContent.length; i++) {
    if (!inExpression && templateContent[i] === "$" && templateContent[i + 1] === "{") {
      // Save static part before expression
      if (i > currentPos) {
        parts.push({ type: "static", content: templateContent.slice(currentPos, i) })
      }
      inExpression = true
      expressionStart = i
      depth = 1
      i++ // Skip the '{'
    } else if (inExpression) {
      if (templateContent[i] === "{") {
        depth++
      } else if (templateContent[i] === "}") {
        depth--
        if (depth === 0) {
          // Save expression
          parts.push({ type: "expression", content: templateContent.slice(expressionStart, i + 1) })
          inExpression = false
          currentPos = i + 1
        }
      }
    }
  }

  // Add remaining static content
  if (currentPos < templateContent.length) {
    parts.push({ type: "static", content: templateContent.slice(currentPos) })
  }

  // Minify static parts and reconstruct
  const minifiedParts = await Promise.all(
    parts.map(async part => {
      if (part.type === "expression") {
        return part.content
      }

      // Only minify if there's actual HTML content
      const trimmed = part.content.trim()
      if (!trimmed || !trimmed.includes("<")) {
        return part.content
      }

      try {
        const minified = await minify(part.content, {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeEmptyAttributes: true,
          minifyCSS: false, // Preserve CSS custom properties
          minifyJS: false, // Preserve JavaScript expressions
          keepClosingSlash: true,
          caseSensitive: true
        })
        return minified
      } catch (error) {
        // If minification fails for this part, return original
        return part.content
      }
    })
        // If minification fails for this part, log a warning and return original
        console.warn(`Failed to minify HTML part:`, error && error.message ? error.message : error, '\nContent:', part.content.slice(0, 200));

  return minifiedParts.join("")
}
