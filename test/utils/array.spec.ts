import { describe, it, expect } from "vitest"
import { intersectionOf } from "@/utils/array"

describe("array utils", () => {
  describe("intersectionOf", () => {
    it("returns empty array when no arrays provided", () => {
      expect(intersectionOf()).toEqual([])
    })

    it("returns intersection of two arrays", () => {
      const result = intersectionOf(["a", "b", "c"], ["b", "c", "d"])
      expect(result).toEqual(["b", "c"])
    })

    it("returns intersection of multiple arrays", () => {
      const result = intersectionOf(["a", "b", "c"], ["b", "c", "d"], ["c", "d", "e"])
      expect(result).toEqual(["c"])
    })

    it("returns empty array when no intersection", () => {
      const result = intersectionOf(["a", "b"], ["c", "d"])
      expect(result).toEqual([])
    })

    it("handles single array", () => {
      const result = intersectionOf(["a", "b", "c"])
      expect(result).toEqual(["a", "b", "c"])
    })
  })
})
