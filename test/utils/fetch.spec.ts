import { describe, it, expect, vi, afterEach } from "vitest"
import { getText, getJSON } from "@/utils/fetch"
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

      const result = await getJSON({ url: "https://api.example.com/data" })
      expect(result).toEqual(mockData)
    })

    it("should throw error when fetch response is not ok", async () => {
      addHandlers(
        http.get("https://api.example.com/error", () => {
          return HttpResponse.json({ error: "Server Error" }, { status: 500 })
        })
      )

      await expect(getJSON({ url: "https://api.example.com/error" })).rejects.toThrow(
        "Failed to fetch https://api.example.com/error: 500 Internal Server Error"
      )
    })

    it("should cache JSON responses when cached option is true", async () => {
      const { handler, getCallCount } = createCallCountHandler("https://api.example.com/cached", count =>
        HttpResponse.json({ count, message: `Response ${count}` })
      )

      addHandlers(handler)

      const result1 = await getJSON({ url: "https://api.example.com/cached" }, { cached: true })
      const result2 = await getJSON({ url: "https://api.example.com/cached" }, { cached: true })

      expect(result1).toEqual({ count: 1, message: "Response 1" })
      expect(result2).toEqual({ count: 1, message: "Response 1" })
      expect(getCallCount()).toBe(1)
    })

    it("should not cache JSON responses when cached option is false or not provided", async () => {
      const { handler, getCallCount } = createCallCountHandler("https://api.example.com/uncached", count =>
        HttpResponse.json({ count, message: `Response ${count}` })
      )

      addHandlers(handler)

      const result1 = await getJSON({ url: "https://api.example.com/uncached" })
      const result2 = await getJSON({ url: "https://api.example.com/uncached" }, { cached: false })

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
      const jsonResult = await getJSON({ url: "https://example.com/mixed" }, { cached: true })

      expect(textResult).toBe('{"message": "Hello"}')
      expect(jsonResult).toEqual({ message: "Hello" })
    })
  })
})
