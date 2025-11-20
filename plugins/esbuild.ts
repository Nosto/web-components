import fs from "fs"
import type { Plugin } from "esbuild"

/**
 * esbuild plugin that loads CSS files as minified text strings
 * Removes whitespace and comments to reduce bundle size
 */
export function cssPlugin(): Plugin {
  return {
    name: "css-loader",
    setup(build) {
      build.onLoad({ filter: /\.css$/ }, async args => {
        const css = await fs.promises.readFile(args.path, "utf8")

        // Minify CSS by removing comments and unnecessary whitespace
        const minified = css
          .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
          .replace(/\s+/g, " ") // Collapse multiple spaces
          .replace(/\s*([{}:;,])\s*/g, "$1") // Remove spaces around CSS syntax
          .replace(/;\}/g, "}") // Remove last semicolon before closing brace
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
 * esbuild plugin that loads GraphQL files as minified text strings
 * Removes whitespace and comments to reduce bundle size
 */
export function graphqlPlugin(): Plugin {
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
