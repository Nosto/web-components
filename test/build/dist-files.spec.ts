import { describe, it, expect } from "vitest"
import fs from "fs"
import path from "path"

describe("Built individual component exports", () => {
  const distPath = path.resolve(__dirname, "../../dist")

  it("should have built all individual component ES modules", () => {
    const expectedFiles = [
      "nosto-campaign.es.js",
      "nosto-control.es.js",
      "nosto-dynamic-card.es.js",
      "nosto-image.es.js",
      "nosto-product.es.js",
      "nosto-product-card.es.js",
      "nosto-section.es.js",
      "nosto-sku-options.es.js"
    ]

    for (const file of expectedFiles) {
      const filePath = path.join(distPath, file)
      expect(fs.existsSync(filePath), `${file} should exist in dist`).toBe(true)
    }
  })

  it("should have built all individual component CommonJS modules", () => {
    const expectedFiles = [
      "nosto-campaign.cjs.js",
      "nosto-control.cjs.js",
      "nosto-dynamic-card.cjs.js",
      "nosto-image.cjs.js",
      "nosto-product.cjs.js",
      "nosto-product-card.cjs.js",
      "nosto-section.cjs.js",
      "nosto-sku-options.cjs.js"
    ]

    for (const file of expectedFiles) {
      const filePath = path.join(distPath, file)
      expect(fs.existsSync(filePath), `${file} should exist in dist`).toBe(true)
    }
  })

  it("should still have the main bundle files", () => {
    const mainFiles = ["main.es.js", "main.cjs.js", "main.es.bundle.js"]

    for (const file of mainFiles) {
      const filePath = path.join(distPath, file)
      expect(fs.existsSync(filePath), `${file} should exist in dist`).toBe(true)
    }
  })
})
