import { describe, it, expect } from "vitest"

describe("library loading", () => {
  it("should work without bundled dependnencies", async () => {
    // @ts-expect-error no types available
    const exports = await import("../dist/main.es.js")
    expect(exports.NostoProductCard).toBeDefined()
    expect(exports.NostoProduct).toBeDefined()
    expect(exports.NostoSkuOptions).toBeDefined()
    expect(exports.NostoShopify).toBeDefined()
    expect(exports.NostoSwiper).toBeDefined()
  })
})
