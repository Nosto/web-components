import { describe, it, expect, vi } from "vitest"
import { createStore } from "../../src/components/store"

describe("createStore", () => {
  it("should initialize with default state", () => {
    const store = createStore("product1", "reco1")
    expect(store).toBeDefined()
  })

  it("should update selectedSkuId when selectSkuId is called", () => {
    const store = createStore("product1", "reco1")
    store.selectSkuId("sku1")
    store.onChange(state => {
      expect(state.selectedSkuId).toBe("sku1")
    })
  })

  it("should update skuOptions and selectedSkuId when updateSkuOptions is called", () => {
    const store = createStore("product1", "reco1")
    store.updateSkuOptions("option1", ["sku1", "sku2"])
    store.updateSkuOptions("option2", ["sku1"])
    store.onChange(state => {
      expect(state.skuOptions).toEqual({
        option1: ["sku1", "sku2"],
        option2: ["sku1"]
      })
      expect(state.selectedSkuId).toBe("sku1")
    })
  })

  it("should call addSkuToCart when addToCart is called with selectedSkuId", () => {
    const store = createStore("product1", "reco1")
    window.Nosto = {
      addSkuToCart: vi.fn()
    }
    store.selectSkuId("sku1")
    store.addToCart()
    expect(window.Nosto.addSkuToCart).toHaveBeenCalledWith({ productId: "product1", skuId: "sku1" }, "reco1", 1)
  })

  it("should not call addSkuToCart when addToCart is called without selectedSkuId", () => {
    const store = createStore("product1", "reco1")
    window.Nosto = {
      addSkuToCart: vi.fn()
    }
    store.addToCart()
    expect(window.Nosto.addSkuToCart).not.toHaveBeenCalled()
  })
})
