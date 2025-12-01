import { describe, it, expect } from "vitest"
import { toKebabCase } from "@/utils/toKebabCase"

describe("toKebabCase", () => {
  it("should convert camelCase to kebab-case", () => {
    expect(toKebabCase("camelCase")).toBe("camel-case")
  })

  it("should convert multiple capital letters", () => {
    expect(toKebabCase("imageMode")).toBe("image-mode")
    expect(toKebabCase("imageSizes")).toBe("image-sizes")
  })

  it("should handle already lowercase strings", () => {
    expect(toKebabCase("lowercase")).toBe("lowercase")
  })

  it("should handle strings with multiple consecutive uppercase letters correctly", () => {
    expect(toKebabCase("variantId")).toBe("variant-id")
  })

  it("should handle empty string", () => {
    expect(toKebabCase("")).toBe("")
  })
})
