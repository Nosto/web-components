import { describe, it, expect } from "vitest"
import fs from "fs"
import path from "path"

describe("Built individual component exports", () => {
  const distPath = path.resolve(__dirname, "../../dist")

  it("should have built all individual component ES modules", () => {
    const expectedFiles = [
      "NostoCampaign.es.js",
      "NostoControl.es.js",
      "NostoDynamicCard.es.js",
      "NostoImage.es.js",
      "NostoProduct.es.js",
      "NostoProductCard.es.js",
      "NostoSection.es.js",
      "NostoSkuOptions.es.js"
    ]

    for (const file of expectedFiles) {
      const filePath = path.join(distPath, file)
      expect(fs.existsSync(filePath), `${file} should exist in dist`).toBe(true)
    }
  })

  it("should have built all individual component CommonJS modules", () => {
    const expectedFiles = [
      "NostoCampaign.cjs.js",
      "NostoControl.cjs.js",
      "NostoDynamicCard.cjs.js",
      "NostoImage.cjs.js",
      "NostoProduct.cjs.js",
      "NostoProductCard.cjs.js",
      "NostoSection.cjs.js",
      "NostoSkuOptions.cjs.js"
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
