/**
 * Creates a promise that resolves with the event payload when a specific event is fired on an event target.
 *
 * @param eventTarget - The target element that will dispatch the event
 * @param eventName - The name of the event to listen for
 * @returns A promise that resolves with the event object when the event is fired
 *
 * @example
 * ```typescript
 * const element = document.createElement('div')
 * const promise = getEventPromise(element, 'custom-event')
 * element.dispatchEvent(new Event('custom-event'))
 * const event = await promise // Resolves with the event object
 * ```
 */
export function getEventPromise(eventTarget: EventTarget, eventName: string) {
  return new Promise<Event>(resolve => {
    eventTarget.addEventListener(eventName, event => resolve(event), { once: true })
  })
}
