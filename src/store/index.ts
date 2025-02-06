import { intersectionOf } from "@/utils"

interface State {
  selectedSkuId: string | undefined
  skuOptions: Record<string, string[]>
}

type ChangeListener = (state: State) => void

export function createStore(productId: string, recoId: string) {
  const state: State = {
    selectedSkuId: undefined,
    skuOptions: {}
  }

  const listeners: ChangeListener[] = []

  function addToCart() {
    if (window.Nosto && typeof window.Nosto.addSkuToCart === "function") {
      if (state.selectedSkuId) {
        const skuId = state.selectedSkuId
        window.Nosto.addSkuToCart({ productId, skuId }, recoId, 1)
      }
    }
  }

  function selectSkuId(skuId: string) {
    state.selectedSkuId = skuId
    listeners.forEach(cb => cb(state))
  }

  function selectSkuOption(optionId: string, skuIds: string[]) {
    state.skuOptions[optionId] = skuIds

    const selectedSkuIds = intersectionOf(...Object.values(state.skuOptions))

    if (selectedSkuIds.length === 1) {
      state.selectedSkuId = selectedSkuIds[0]
    }
    listeners.forEach(cb => cb(state))
  }

  function onChange(cb: (state: State) => void) {
    listeners.push(cb)
    // needed, since some components also trigger state changes during init
    cb(state)
  }

  return {
    addToCart,
    onChange,
    selectSkuOption,
    selectSkuId
  }
}

export type Store = ReturnType<typeof createStore>
