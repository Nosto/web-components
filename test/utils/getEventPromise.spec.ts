import { describe, it, expect } from "vitest"
import { getEventPromise } from "./getEventPromise"

describe("getEventPromise", () => {
  it("resolves when event is dispatched", async () => {
    const element = document.createElement("div")
    const promise = getEventPromise(element, "custom-event")

    element.dispatchEvent(new Event("custom-event"))

    await expect(promise).resolves.toBeUndefined()
  })

  it("resolves only once when event is dispatched multiple times", async () => {
    const element = document.createElement("div")
    let resolveCount = 0

    const promise = getEventPromise(element, "custom-event").then(() => {
      resolveCount++
    })

    element.dispatchEvent(new Event("custom-event"))
    element.dispatchEvent(new Event("custom-event"))
    element.dispatchEvent(new Event("custom-event"))

    await promise
    expect(resolveCount).toBe(1)
  })
})
