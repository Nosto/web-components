import esbuild from "esbuild"
import fs from "fs"

const graphqlLoader = {
  name: "graphql-loader",
  setup(build) {
    build.onLoad({ filter: /\.graphql$/ }, async args => {
      const contents = await fs.promises.readFile(args.path, "utf8")
      return {
        contents: `export default \`${contents.replace(/`/g, "\\`")}\`;`,
        loader: "js"
      }
    })
  }
}

const sharedConfig = {
  entryPoints: ["src/main.ts"],
  plugins: [graphqlLoader],
  bundle: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  target: "es2018",
  sourcemap: true,
  loader: { ".css": "text" }
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
