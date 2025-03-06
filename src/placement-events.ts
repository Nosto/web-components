type EventDetail = {
  productId: string
  skuId: string
}

export const ATC_COMPLETE = "nosto:atc:complete"

export function triggerPlacementEvent(type: string, selector: string, detail: EventDetail) {
  const eventTarget = document.querySelector(selector)
  if (!eventTarget) {
    console.error(`Element ${selector} to trigger event ${type} not found`)
    return
  }
  const event = new CustomEvent(type, {
    bubbles: false,
    cancelable: true,
    detail
  })
  eventTarget.dispatchEvent(event)
}
