import { NostoProduct } from "@/main"
import { triggerEvent } from "@/components/NostoProduct/events"
import { intersectionOf } from "@/utils"
import { addSkuToCart } from "@nosto/nosto-js"

interface State {
  selectedSkuId: string | undefined
  skuOptions: Record<string, string[]>
  optionGroupCount: number
  skuImage?: string
  skuAltImage?: string
  selectedElements: Record<string, HTMLElement | undefined>
}

export type Events = Pick<State, "selectedSkuId" | "skuOptions" | "skuImage" | "skuAltImage">

type Listener<T extends keyof Events> = (value: Events[T]) => void

export function createStore(element: NostoProduct) {
  const { productId, recoId } = element
  const state: State = {
    selectedSkuId: undefined,
    skuOptions: {},
    optionGroupCount: 0,
    selectedElements: {}
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

  function selectSkuId(skuId: string, optionElement?: HTMLElement) {
    state.selectedSkuId = skuId
    notify("selectedSkuId", skuId)

    if (optionElement?.getAttribute("n-skus")?.includes(skuId)) {
      const img = optionElement.getAttribute("ns-img")
      const altImg = optionElement.getAttribute("ns-alt-img") ?? undefined

      if (img) setSkuImages(img, altImg)
    }
  }

  function selectSkuOption(optionId: string, skuIds: string[]) {
    state.skuOptions[optionId] = skuIds
    notify("skuOptions", state.skuOptions)

    const totalSelection = Object.keys(state.skuOptions).length

    if (totalSelection === state.optionGroupCount) {
      const selectedSkuIds = intersectionOf(...Object.values(state.skuOptions))
      if (selectedSkuIds.length === 1) {
        const skuId = selectedSkuIds[0]

        const elementWithImage = Object.values(state.selectedElements).find(
          el => el?.getAttribute("n-skus")?.split(",").includes(skuId) && el?.hasAttribute("ns-img")
        )

        selectSkuId(skuId, elementWithImage)
      }
    }
  }

  function setSkuImages(image: string, altImage?: string) {
    if (!state.selectedSkuId) return
    state.skuImage = image
    notify("skuImage", image)

    if (altImage) {
      state.skuAltImage = altImage
      notify("skuAltImage", altImage)

      const preload = new Image()
      preload.src = altImage
    }
  }

  function getSelectedSkuId() {
    return state.selectedSkuId
  }

  function setSelectedElement(optionId: string, el: HTMLElement) {
    state.selectedElements[optionId] = el
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
    registerOptionGroup,
    setSkuImages,
    getSelectedSkuId,
    setSelectedElement
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
