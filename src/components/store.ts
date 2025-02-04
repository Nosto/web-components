import { intersectionOf } from "@/utils"

interface State {
  selectedSkuId: string | undefined
  selectedSkuIds: string[]
  skuOptions: Record<string, string[]>
}

type ChangeListener = (state: State) => void

export function createStore(productId: string, recoId: string) {
  const state: State = {
    selectedSkuId: undefined,
    selectedSkuIds: [],
    skuOptions: {}
  }

  const listeners: ChangeListener[] = []

  function addToCart() {
    if (window.Nosto && typeof window.Nosto.addSkuToCart === "function") {
      if (state.selectedSkuId) {
        const skuId = state.selectedSkuId
        window.Nosto.addSkuToCart({ productId, skuId }, recoId, 1)
        console.info("Add to cart event registered.")
      } else {
        console.info(`skuId missing for product ${productId}`)
      }
    }
  }

  function selectSkuId(skuId: string) {
    state.selectedSkuId = skuId
    listeners.forEach(cb => cb(state))
  }

  function updateSkuOptions(groupId: string, skuIds: string[]) {
    state.skuOptions[groupId] = skuIds

    state.selectedSkuIds = intersectionOf(...Object.values(state.skuOptions))

    if (state.selectedSkuIds.length === 1) {
      state.selectedSkuId = state.selectedSkuIds[0]
    }
    listeners.forEach(cb => cb(state))
  }

  function onChange(cb: (state: State) => void) {
    listeners.push(cb)
  }

  return {
    addToCart,
    onChange,
    updateSkuOptions,
    selectSkuId
  }
}
