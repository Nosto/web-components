import fs from "fs"

/**
 * Vite plugin that loads CSS files as minified text strings
 * Removes whitespace and comments to reduce bundle size
 */
export function cssPlugin() {
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
