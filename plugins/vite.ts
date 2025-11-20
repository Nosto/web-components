import esbuild from "esbuild"
import type { Plugin } from "vite"

/**
 * Vite plugin that loads CSS files as minified text strings
 * Uses esbuild's built-in CSS minifier for optimal compression
 */
export function cssPlugin(): Plugin {
  return {
    name: "vite-css-loader",
    async transform(code, id) {
      if (!id.endsWith(".css")) {
        return null
      }

      // Minify CSS using esbuild's transform API
      const result = await esbuild.transform(code, {
        loader: "css",
        minify: true
      })

      return {
        code: `export default ${JSON.stringify(result.code)}`,
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
