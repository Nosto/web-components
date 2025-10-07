import fs from "fs"

/**
 * Vite plugin to handle CSS?inline imports as text strings
 * This plugin allows importing CSS files with the ?inline suffix to get the CSS content as a string
 */
export function cssInlinePlugin() {
  return {
    name: "css-inline",
    resolveId(id, importer) {
      if (id.endsWith(".css?inline")) {
        // Resolve the actual CSS file path
        return this.resolve(id.replace("?inline", ""), importer).then(result => {
          return result ? result.id + "?inline" : null
        })
      }
    },
    load(id) {
      if (id.endsWith("?inline")) {
        const cssPath = id.replace("?inline", "")
        const css = fs.readFileSync(cssPath, "utf-8")
        return `export default ${JSON.stringify(css)}`
      }
    }
  }
}
