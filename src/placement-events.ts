type EventDetail = {
  productId: string
  skuId: string
}

export const ATC_COMPLETE = "nosto:atc:complete"

export function triggerPlacementEvent(type: string, placementId: string | null, detail: EventDetail) {
  const eventTarget = document.querySelector(`[id="${placementId}"]`)
  if (!eventTarget) {
    console.error(`Placement with id ${placementId} to trigger event ${type} not found`)
    return
  }
  const event = new CustomEvent(type, {
    bubbles: false,
    cancelable: true,
    detail
  })
  eventTarget.dispatchEvent(event)
}
