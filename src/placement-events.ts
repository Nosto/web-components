type Events = {
  complete: {
    productId: string
    skuId: string
  }
  "no-sku": {
    productId: string
  }
}

export function triggerPlacementEvent<E extends keyof Events>(type: E, sourceElement: Element, detail: Events[E]) {
  const eventTarget = sourceElement.closest('.nosto_element[id]:not(.nosto_element[id=""])')
  if (!eventTarget) {
    console.warn(`Unable to locate the wrapper placement to trigger ${type} event`)
    return
  }
  const event = new CustomEvent(`nosto:atc:${type}`, {
    bubbles: true,
    cancelable: true,
    detail
  })
  eventTarget.dispatchEvent(event)
}
