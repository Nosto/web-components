import { describe, it, expect, vi } from "vitest"
import { createStore, State, Store } from "@/store"

describe("createStore", () => {
  function newStore(productId: string, recoId: string) {
    const store = createStore(productId, recoId)
    const state = {} as State
    store.onChange(event => Object.assign(state, event.state))
    return [store, state] as [Store, State]
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
