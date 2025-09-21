import { describe, expect, it } from "vitest"
import { snakeToCamelCase } from "@/utils/snakeToCamelCase"
import { toCamelCase } from "@/utils/toCamelCase"

describe("snakeToCamelCase", () => {
  it("should convert snake_case to camelCase", () => {
    expect(snakeToCamelCase("snake_case")).toBe("snakeCase")
    expect(snakeToCamelCase("another_test_string")).toBe("anotherTestString")
    expect(snakeToCamelCase("simple")).toBe("simple")
    expect(snakeToCamelCase("")).toBe("")
  })
})

describe("toCamelCase", () => {
  it("should recursively convert object keys to camelCase", () => {
    const input = {
      snake_case_key: "value",
      nested_object: {
        another_snake_key: "nested_value"
      },
      array_of_objects: [{ item_one: "one" }, { item_two: "two" }]
    }

    const expected = {
      snakeCaseKey: "value",
      nestedObject: {
        anotherSnakeKey: "nested_value"
      },
      arrayOfObjects: [{ itemOne: "one" }, { itemTwo: "two" }]
    }

    expect(toCamelCase(input)).toEqual(expected)
  })

  it("should handle primitive values", () => {
    expect(toCamelCase("string")).toBe("string")
    expect(toCamelCase(123)).toBe(123)
    expect(toCamelCase(true)).toBe(true)
    expect(toCamelCase(null)).toBe(null)
    expect(toCamelCase(undefined)).toBe(undefined)
  })

  it("should handle arrays", () => {
    const input = ["item1", "item2", { snake_key: "value" }]
    const expected = ["item1", "item2", { snakeKey: "value" }]
    expect(toCamelCase(input)).toEqual(expected)
  })
})
