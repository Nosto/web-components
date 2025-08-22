import esbuild from "esbuild"
import fs from "fs"

const sharedConfig = {
  bundle: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  target: "es2018",
  sourcemap: true
}

const mainConfig = {
  ...sharedConfig,
  entryPoints: ["src/main.ts"]
}

const shopifyConfig = {
  ...sharedConfig,
  entryPoints: ["src/shopify.ts"]
}

async function build() {
  try {
    // Build main bundle
    await esbuild.build({
      ...mainConfig,
      outfile: "dist/main.cjs.js",
      format: "cjs"
    })

    await esbuild.build({
      ...mainConfig,
      outfile: "dist/main.es.js",
      format: "esm"
    })

    const result = await esbuild.build({
      ...mainConfig,
      outfile: "dist/main.es.bundle.js",
      format: "esm",
      metafile: true
    })

    // Build Shopify bundle
    await esbuild.build({
      ...shopifyConfig,
      outfile: "dist/shopify.cjs.js",
      format: "cjs"
    })

    await esbuild.build({
      ...shopifyConfig,
      outfile: "dist/shopify.es.js",
      format: "esm"
    })

    await esbuild.build({
      ...shopifyConfig,
      outfile: "dist/shopify.es.bundle.js",
      format: "esm"
    })

    fs.writeFileSync("meta.json", JSON.stringify(result.metafile))

    console.log("Build completed successfully.")
  } catch (error) {
    console.error("Build failed:", error)
    process.exit(1)
  }
}

await build()
