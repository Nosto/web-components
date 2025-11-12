import { vi } from "vitest"

export interface MockIntersectionObserverOptions {
  /**
   * Optional callback to capture the IntersectionObserverCallback passed to constructor
   */
  onCallback?: (callback: IntersectionObserverCallback) => void
}

export interface MockIntersectionObserverReturn {
  /**
   * Mock function for the observe method
   */
  observe: ReturnType<typeof vi.fn>
  /**
   * Mock function for the disconnect method
   */
  disconnect: ReturnType<typeof vi.fn>
}

/**
 * Mocks the global IntersectionObserver for testing
 * @param options Configuration options for the mock
 * @returns Object containing the mock observe and disconnect functions
 */
export function mockIntersectionObserver(
  options: MockIntersectionObserverOptions = {}
): MockIntersectionObserverReturn {
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
