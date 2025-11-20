import fs from "fs"
import esbuild from "esbuild"

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
