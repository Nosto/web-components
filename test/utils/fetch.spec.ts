import { describe, it, expect, vi, afterEach } from "vitest"
import { getText, getJSON } from "@/utils/fetch"
import { addHandlers } from "../msw.setup"
import { http, HttpResponse } from "msw"

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
  })
})
