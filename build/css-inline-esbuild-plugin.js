import fs from "fs"
import path from "path"

/**
 * ESBuild plugin to handle CSS?inline imports as text strings
 * This plugin allows importing CSS files with the ?inline suffix to get the CSS content as a string
 */
export function cssInlineEsbuildPlugin() {
  return {
    name: "css-inline",
    setup(build) {
      build.onResolve({ filter: /\.css\?inline$/ }, args => {
        // Remove ?inline suffix and resolve the actual path
        const cssPath = args.path.replace("?inline", "")

        // Resolve relative path based on the importer
        if (cssPath.startsWith("./") || cssPath.startsWith("../")) {
          const resolvedPath = path.resolve(path.dirname(args.importer), cssPath)
          return {
            path: resolvedPath,
            namespace: "css-inline"
          }
        }

        return {
          path: cssPath,
          namespace: "css-inline"
        }
      })

      build.onLoad({ filter: /.*/, namespace: "css-inline" }, async args => {
        const css = await fs.promises.readFile(args.path, "utf8")
        return {
          contents: `export default ${JSON.stringify(css)}`,
          loader: "js"
        }
      })
    }
  }
}
