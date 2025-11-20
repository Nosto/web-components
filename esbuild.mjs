import esbuild from "esbuild"
import fs from "fs"

// Custom plugin that minifies GraphQL files to strings
const graphqlMinifierPlugin = {
  name: "graphql-minifier",
  setup(build) {
    build.onLoad({ filter: /\.graphql$/ }, async args => {
      const contents = await fs.promises.readFile(args.path, "utf8")

      // Directly minify by removing extra whitespace
      const minified = contents.replace(/\s+/g, " ").trim()

      return {
        contents: `export default ${JSON.stringify(minified)}`,
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
  loader: { ".css": "text" },
  plugins: [graphqlMinifierPlugin]
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
      minifyWhitespace: true,
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
