import esbuild from "esbuild"

const external = ["liquidjs", "handlebars", "swiper"]

const sharedConfig = {
  entryPoints: ["src/main.ts"],
  bundle: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  target: "es2018",
  sourcemap: true,
  external
}

export const stubExternal = {
  name: "stub-external",
  setup(build) {
    const overrides = {
      // for liquidjs the named export Liquid is used instead
      liquidjs: "export const Liquid = undefined;"
    }

    build.onResolve({ filter: new RegExp(`^(${external.join("|")})$`) }, args => {
      return { path: args.path, namespace: "stub" }
    })

    build.onLoad({ filter: /.*/, namespace: "stub" }, args => {
      return {
        contents: overrides[args.path] ?? `export default undefined;`,
        loader: "js"
      }
    })
  }
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

    await esbuild.build({
      ...sharedConfig,
      minifyWhitespace: true,
      outfile: "dist/main.es.bundle.js",
      format: "esm",
      plugins: [stubExternal]
    })

    console.log("Build completed successfully.")
  } catch (error) {
    console.error("Build failed:", error)
    process.exit(1)
  }
}

await build()
