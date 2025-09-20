import { describe, it, expect } from "vitest"
import { assertRequired } from "@/utils/assertRequired"

describe("assertRequired", () => {
  it("throws error when required property is undefined", () => {
    const obj = { a: "value", b: undefined }
    expect(() => assertRequired(obj, "b")).toThrow("Property b is required.")
  })

  it("throws error when required property is null", () => {
    const obj = { a: "value", b: null }
    expect(() => assertRequired(obj, "b")).toThrow("Property b is required.")
  })

  it("does not throw when all required properties are present", () => {
    const obj = { a: "value", b: "another value" }
    expect(() => assertRequired(obj, "a", "b")).not.toThrow()
  })

  it("throws error for multiple missing properties", () => {
    const obj = { a: "value", b: undefined, c: null }
    expect(() => assertRequired(obj, "b")).toThrow("Property b is required.")
    expect(() => assertRequired(obj, "c")).toThrow("Property c is required.")
  })
})
