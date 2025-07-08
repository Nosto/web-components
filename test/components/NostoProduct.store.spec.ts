import { describe, it, expect, vi } from "vitest"
import { createStore, Events } from "@/components/NostoProduct/store"
import { NostoProduct } from "@/components/NostoProduct/NostoProduct"

describe("createStore", () => {
  function newStore(productId: string, recoId: string) {
    const element = new NostoProduct()
    element.setAttribute("product-id", productId)
    element.setAttribute("reco-id", recoId)
    const store = createStore(element)
    const events: Partial<Events> = {}
    store.listen("selectedSkuId", skuId => (events.selectedSkuId = skuId))
    store.listen("skuOptions", skuOptions => (events.skuOptions = skuOptions))
    return [store, events] as const
  }

  it("should initialize with default state", () => {
    const [store, state] = newStore("product1", "reco1")
    store.registerOptionGroup()
    expect(store).toBeDefined()
    expect(state).toBeDefined()
  })

  it("should update selectedSkuId when selectSkuId is called", () => {
    const [store, state] = newStore("product1", "reco1")
    store.registerOptionGroup()
    store.selectSkuId("sku1")
    expect(state.selectedSkuId).toBe("sku1")
  })

  it("should update skuOptions and selectedSkuId when selectSkuOption is called", () => {
    const [store, state] = newStore("product1", "reco1")
    store.registerOptionGroup()
    store.registerOptionGroup()
    store.selectSkuOption("option1", ["sku1", "sku2"])
    store.selectSkuOption("option2", ["sku1"])
    expect(state.selectedSkuId).toBe("sku1")
  })

  it("should call addSkuToCart when addToCart is called with selectedSkuId", () => {
    const [store, state] = newStore("product1", "reco1")
    store.registerOptionGroup()
    window.Nosto = {
      addSkuToCart: vi.fn()
    }
    store.selectSkuId("sku1")
    expect(state.selectedSkuId).toBe("sku1")
    store.addToCart()
    expect(window.Nosto.addSkuToCart).toHaveBeenCalledWith({ productId: "product1", skuId: "sku1" }, "reco1", 1)
  })

  it("should not call addSkuToCart when addToCart is called without selectedSkuId", () => {
    const [store, state] = newStore("product1", "reco1")
    store.registerOptionGroup()
    window.Nosto = {
      addSkuToCart: vi.fn()
    }
    store.addToCart()
    expect(state.selectedSkuId).toBeUndefined()
    expect(window.Nosto.addSkuToCart).not.toHaveBeenCalled()
  })
})
