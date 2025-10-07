import esbuild from "esbuild"
import fs from "fs"
import path from "path"

// Plugin to handle CSS imports with ?inline suffix as text
const cssInlinePlugin = {
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

const sharedConfig = {
  entryPoints: ["src/main.ts"],
  bundle: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  target: "es2018",
  sourcemap: true,
  plugins: [cssInlinePlugin]
}

async function build() {
  try {
    await esbuild.build({
      ...sharedConfig,
      outfile: "dist/main.cjs.js",
      format: "cjs"
    })

    await esbuild.build({
      ...sharedConfig,
      outfile: "dist/main.es.js",
      format: "esm"
    })

    const result = await esbuild.build({
      ...sharedConfig,
      outfile: "dist/main.es.bundle.js",
      format: "esm",
      metafile: true
    })

    fs.writeFileSync("meta.json", JSON.stringify(result.metafile))

    console.log("Build completed successfully.")
  } catch (error) {
    console.error("Build failed:", error)
    process.exit(1)
  }
}

await build()
