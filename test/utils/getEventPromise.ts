/**
 * Creates a promise that resolves when a specific event is fired on an event target.
 *
 * @param eventTarget - The target element that will dispatch the event
 * @param eventName - The name of the event to listen for
 * @returns A promise that resolves when the event is fired
 *
 * @example
 * ```typescript
 * const element = document.createElement('div')
 * const promise = getEventPromise(element, 'custom-event')
 * element.dispatchEvent(new Event('custom-event'))
 * await promise // Resolves when event is dispatched
 * ```
 */
export function getEventPromise(eventTarget: EventTarget, eventName: string): Promise<void> {
  return new Promise<void>(resolve => {
    eventTarget.addEventListener(eventName, () => resolve(), { once: true })
  })
}
