import { describe, expect, it } from "vitest"
import { getContext } from "@/templating/context"

describe("getContext", () => {
  it("should extend context with camelCase conversion", () => {
    const context = { foo: "bar" }
    const result = getContext(context)

    expect(result).toHaveProperty("foo", "bar")
    expect(result).not.toHaveProperty("thumb")
    expect(result).not.toHaveProperty("unpic")
  })

  it("should convert object keys to camelCase", () => {
    const context = {
      some_key: "value",
      nested_object: {
        another_key: "another_value"
      },
      array_of_objects: [{ item_one: "one" }, { item_two: "two" }]
    }

    const result = getContext(context)

    expect(result).toEqual({
      someKey: "value",
      nestedObject: {
        anotherKey: "another_value"
      },
      arrayOfObjects: [{ itemOne: "one" }, { itemTwo: "two" }]
    })
  })
})
