import { describe, it, expect } from "vitest"
import { toCamelCase } from "@/utils/toCamelCase"

describe("toCamelCase", () => {
  it("converts kebab-case to camelCase", () => {
    expect(toCamelCase("hello-world")).toBe("helloWorld")
  })

  it("converts multiple dashes", () => {
    expect(toCamelCase("hello-world-test")).toBe("helloWorldTest")
  })

  it("returns same string if no dashes", () => {
    expect(toCamelCase("hello")).toBe("hello")
  })

  it("handles empty string", () => {
    expect(toCamelCase("")).toBe("")
  })

  it("only converts lowercase letters after dash", () => {
    expect(toCamelCase("hello-World")).toBe("hello-World")
  })
})
