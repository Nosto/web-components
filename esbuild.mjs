import esbuild from "esbuild"
import fs from "fs"

const sharedConfig = {
  bundle: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  target: "es2018",
  sourcemap: true
}

// Generate components array dynamically from filesystem
const componentNames = [
  "NostoCampaign",
  "NostoControl",
  "NostoDynamicCard",
  "NostoImage",
  "NostoProduct",
  "NostoProductCard",
  "NostoSection",
  "NostoSkuOptions"
]

const components = componentNames.map(name => ({
  name,
  entry: `src/components/${name}/${name}.ts`
}))

async function build() {
  try {
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
    }

    console.log("Build completed successfully.")
  } catch (error) {
    console.error("Build failed:", error)
    process.exit(1)
  }
}

await build()
