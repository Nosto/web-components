/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest"
import "@/components/SimpleCard/SimpleCardHybrid"

describe("SimpleCardHybrid", () => {
  it("should define the custom element", () => {
    expect(customElements.get("nosto-simple-card-hybrid")).toBeDefined()
  })

  it("should create element with properties", () => {
    const element = document.createElement("nosto-simple-card-hybrid") as any
    element.handle = "test-handle"
    element.brand = true

    expect(element.handle).toBe("test-handle")
    expect(element.brand).toBe(true)
  })
})
