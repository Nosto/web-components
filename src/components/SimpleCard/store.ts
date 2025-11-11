import type { ShopifyProductGraphQL } from "@/shopify/types"

export type StoreState = {
  product?: ShopifyProductGraphQL
}

export type StoreSubscriber = (product?: ShopifyProductGraphQL) => void

export const store = (() => {
  const subscribers = new Set<StoreSubscriber>()

  const initialState: StoreState = {}

  const notify = () => subscribers.forEach(fn => fn(Object.freeze({ ...proxy }).product))

  const proxy: StoreState = new Proxy(initialState, {
    get(target, prop: keyof StoreState) {
      return target[prop]
    },
    set(target, prop: keyof StoreState, value: ShopifyProductGraphQL) {
      target[prop] = value
      notify()
      return true
    }
  })

  return {
    state: proxy,
    subscribe(fn: StoreSubscriber) {
      subscribers.add(fn)
      return () => subscribers.delete(fn) // unsubscribe function
    }
  }
})()
