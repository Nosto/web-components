import esbuild from "esbuild"

const sharedConfig = {
  entryPoints: ["src/main.ts"],
  bundle: true,
  minify: true,
  target: "es2018",
  sourcemap: true
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

    console.log("Build completed successfully.")
  } catch (error) {
    console.error("Build failed:", error)
    process.exit(1)
  }
}

await build()
