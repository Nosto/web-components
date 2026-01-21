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
    const ctx1 = await esbuild.context({
      ...sharedConfig,
      outfile: "dist/main.cjs.js",
      format: "cjs"
    })

    const ctx2 = await esbuild.context({
      ...sharedConfig,
      outfile: "dist/main.es.js",
      format: "esm"
    })

    const ctx3 = await esbuild.context({
      ...sharedConfig,
      minifyWhitespace: true,
      outfile: "dist/main.es.bundle.js",
      format: "esm",
      metafile: true
    })

    if (process.argv.includes("--watch")) {
      await Promise.all([ctx1.watch(), ctx2.watch(), ctx3.watch()])
      console.info("Watching for changes...")
    } else {
      const results = await Promise.all([ctx1.rebuild(), ctx2.rebuild(), ctx3.rebuild()])
      fs.writeFileSync("meta.json", JSON.stringify(results[2].metafile))

      ctx1.dispose()
      ctx2.dispose()
      ctx3.dispose()
      console.info("Build completed successfully.")
    }
  } catch (error) {
    console.error("Build failed:", error)
    process.exit(1)
  }
}

await build()
