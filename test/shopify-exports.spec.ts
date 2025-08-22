import { describe, it, expect } from "vitest"

describe("Shopify exports", () => {
  it("should export NostoDynamicCard from shopify entry point", async () => {
    const { NostoDynamicCard } = await import("../src/shopify")
    expect(NostoDynamicCard).toBeDefined()
    expect(typeof NostoDynamicCard).toBe("function")
    expect(NostoDynamicCard.name).toBe("NostoDynamicCard")
  })

  it("should export NostoSection from shopify entry point", async () => {
    const { NostoSection } = await import("../src/shopify")
    expect(NostoSection).toBeDefined()
    expect(typeof NostoSection).toBe("function")
    expect(NostoSection.name).toBe("NostoSection")
  })

  it("should only export Shopify-specific components", async () => {
    const shopifyExports = await import("../src/shopify")
    const exportKeys = Object.keys(shopifyExports)

    expect(exportKeys).toHaveLength(2)
    expect(exportKeys).toContain("NostoDynamicCard")
    expect(exportKeys).toContain("NostoSection")
  })

  it("should not export non-Shopify components", async () => {
    const shopifyExports = await import("../src/shopify")

    expect(shopifyExports).not.toHaveProperty("NostoCampaign")
    expect(shopifyExports).not.toHaveProperty("NostoImage")
    expect(shopifyExports).not.toHaveProperty("NostoProduct")
    expect(shopifyExports).not.toHaveProperty("NostoProductCard")
    expect(shopifyExports).not.toHaveProperty("NostoSkuOptions")
    expect(shopifyExports).not.toHaveProperty("NostoControl")
  })
})
