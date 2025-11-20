import type { Plugin } from "vite"

/**
 * Vite plugin that loads CSS files as minified text strings
 * Removes whitespace and comments to reduce bundle size
 */
export function cssPlugin(): Plugin {
  return {
    name: "vite-css-loader",
    transform(code, id) {
      if (!id.endsWith(".css")) {
        return null
      }

      // Minify CSS by removing comments and unnecessary whitespace
      const minified = code
        .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
        .replace(/\s+/g, " ") // Collapse multiple spaces
        .replace(/\s*([{}:;,])\s*/g, "$1") // Remove spaces around CSS syntax
        .replace(/;\}/g, "}") // Remove last semicolon before closing brace
        .trim()

      return {
        code: `export default ${JSON.stringify(minified)}`,
        map: null
      }
    }
  }
}

/**
 * Vite plugin that loads GraphQL files as minified text strings
 * Removes whitespace and comments to reduce bundle size
 */
export function graphqlPlugin(): Plugin {
  return {
    name: "vite-graphql-loader",
    transform(code, id) {
      if (!id.endsWith(".graphql")) {
        return null
      }

      // Minify GraphQL by removing comments and unnecessary whitespace
      const minified = code
        .replace(/#[^\n]*/g, "") // Remove comments
        .replace(/\s+/g, " ") // Collapse multiple spaces
        .replace(/\s*([{}():,@])\s*/g, "$1") // Remove spaces around GraphQL syntax
        .trim()

      return {
        code: `export default ${JSON.stringify(minified)}`,
        map: null
      }
    }
  }
}
