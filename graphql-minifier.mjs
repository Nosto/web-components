import fs from "fs"

/**
 * Minifies GraphQL content by removing extra whitespace
 * @param {string} content - The GraphQL file content
 * @returns {string} Minified GraphQL string
 */
export function minifyGraphQL(content) {
  return content.replace(/\s+/g, " ").trim()
}

/**
 * esbuild plugin for minifying GraphQL files
 * @returns {import('esbuild').Plugin}
 */
export function esbuildGraphQLPlugin() {
  return {
    name: "graphql-minifier",
    setup(build) {
      build.onLoad({ filter: /\.graphql$/ }, async args => {
        const contents = await fs.promises.readFile(args.path, "utf8")
        const minified = minifyGraphQL(contents)

        return {
          contents: `export default ${JSON.stringify(minified)}`,
          loader: "js"
        }
      })
    }
  }
}

/**
 * Vite plugin for minifying GraphQL files
 * @returns {import('vite').Plugin}
 */
export function viteGraphQLPlugin() {
  return {
    name: "vite-plugin-graphql",
    transform(src, id) {
      if (id.endsWith(".graphql")) {
        const minified = minifyGraphQL(src)
        return {
          code: `export default ${JSON.stringify(minified)}`,
          map: null
        }
      }
    }
  }
}
