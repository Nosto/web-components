import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  fetchSectionMarkup,
  fetchProductSectionMarkup,
  extractSectionContent,
  replaceTitleInMarkup,
  getCampaignSectionMarkup
} from "@/utils"
import { JSONResult } from "@nosto/nosto-js/client"
import { addHandlers } from "../msw.setup"
import { http, HttpResponse } from "msw"

describe("sectionRendering utils", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("fetchSectionMarkup", () => {
    it("fetches section markup with correct URL parameters", async () => {
      const mockHtml = "<section>Test Section</section>"
      addHandlers(
        http.get("/search", ({ request }) => {
          const url = new URL(request.url)
          expect(url.searchParams.get("section_id")).toBe("test-section")
          expect(url.searchParams.get("q")).toBe("product1:product2")
          return HttpResponse.text(mockHtml)
        })
      )

      const result = await fetchSectionMarkup("test-section", "product1:product2")
      expect(result).toBe(mockHtml)
    })

    it("throws error when fetch fails", async () => {
      addHandlers(http.get("/search", () => HttpResponse.text("Error", { status: 500 })))

      await expect(fetchSectionMarkup("missing-section", "query")).rejects.toThrow(
        "Failed to fetch section missing-section"
      )
    })
  })

  describe("fetchProductSectionMarkup", () => {
    it("fetches product section markup with correct parameters", async () => {
      const mockHtml = "<div>Product Section</div>"
      addHandlers(
        http.get("/products/:handle", ({ request, params }) => {
          const url = new URL(request.url)
          expect(params.handle).toBe("test-product")
          expect(url.searchParams.get("section_id")).toBe("product-section")
          expect(url.searchParams.get("variant")).toBe("123")
          return HttpResponse.text(mockHtml)
        })
      )

      const result = await fetchProductSectionMarkup("test-product", "product-section", "123")
      expect(result).toBe(mockHtml)
    })

    it("fetches without variant when not provided", async () => {
      const mockHtml = "<div>Product Section</div>"
      addHandlers(
        http.get("/products/:handle", ({ request, params }) => {
          const url = new URL(request.url)
          expect(params.handle).toBe("test-product")
          expect(url.searchParams.get("section_id")).toBe("product-section")
          expect(url.searchParams.get("variant")).toBeNull()
          return HttpResponse.text(mockHtml)
        })
      )

      const result = await fetchProductSectionMarkup("test-product", "product-section")
      expect(result).toBe(mockHtml)
    })

    it("throws error when fetch fails", async () => {
      addHandlers(http.get("/products/:handle", () => HttpResponse.text("Error", { status: 404 })))

      await expect(fetchProductSectionMarkup("missing-product", "section")).rejects.toThrow(
        "Failed to fetch product data"
      )
    })
  })

  describe("extractSectionContent", () => {
    it("extracts content from first body element", () => {
      const html = "<body><section><div>Content</div></section></body>"
      const result = extractSectionContent(html)
      expect(result).toBe("<div>Content</div>")
    })

    it("returns original html when no body element found", () => {
      const html = "<div>No body</div>"
      const result = extractSectionContent(html)
      // When DOMParser parses HTML without body tag, it will wrap content in body
      // and our function extracts from firstElementChild, so it returns the div content
      expect(result).toBe("No body")
    })

    it("handles empty or malformed html", () => {
      const html = ""
      const result = extractSectionContent(html)
      expect(result).toBe(html)
    })
  })

  describe("replaceTitleInMarkup", () => {
    it("replaces title in element with nosto-title attribute", () => {
      const html = "<body><div><h2 nosto-title>Old Title</h2><p>Content</p></div></body>"
      const result = replaceTitleInMarkup(html, "New Title")
      expect(result).toContain("New Title")
      expect(result).not.toContain("Old Title")
    })

    it("does not replace title in regular elements", () => {
      const html = "<body><div><h2>Regular Title</h2><p>Content</p></div></body>"
      const result = replaceTitleInMarkup(html, "New Title")
      expect(result).toContain("Regular Title")
      expect(result).not.toContain("New Title")
    })

    it("returns original html when no nosto-title element found", () => {
      const html = "<body><div><p>No title element</p></div></body>"
      const originalExtracted = extractSectionContent(html)
      const result = replaceTitleInMarkup(html, "New Title")
      expect(result).toBe(originalExtracted)
    })
  })

  describe("getCampaignSectionMarkup", () => {
    it("gets campaign section markup and processes title", async () => {
      const mockHtml = "<section><div><h2 nosto-title>Default Title</h2><div>Product Content</div></div></section>"
      const element = { section: "campaign-section" }
      const rec = {
        products: [{ handle: "product1" }, { handle: "product2" }],
        title: "Custom Campaign Title"
      } as JSONResult

      addHandlers(
        http.get("/search", ({ request }) => {
          const url = new URL(request.url)
          expect(url.searchParams.get("section_id")).toBe("campaign-section")
          expect(url.searchParams.get("q")).toBe("product1:product2")
          return HttpResponse.text(mockHtml)
        })
      )

      const result = await getCampaignSectionMarkup(element, rec)
      expect(result).toContain("Custom Campaign Title")
      expect(result).not.toContain("Default Title")
      expect(result).toContain("Product Content")
    })

    it("gets campaign section markup without title replacement", async () => {
      const mockHtml = "<section><div><h2>Static Title</h2><div>Product Content</div></div></section>"
      const element = { section: "campaign-section" }
      const rec = {
        products: [{ handle: "product1" }]
      } as JSONResult

      addHandlers(http.get("/search", () => HttpResponse.text(mockHtml)))

      const result = await getCampaignSectionMarkup(element, rec)
      expect(result).toContain("Static Title")
      expect(result).toContain("Product Content")
    })
  })
})
