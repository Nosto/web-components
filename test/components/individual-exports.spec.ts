import { describe, it, expect } from "vitest"

describe("Individual component exports", () => {
  it("should export NostoCampaign from nosto-campaign entry", async () => {
    const { NostoCampaign } = await import("../../src/nosto-campaign")
    expect(NostoCampaign).toBeDefined()
    expect(NostoCampaign.name).toBe("NostoCampaign")
  })

  it("should export NostoControl from nosto-control entry", async () => {
    const { NostoControl } = await import("../../src/nosto-control")
    expect(NostoControl).toBeDefined()
    expect(NostoControl.name).toBe("NostoControl")
  })

  it("should export NostoDynamicCard from nosto-dynamic-card entry", async () => {
    const { NostoDynamicCard } = await import("../../src/nosto-dynamic-card")
    expect(NostoDynamicCard).toBeDefined()
    expect(NostoDynamicCard.name).toBe("NostoDynamicCard")
  })

  it("should export NostoImage from nosto-image entry", async () => {
    const { NostoImage } = await import("../../src/nosto-image")
    expect(NostoImage).toBeDefined()
    expect(NostoImage.name).toBe("NostoImage")
  })

  it("should export NostoProduct from nosto-product entry", async () => {
    const { NostoProduct } = await import("../../src/nosto-product")
    expect(NostoProduct).toBeDefined()
    expect(NostoProduct.name).toBe("NostoProduct")
  })

  it("should export NostoProductCard from nosto-product-card entry", async () => {
    const { NostoProductCard } = await import("../../src/nosto-product-card")
    expect(NostoProductCard).toBeDefined()
    expect(NostoProductCard.name).toBe("NostoProductCard")
  })

  it("should export NostoSection from nosto-section entry", async () => {
    const { NostoSection } = await import("../../src/nosto-section")
    expect(NostoSection).toBeDefined()
    expect(NostoSection.name).toBe("NostoSection")
  })

  it("should export NostoSkuOptions from nosto-sku-options entry", async () => {
    const { NostoSkuOptions } = await import("../../src/nosto-sku-options")
    expect(NostoSkuOptions).toBeDefined()
    expect(NostoSkuOptions.name).toBe("NostoSkuOptions")
  })
})
