import esbuild from "esbuild"
import fs from "fs"

const sharedConfig = {
  bundle: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  target: "es2018",
  sourcemap: true
}

const components = [
  { name: "nosto-campaign", entry: "src/nosto-campaign.ts" },
  { name: "nosto-control", entry: "src/nosto-control.ts" },
  { name: "nosto-dynamic-card", entry: "src/nosto-dynamic-card.ts" },
  { name: "nosto-image", entry: "src/nosto-image.ts" },
  { name: "nosto-product", entry: "src/nosto-product.ts" },
  { name: "nosto-product-card", entry: "src/nosto-product-card.ts" },
  { name: "nosto-section", entry: "src/nosto-section.ts" },
  { name: "nosto-sku-options", entry: "src/nosto-sku-options.ts" }
]

async function build() {
  try {
    // Build main bundle (existing behavior)
    await esbuild.build({
      ...sharedConfig,
      entryPoints: ["src/main.ts"],
      outfile: "dist/main.cjs.js",
      format: "cjs"
    })

    await esbuild.build({
      ...sharedConfig,
      entryPoints: ["src/main.ts"],
      outfile: "dist/main.es.js",
      format: "esm"
    })

    const result = await esbuild.build({
      ...sharedConfig,
      entryPoints: ["src/main.ts"],
      outfile: "dist/main.es.bundle.js",
      format: "esm",
      metafile: true
    })

    fs.writeFileSync("meta.json", JSON.stringify(result.metafile))

    // Build individual component bundles
    for (const component of components) {
      await esbuild.build({
        ...sharedConfig,
        entryPoints: [component.entry],
        outfile: `dist/${component.name}.es.js`,
        format: "esm"
      })

      await esbuild.build({
        ...sharedConfig,
        entryPoints: [component.entry],
        outfile: `dist/${component.name}.cjs.js`,
        format: "cjs"
      })
    }

    console.log("Build completed successfully.")
  } catch (error) {
    console.error("Build failed:", error)
    process.exit(1)
  }
}

await build()
