import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { isNavigationApiSupported } from "@/utils/navigationApi"

describe("isNavigationApiSupported", () => {
  beforeEach(() => {
    // Clean up any existing navigation mock
    // @ts-expect-error cleanup
    delete global.navigation
  })

  afterEach(() => {
    // Clean up after tests
    // @ts-expect-error cleanup
    delete global.navigation
  })

  it("returns true when Navigation API is fully supported", () => {
    // @ts-expect-error partial mock assignment
    global.navigation = {
      addEventListener: () => {},
      removeEventListener: () => {}
    }

    expect(isNavigationApiSupported()).toBe(true)
  })

  it("returns false when navigation is undefined", () => {
    expect(isNavigationApiSupported()).toBe(false)
  })

  it("returns false when addEventListener is missing", () => {
    // @ts-expect-error partial mock assignment
    global.navigation = {
      removeEventListener: () => {}
    }

    expect(isNavigationApiSupported()).toBe(false)
  })

  it("returns false when removeEventListener is missing", () => {
    // @ts-expect-error partial mock assignment
    global.navigation = {
      addEventListener: () => {}
    }

    expect(isNavigationApiSupported()).toBe(false)
  })

  it("returns false when both methods are missing", () => {
    // @ts-expect-error partial mock assignment
    global.navigation = {}

    expect(isNavigationApiSupported()).toBe(false)
  })
})
