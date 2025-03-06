export type EventDetail = {
  productId: string
  skuId: string
}

export const ATC_COMPLETE = "nosto:atc:complete"

export function triggerPlacementEvent(type: string, sourceElement: Element, detail: EventDetail) {
  const eventTarget = sourceElement.closest("div.nosto_element")
  if (!eventTarget || !eventTarget.getAttribute("id")) {
    console.error(`Unable to locate the wrapper placement to trigger ${type} event`)
    return
  }
  const event = new CustomEvent(type, {
    bubbles: true,
    cancelable: true,
    detail
  })
  eventTarget.dispatchEvent(event)
}
