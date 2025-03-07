export type EventDetail = {
  productId: string
  skuId: string
}

export const EVENT_TYPE_ADD_TO_CART_COMPLETE = "nosto:atc:complete"

export function triggerPlacementEvent(type: string, sourceElement: Element, detail: EventDetail) {
  const eventTarget = sourceElement.closest('.nosto_element[id]:not(.nosto_element[id=""])')
  if (!eventTarget) {
    console.warn(`Unable to locate the wrapper placement to trigger ${type} event`)
    return
  }
  const event = new CustomEvent(type, {
    bubbles: true,
    cancelable: true,
    detail
  })
  eventTarget.dispatchEvent(event)
}
