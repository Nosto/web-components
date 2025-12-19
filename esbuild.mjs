import esbuild from "esbuild"
import fs from "fs"
import path from "path"
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

async function discoverComponents() {
  const componentsDir = "src/components"
  const entries = await fs.promises.readdir(componentsDir, { withFileTypes: true })
  const components = []

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const componentPath = path.join(componentsDir, entry.name, `${entry.name}.ts`)
      try {
        await fs.promises.access(componentPath)
        const content = await fs.promises.readFile(componentPath, "utf8")
        const customElementMatch = content.match(/@customElement\(["']([^"']+)["'][^)]*\)/)
        if (customElementMatch) {
          components.push({
            name: customElementMatch[1],
            entryPoint: componentPath,
            className: entry.name
          })
        }
      } catch {
        // Skip if file doesn't exist
      }
    }
  }

  return components
}

async function buildComponents() {
  const components = await discoverComponents()
  const componentsOutputDir = "dist/components"

  await fs.promises.mkdir(componentsOutputDir, { recursive: true })

  console.log(`Building ${components.length} individual components...`)

  for (const component of components) {
    const componentSharedConfig = {
      entryPoints: [component.entryPoint],
      bundle: true,
      minifyIdentifiers: true,
      minifySyntax: true,
      target: "es2020",
      sourcemap: true,
      plugins: [cssPlugin(), graphqlPlugin()]
    }

    // ESM build
    await esbuild.build({
      ...componentSharedConfig,
      outfile: `${componentsOutputDir}/${component.name}.js`,
      format: "esm"
    })

    // CommonJS build
    await esbuild.build({
      ...componentSharedConfig,
      outfile: `${componentsOutputDir}/${component.name}.cjs.js`,
      format: "cjs"
    })

    // Minified ESM build
    await esbuild.build({
      ...componentSharedConfig,
      outfile: `${componentsOutputDir}/${component.name}.min.js`,
      format: "esm",
      minifyWhitespace: true
    })

    console.log(`  ✓ Built ${component.name}`)
  }

  console.log("Component builds completed successfully.")
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

    console.log("Main bundle build completed successfully.")

    // Build individual components
    await buildComponents()
  } catch (error) {
    console.error("Build failed:", error)
    process.exit(1)
  }
}

await build()
