import { describe, it, expect, vi, afterEach } from "vitest"
import { getText, getJSON, postJSON } from "@/utils/fetch"
import { addHandlers } from "../msw.setup"
import { http, HttpResponse } from "msw"

function createCallCountHandler(url: string, responseCallback: (count: number) => Response) {
  let callCount = 0

  const handler = http.get(url, () => {
    callCount++
    return responseCallback(callCount)
  })

  const getCallCount = () => callCount

  return { handler, getCallCount }
}

describe("fetch facade", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("getText", () => {
    it("should fetch URL and return text content", async () => {
      addHandlers(
        http.get("https://example.com/test", () => {
          return HttpResponse.text("Hello, World!")
        })
      )

      const result = await getText("https://example.com/test")
      expect(result).toBe("Hello, World!")
    })

    it("should throw error when fetch response is not ok", async () => {
      addHandlers(
        http.get("https://example.com/missing", () => {
          return HttpResponse.text("Not Found", { status: 404 })
        })
      )

      await expect(getText("https://example.com/missing")).rejects.toThrow(
        "Failed to fetch https://example.com/missing: 404 Not Found"
      )
    })

    it("should cache responses when cached option is true", async () => {
      const { handler, getCallCount } = createCallCountHandler("https://example.com/cached", count =>
        HttpResponse.text(`Response ${count}`)
      )

      addHandlers(handler)

      const result1 = await getText("https://example.com/cached", { cached: true })
      const result2 = await getText("https://example.com/cached", { cached: true })

      expect(result1).toBe("Response 1")
      expect(result2).toBe("Response 1")
      expect(getCallCount()).toBe(1)
    })

    it("should not cache responses when cached option is false or not provided", async () => {
      const { handler, getCallCount } = createCallCountHandler("https://example.com/uncached", count =>
        HttpResponse.text(`Response ${count}`)
      )

      addHandlers(handler)

      const result1 = await getText("https://example.com/uncached")
      const result2 = await getText("https://example.com/uncached", { cached: false })

      expect(result1).toBe("Response 1")
      expect(result2).toBe("Response 2")
      expect(getCallCount()).toBe(2)
    })

    it("should maintain separate caches for different URLs", async () => {
      addHandlers(
        http.get("https://example.com/url1", () => {
          return HttpResponse.text("Content 1")
        }),
        http.get("https://example.com/url2", () => {
          return HttpResponse.text("Content 2")
        })
      )

      const result1 = await getText("https://example.com/url1", { cached: true })
      const result2 = await getText("https://example.com/url2", { cached: true })

      expect(result1).toBe("Content 1")
      expect(result2).toBe("Content 2")
    })
  })

  describe("getJSON", () => {
    it("should fetch URL and return JSON object", async () => {
      const mockData = { message: "Hello", count: 42 }
      addHandlers(
        http.get("https://api.example.com/data", () => {
          return HttpResponse.json(mockData)
        })
      )

      const result = await getJSON("https://api.example.com/data")
      expect(result).toEqual(mockData)
    })

    it("should throw error when fetch response is not ok", async () => {
      addHandlers(
        http.get("https://api.example.com/error", () => {
          return HttpResponse.json({ error: "Server Error" }, { status: 500 })
        })
      )

      await expect(getJSON("https://api.example.com/error")).rejects.toThrow(
        "Failed to fetch https://api.example.com/error: 500 Internal Server Error"
      )
    })

    it("should cache JSON responses when cached option is true", async () => {
      const { handler, getCallCount } = createCallCountHandler("https://api.example.com/cached", count =>
        HttpResponse.json({ count, message: `Response ${count}` })
      )

      addHandlers(handler)

      const result1 = await getJSON("https://api.example.com/cached", { cached: true })
      const result2 = await getJSON("https://api.example.com/cached", { cached: true })

      expect(result1).toEqual({ count: 1, message: "Response 1" })
      expect(result2).toEqual({ count: 1, message: "Response 1" })
      expect(getCallCount()).toBe(1)
    })

    it("should not cache JSON responses when cached option is false or not provided", async () => {
      const { handler, getCallCount } = createCallCountHandler("https://api.example.com/uncached", count =>
        HttpResponse.json({ count, message: `Response ${count}` })
      )

      addHandlers(handler)

      const result1 = await getJSON("https://api.example.com/uncached")
      const result2 = await getJSON("https://api.example.com/uncached", { cached: false })

      expect(result1).toEqual({ count: 1, message: "Response 1" })
      expect(result2).toEqual({ count: 2, message: "Response 2" })
      expect(getCallCount()).toBe(2)
    })

    it("should maintain separate caches for getText and getJSON", async () => {
      addHandlers(
        http.get("https://example.com/mixed", () => {
          return HttpResponse.text('{"message": "Hello"}')
        })
      )

      const textResult = await getText("https://example.com/mixed", { cached: true })
      const jsonResult = await getJSON("https://example.com/mixed", { cached: true })

      expect(textResult).toBe('{"message": "Hello"}')
      expect(jsonResult).toEqual({ message: "Hello" })
    })
  })

  describe("postJSON", () => {
    it("should POST JSON body and return JSON response", async () => {
      const requestBody = { name: "Test", value: 42 }
      const responseBody = { success: true, id: 123 }

      addHandlers(
        http.post("https://api.example.com/data", async ({ request }) => {
          const body = await request.json()
          expect(body).toEqual(requestBody)
          return HttpResponse.json(responseBody)
        })
      )

      const result = await postJSON("https://api.example.com/data", requestBody)
      expect(result).toEqual(responseBody)
    })

    it("should send Content-Type header as application/json", async () => {
      let contentType: string | null = null

      addHandlers(
        http.post("https://api.example.com/test", async ({ request }) => {
          contentType = request.headers.get("Content-Type")
          return HttpResponse.json({ ok: true })
        })
      )

      await postJSON("https://api.example.com/test", { test: "data" })
      expect(contentType).toBe("application/json")
    })

    it("should throw error when POST response is not ok", async () => {
      addHandlers(
        http.post("https://api.example.com/error", () => {
          return HttpResponse.json({ error: "Bad Request" }, { status: 400 })
        })
      )

      await expect(postJSON("https://api.example.com/error", { data: "test" })).rejects.toThrow(
        "Failed to fetch https://api.example.com/error: 400 Bad Request"
      )
    })

    it("should cache POST responses when cached option is true", async () => {
      let callCount = 0
      const requestBody = { query: "test" }

      addHandlers(
        http.post("https://api.example.com/graphql", () => {
          callCount++
          return HttpResponse.json({ count: callCount, data: "response" })
        })
      )

      const result1 = await postJSON("https://api.example.com/graphql", requestBody, { cached: true })
      const result2 = await postJSON("https://api.example.com/graphql", requestBody, { cached: true })

      expect(result1).toEqual({ count: 1, data: "response" })
      expect(result2).toEqual({ count: 1, data: "response" })
      expect(callCount).toBe(1)
    })

    it("should not cache POST responses when cached option is false or not provided", async () => {
      let callCount = 0
      const requestBody = { query: "test" }

      addHandlers(
        http.post("https://api.example.com/graphql", () => {
          callCount++
          return HttpResponse.json({ count: callCount, data: "response" })
        })
      )

      const result1 = await postJSON("https://api.example.com/graphql", requestBody)
      const result2 = await postJSON("https://api.example.com/graphql", requestBody, { cached: false })

      expect(result1).toEqual({ count: 1, data: "response" })
      expect(result2).toEqual({ count: 2, data: "response" })
      expect(callCount).toBe(2)
    })

    it("should cache based on both URL and body content", async () => {
      let callCount = 0

      addHandlers(
        http.post("https://api.example.com/graphql", () => {
          callCount++
          return HttpResponse.json({ count: callCount })
        })
      )

      // Same URL, different body - should not use cache
      const result1 = await postJSON("https://api.example.com/graphql", { query: "first" }, { cached: true })
      const result2 = await postJSON("https://api.example.com/graphql", { query: "second" }, { cached: true })

      expect(result1).toEqual({ count: 1 })
      expect(result2).toEqual({ count: 2 })
      expect(callCount).toBe(2)

      // Same URL and body - should use cache
      const result3 = await postJSON("https://api.example.com/graphql", { query: "first" }, { cached: true })
      expect(result3).toEqual({ count: 1 })
      expect(callCount).toBe(2)
    })

    it("should handle complex nested body structures", async () => {
      const complexBody = {
        query: "{ product { title } }",
        variables: {
          handle: "test-product",
          options: ["size", "color"],
          metadata: { nested: { value: 123 } }
        }
      }

      addHandlers(
        http.post("https://api.example.com/graphql", async ({ request }) => {
          const body = await request.json()
          expect(body).toEqual(complexBody)
          return HttpResponse.json({ success: true })
        })
      )

      const result = await postJSON("https://api.example.com/graphql", complexBody)
      expect(result).toEqual({ success: true })
    })

    it("should maintain separate caches for GET and POST requests", async () => {
      const url = "https://api.example.com/data"

      addHandlers(
        http.get(url, () => {
          return HttpResponse.json({ method: "GET" })
        }),
        http.post(url, () => {
          return HttpResponse.json({ method: "POST" })
        })
      )

      const getResult = await getJSON(url, { cached: true })
      const postResult = await postJSON(url, { test: "data" }, { cached: true })

      expect(getResult).toEqual({ method: "GET" })
      expect(postResult).toEqual({ method: "POST" })
    })

    it("should support TypeScript generic types", async () => {
      interface TestResponse {
        id: number
        name: string
      }

      addHandlers(
        http.post("https://api.example.com/typed", () => {
          return HttpResponse.json({ id: 1, name: "Test" })
        })
      )

      const result = await postJSON<TestResponse>("https://api.example.com/typed", { query: "test" })
      expect(result.id).toBe(1)
      expect(result.name).toBe("Test")
    })
  })
})
