import { describe, it, expect } from "vitest"
import { Bundle } from "@/main"

describe("main.ts exports", () => {
  it("should export Bundle component", () => {
    expect(Bundle).toBeDefined()
    expect(Bundle.name).toBe("Bundle")
  })
})
