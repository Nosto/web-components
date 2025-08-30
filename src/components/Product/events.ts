type Events = {
  "atc:complete": {
    productId: string
    skuId: string
  }
  "atc:no-sku-selected": {
    productId: string
  }
}

export type EventName = keyof Events

export function triggerEvent<E extends keyof Events>(type: E, sourceElement: Element, detail: Events[E]) {
  const eventTarget = sourceElement.closest('.nosto_element[id]:not(.nosto_element[id=""])')
  if (!eventTarget) {
    console.warn(`Unable to locate the wrapper placement to trigger ${type} event`)
    return
  }
  const event = new CustomEvent(`nosto:${type}`, {
    bubbles: true,
    cancelable: true,
    detail
  })
  eventTarget.dispatchEvent(event)
}
