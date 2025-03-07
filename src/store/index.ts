import { NostoProduct } from "@/main"
import { triggerPlacementEvent } from "@/placement-events"
import { intersectionOf } from "@/utils"

interface State {
  selectedSkuId: string | undefined
  skuOptions: Record<string, string[]>
  optionGroupCount: number
}

export type Events = Pick<State, "selectedSkuId" | "skuOptions">

type Listener<T extends keyof Events> = (value: Events[T]) => void

export function createStore(element: NostoProduct) {
  const { productId, recoId } = element
  const state: State = {
    selectedSkuId: undefined,
    skuOptions: {},
    optionGroupCount: 0
  }

  const listeners: { [K in keyof Events]?: Listener<K>[] } = {}

  async function addToCart() {
    if (state.selectedSkuId) {
      if (typeof window.Nosto?.addSkuToCart === "function") {
        const skuId = state.selectedSkuId
        await window.Nosto.addSkuToCart({ productId, skuId }, recoId, 1)
        triggerPlacementEvent("atc:complete", element, {
          productId,
          skuId
        })
      }
    } else {
      triggerPlacementEvent("atc:no-sku-selected", element, { productId })
    }
  }

  function selectSkuId(skuId: string) {
    state.selectedSkuId = skuId
    notify("selectedSkuId", skuId)
  }

  function selectSkuOption(optionId: string, skuIds: string[]) {
    state.skuOptions[optionId] = skuIds
    notify("skuOptions", state.skuOptions)

    const totalSelection = Object.keys(state.skuOptions).length

    if (totalSelection === state.optionGroupCount) {
      const selectedSkuIds = intersectionOf(...Object.values(state.skuOptions))
      if (selectedSkuIds.length === 1) {
        selectSkuId(selectedSkuIds[0])
      }
    }
  }

  function registerOptionGroup() {
    state.optionGroupCount++
  }

  function notify<T extends keyof Events>(k: T, v: Events[T]) {
    listeners[k]?.forEach(cb => cb(v))
  }

  function listen<T extends keyof Events>(k: T, cb: Listener<T>) {
    const mapping: Listener<T>[] = listeners[k] || (listeners[k] = [])
    mapping.push(cb)
    cb(state[k])
  }

  return {
    addToCart,
    listen,
    selectSkuOption,
    selectSkuId,
    registerOptionGroup
  }
}

const REQUEST_STORE = "nosto-request-store"

type Callback = (store: Store) => void

export function provideStore(element: HTMLElement, store: Store) {
  element.addEventListener(REQUEST_STORE, event => {
    event.stopPropagation()
    const callback = (event as CustomEvent).detail as Callback
    callback(store)
  })
}

export function injectStore(element: HTMLElement, cb: Callback) {
  element.dispatchEvent(new CustomEvent(REQUEST_STORE, { detail: cb, bubbles: true }))
}

export type Store = ReturnType<typeof createStore>
