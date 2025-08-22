import { describe, it, expect } from "vitest"
import fs from "fs"
import path from "path"

describe("Shopify build artifacts", () => {
  const distPath = path.resolve(process.cwd(), "dist")

  it("should generate shopify.es.js bundle", () => {
    const bundlePath = path.join(distPath, "shopify.es.js")
    expect(fs.existsSync(bundlePath)).toBe(true)

    const content = fs.readFileSync(bundlePath, "utf-8")
    expect(content).toContain("NostoDynamicCard")
    expect(content).toContain("NostoSection")
  })

  it("should generate shopify.cjs.js bundle", () => {
    const bundlePath = path.join(distPath, "shopify.cjs.js")
    expect(fs.existsSync(bundlePath)).toBe(true)

    const content = fs.readFileSync(bundlePath, "utf-8")
    expect(content).toContain("NostoDynamicCard")
    expect(content).toContain("NostoSection")
  })

  it("should generate shopify.es.bundle.js bundle", () => {
    const bundlePath = path.join(distPath, "shopify.es.bundle.js")
    expect(fs.existsSync(bundlePath)).toBe(true)

    const content = fs.readFileSync(bundlePath, "utf-8")
    expect(content).toContain("NostoDynamicCard")
    expect(content).toContain("NostoSection")
  })

  it("should generate source maps for shopify bundles", () => {
    const esMapPath = path.join(distPath, "shopify.es.js.map")
    const cjsMapPath = path.join(distPath, "shopify.cjs.js.map")
    const bundleMapPath = path.join(distPath, "shopify.es.bundle.js.map")

    expect(fs.existsSync(esMapPath)).toBe(true)
    expect(fs.existsSync(cjsMapPath)).toBe(true)
    expect(fs.existsSync(bundleMapPath)).toBe(true)
  })

  it("shopify bundle should be smaller than main bundle", () => {
    const mainBundlePath = path.join(distPath, "main.es.js")
    const shopifyBundlePath = path.join(distPath, "shopify.es.js")

    const mainSize = fs.statSync(mainBundlePath).size
    const shopifySize = fs.statSync(shopifyBundlePath).size

    expect(shopifySize).toBeLessThan(mainSize)
  })
})