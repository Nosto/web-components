import fs from "fs"
import path from "path"
import esbuild from "esbuild"

/**
 * esbuild plugin to handle CSS imports with ?raw suffix
 * Minifies CSS and returns it as a string for shadow DOM usage
 */
export const cssRawPlugin = {
  name: "css-raw",
  setup(build) {
    // Handle CSS files with ?raw suffix
    build.onResolve({ filter: /\.css\?raw$/ }, args => {
      return {
        path: path.resolve(args.resolveDir, args.path.replace(/\?raw$/, "")),
        namespace: "css-raw"
      }
    })

    build.onLoad({ filter: /.*/, namespace: "css-raw" }, async args => {
      // Read the CSS file
      const css = await fs.promises.readFile(args.path, "utf8")

      // Use esbuild to minify the CSS
      const result = await esbuild.transform(css, {
        loader: "css",
        minify: true
      })

      // Return the minified CSS as a string export
      return {
        contents: `export default ${JSON.stringify(result.code)}`,
        loader: "js"
      }
    })
  }
}
