import { NostoProduct } from "@/main"
import { triggerEvent } from "@/components/NostoProduct/events"
import { intersectionOf } from "@/utils"
import { addSkuToCart } from "@nosto/nosto-js"

interface Sku {
  id: string
  price?: string
  listPrice?: string
  image?: string
  altImage?: string
}

interface State {
  skuOptions: Record<string, string[]>
  skuData?: Sku[]
  optionGroupCount: number
  selectedSkuId?: string
  image?: string
  altImage?: string
  price?: string
  listPrice?: string
}

export type Events = Omit<State, "optionGroupCount">

type Listener<T extends keyof Events> = (value: Events[T]) => void

export function createStore(element: NostoProduct) {
  const { productId, recoId } = element
  const state: State = {
    skuOptions: {},
    optionGroupCount: 0
  }

  const listeners: { [K in keyof Events]?: Listener<K>[] } = {}

  async function addToCart() {
    if (state.selectedSkuId) {
      const skuId = state.selectedSkuId
      await addSkuToCart({ productId, skuId }, recoId, 1)
      triggerEvent("atc:complete", element, {
        productId,
        skuId
      })
    } else {
      triggerEvent("atc:no-sku-selected", element, { productId })
    }
  }

  function selectSkuId(skuId: string) {
    notify("selectedSkuId", (state.selectedSkuId = skuId))
    const sku = state.skuData?.find(sku => sku.id === skuId)
    if (sku) {
      setSkuData(sku)
    }
  }

  function selectSkuOption(optionId: string, skuIds: string[]) {
    state.skuOptions[optionId] = skuIds
    notify("skuOptions", state.skuOptions)
    const totalSelection = Object.keys(state.skuOptions).length
    const selectedSkuIds = intersectionOf(...Object.values(state.skuOptions))

    if (selectedSkuIds.length === 1) {
      if (totalSelection === state.optionGroupCount) {
        selectSkuId(selectedSkuIds[0])
      } else if (state.skuData) {
        const sku = state.skuData.find(sku => sku.id === selectedSkuIds[0])
        if (sku) {
          setSkuData(sku)
        }
      }
    } else if (state.skuData) {
      const skus = state.skuData.filter(sku => selectedSkuIds.includes(sku.id))
      setSkuData({
        price: getSkuValue(skus, "price"),
        listPrice: getSkuValue(skus, "listPrice"),
        image: getSkuValue(skus, "image"),
        altImage: getSkuValue(skus, "altImage")
      })
    }
  }

  function setSkuData(sku: Omit<Sku, "id">) {
    const fields = ["image", "altImage", "price", "listPrice"] as const
    fields
      .filter(field => sku[field])
      .forEach(field => {
        notify(field, (state[field] = sku[field]))
      })
  }

  function setSkus(data: Sku[]) {
    notify("skuData", (state.skuData = data))
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
    if (state[k] !== undefined && state[k] !== null) {
      cb(state[k])
    }
  }

  return {
    addToCart,
    listen,
    selectSkuOption,
    selectSkuId,
    registerOptionGroup,
    setSkus,
    setSkuData
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

function getSkuValue<T extends keyof Sku>(skus: Sku[], key: T) {
  const values = new Set(skus.map(sku => sku[key]))
  return values.size === 1 ? [...values][0] : undefined
}
