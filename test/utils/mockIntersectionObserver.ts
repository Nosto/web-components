import { vi } from "vitest"

export interface MockIntersectionObserverOptions {
  onCallback?: (callback: IntersectionObserverCallback) => void
}

export interface MockIntersectionObserverReturn {
  observe: ReturnType<typeof vi.fn>
  disconnect: ReturnType<typeof vi.fn>
}

export function mockIntersectionObserver(options: MockIntersectionObserverOptions = {}) {
  const { onCallback } = options

  const observe = vi.fn()
  const disconnect = vi.fn()

  class MockIntersectionObserver {
    observe = observe
    disconnect = disconnect
    unobserve = vi.fn()
    takeRecords = vi.fn(() => [])
    root = null
    rootMargin = ""
    thresholds = []

    constructor(callback?: IntersectionObserverCallback) {
      if (callback && onCallback) {
        onCallback(callback)
      }
    }
  }

  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver)

  return { observe, disconnect }
}
