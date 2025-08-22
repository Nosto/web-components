import { describe, it, expect } from "vitest"

describe("Individual component exports", () => {
  it("should export NostoCampaign from direct component path", async () => {
    const { NostoCampaign } = await import("../../src/components/NostoCampaign/NostoCampaign")
    expect(NostoCampaign).toBeDefined()
    expect(NostoCampaign.name).toBe("NostoCampaign")
  })

  it("should export NostoControl from direct component path", async () => {
    const { NostoControl } = await import("../../src/components/NostoControl/NostoControl")
    expect(NostoControl).toBeDefined()
    expect(NostoControl.name).toBe("NostoControl")
  })

  it("should export NostoDynamicCard from direct component path", async () => {
    const { NostoDynamicCard } = await import("../../src/components/NostoDynamicCard/NostoDynamicCard")
    expect(NostoDynamicCard).toBeDefined()
    expect(NostoDynamicCard.name).toBe("NostoDynamicCard")
  })

  it("should export NostoImage from direct component path", async () => {
    const { NostoImage } = await import("../../src/components/NostoImage/NostoImage")
    expect(NostoImage).toBeDefined()
    expect(NostoImage.name).toBe("NostoImage")
  })

  it("should export NostoProduct from direct component path", async () => {
    const { NostoProduct } = await import("../../src/components/NostoProduct/NostoProduct")
    expect(NostoProduct).toBeDefined()
    expect(NostoProduct.name).toBe("NostoProduct")
  })

  it("should export NostoProductCard from direct component path", async () => {
    const { NostoProductCard } = await import("../../src/components/NostoProductCard/NostoProductCard")
    expect(NostoProductCard).toBeDefined()
    expect(NostoProductCard.name).toBe("NostoProductCard")
  })

  it("should export NostoSection from direct component path", async () => {
    const { NostoSection } = await import("../../src/components/NostoSection/NostoSection")
    expect(NostoSection).toBeDefined()
    expect(NostoSection.name).toBe("NostoSection")
  })

  it("should export NostoSkuOptions from direct component path", async () => {
    const { NostoSkuOptions } = await import("../../src/components/NostoSkuOptions/NostoSkuOptions")
    expect(NostoSkuOptions).toBeDefined()
    expect(NostoSkuOptions.name).toBe("NostoSkuOptions")
  })
})
