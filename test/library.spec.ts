import { describe, it, expect } from "vitest"

describe("library loading", () => {
  async function validate(importPath: string) {
    const exports = await import(importPath)
    expect(exports.NostoProductCard).toBeDefined()
    expect(exports.NostoProduct).toBeDefined()
    expect(exports.NostoSkuOptions).toBeDefined()
    expect(exports.NostoShopify).toBeDefined()
    expect(exports.NostoSwiper).toBeDefined()
  }

  it("should work without bundled dependnencies in ESM mode", async () => {
    await validate("../dist/main.es.js")
  })

  it("should work without bundled dependnencies in ESM browser mode", async () => {
    await validate("../dist/main.es.browser.js")
  })
})
