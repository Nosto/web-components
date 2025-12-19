import esbuild from "esbuild"
import fs from "fs"
import { cssPlugin, graphqlPlugin } from "./plugins/esbuild.mjs"

const sharedConfig = {
  entryPoints: ["src/main.ts"],
  bundle: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  target: "es2020",
  sourcemap: true,
  plugins: [cssPlugin(), graphqlPlugin()]
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

    await Promise.all(
      getElements().map((element) =>
        esbuild.build({
          ...sharedConfig,
          entryPoints: [`src/components/${element}/${element}.ts`],
          minifyWhitespace: true,
          outfile: `dist/components/${element}/${element}.js`,
          format: "esm",
        })
      )
    )

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

function getElements() {
  return fs.readdirSync("src/components").filter((file) => {
    return fs.statSync(`src/components/${file}`).isDirectory()
  })
}

await build()
