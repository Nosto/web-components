import { describe, it, expect } from "vitest"
import fs from "fs"
import path from "path"

describe("Built bundle files", () => {
  const distPath = path.resolve(__dirname, "../../dist")

  it("should have built all expected files in dist directory", () => {
    // Individual component ES modules
    const componentFiles = [
      "NostoCampaign.es.js",
      "NostoControl.es.js",
      "NostoDynamicCard.es.js",
      "NostoImage.es.js",
      "NostoProduct.es.js",
      "NostoProductCard.es.js",
      "NostoSection.es.js",
      "NostoSkuOptions.es.js"
    ]

    // Main bundle files
    const mainFiles = ["main.es.js", "main.cjs.js", "main.es.bundle.js"]

    // Check all files exist
    const allFiles = [...componentFiles, ...mainFiles]
    for (const file of allFiles) {
      const filePath = path.join(distPath, file)
      expect(fs.existsSync(filePath), `${file} should exist in dist`).toBe(true)
    }
  })
})
