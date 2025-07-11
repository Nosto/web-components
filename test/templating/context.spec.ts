import { describe, expect, it } from "vitest"
import { getContext } from "@/templating/context"

describe("getContext", () => {
  it("should extend context with thumb and unpic", () => {
    const context = { foo: "bar" }
    const result = getContext(context)

    expect(result).toHaveProperty("foo", "bar")
    expect(result).toHaveProperty("thumb")
    expect(result).toHaveProperty("unpic")
  })

  it("should provide thumb function that transforms Shopify CDN URLs", () => {
    const context = getContext({})
    const url = "https://cdn.shopify.com/s/files/1/0000/1111/2222/products/product.jpg"
    const operations = { width: 200, height: 200 }

    // Assuming the Shopify thumb transformation appends query parameters for dimensions
    const transformedUrl = context.thumb(url, operations)
    expect(transformedUrl).toBe(
      "https://cdn.shopify.com/s/files/1/0000/1111/2222/products/product.jpg?width=200&height=200"
    )
  })

  it("provide img attributes for unpic", () => {
    const context = getContext({})
    const url = "https://cdn.shopify.com/s/files/1/0000/1111/2222/products/product.jpg"
    const imgAttributes = context.unpic({ src: url, width: 200, height: 200 })
    expect(imgAttributes).toEqual({
      decoding: "async",
      height: undefined,
      loading: "lazy",
      sizes: "(min-width: 200px) 200px, 100vw",
      src: "https://cdn.shopify.com/s/files/1/0000/1111/2222/products/product.jpg?width=200&height=200",
      srcset:
        "https://cdn.shopify.com/s/files/1/0000/1111/2222/products/product.jpg?width=200&height=200 200w," +
        "\nhttps://cdn.shopify.com/s/files/1/0000/1111/2222/products/product.jpg?width=400&height=400 400w",
      style: {
        aspectRatio: "1",
        maxHeight: "200px",
        maxWidth: "200px",
        objectFit: "cover",
        width: "100%"
      },
      width: undefined
    })
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
      arrayOfObjects: [{ itemOne: "one" }, { itemTwo: "two" }],
      thumb: expect.any(Function),
      unpic: expect.any(Function)
    })
  })
})
