/**
 * Vite plugin that loads CSS files as text strings
 */
export function cssPlugin() {
  return {
    name: "vite-css-loader",
    transform(code, id) {
      if (!id.endsWith(".css")) {
        return null
      }

      return {
        code: `export default ${JSON.stringify(code)}`,
        map: null
      }
    }
  }
}

/**
 * Vite plugin that loads GraphQL files as text strings
 */
export function graphqlPlugin() {
  return {
    name: "vite-graphql-loader",
    transform(code, id) {
      if (!id.endsWith(".graphql")) {
        return null
      }

      return {
        code: `export default ${JSON.stringify(code)}`,
        map: null
      }
    }
  }
}
