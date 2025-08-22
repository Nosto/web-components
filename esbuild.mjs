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
  { name: "NostoCampaign", entry: "src/components/NostoCampaign/NostoCampaign.ts" },
  { name: "NostoControl", entry: "src/components/NostoControl/NostoControl.ts" },
  { name: "NostoDynamicCard", entry: "src/components/NostoDynamicCard/NostoDynamicCard.ts" },
  { name: "NostoImage", entry: "src/components/NostoImage/NostoImage.ts" },
  { name: "NostoProduct", entry: "src/components/NostoProduct/NostoProduct.ts" },
  { name: "NostoProductCard", entry: "src/components/NostoProductCard/NostoProductCard.ts" },
  { name: "NostoSection", entry: "src/components/NostoSection/NostoSection.ts" },
  { name: "NostoSkuOptions", entry: "src/components/NostoSkuOptions/NostoSkuOptions.ts" }
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
