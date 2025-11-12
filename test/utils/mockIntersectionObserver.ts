import { vi } from "vitest"

export interface MockIntersectionObserverOptions {
  /**
   * Mock function for the observe method
   */
  observe?: ReturnType<typeof vi.fn>
  /**
   * Mock function for the disconnect method
   */
  disconnect?: ReturnType<typeof vi.fn>
  /**
   * Optional callback to capture the IntersectionObserverCallback passed to constructor
   */
  onCallback?: (callback: IntersectionObserverCallback) => void
}

/**
 * Creates a mock IntersectionObserver class for testing
 * @param options Configuration options for the mock
 * @returns A mock IntersectionObserver class
 */
export function createMockIntersectionObserver(options: MockIntersectionObserverOptions = {}) {
  const { observe = vi.fn(), disconnect = vi.fn(), onCallback } = options

  return class MockIntersectionObserver {
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
}
