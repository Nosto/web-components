import { describe, it, beforeEach, expect, vi } from "vitest"
import { mockNostojs } from "@nosto/nosto-js/testing"
import { NostoSection } from "@/components/NostoSection/NostoSection"
import { RequestBuilder } from "@nosto/nosto-js/client"

// Helper to wait beyond orchestrator batch delay (50ms)
async function flushBatches() {
  await new Promise(r => setTimeout(r, 60))
}

describe("NostoSection", () => {
  beforeEach(() => {
    document.body.innerHTML = ""
    vi.restoreAllMocks()
  })

  it("should be defined as a custom element", () => {
    expect(customElements.get("nosto-section")).toBeDefined()
  })

  it("renders section markup from product handles and attributes product clicks", async () => {
    const products = [{ handle: "product-a" }, { handle: "product-b" }]

    const load = vi.fn().mockResolvedValue({
      recommendations: {
        placement1: { products }
      }
    })

    const mockBuilder: Partial<RequestBuilder> = {
      disableCampaignInjection: () => mockBuilder as RequestBuilder,
      setElements: vi.fn(() => mockBuilder as RequestBuilder),
      setResponseMode: vi.fn(() => mockBuilder as RequestBuilder),
      setProducts: vi.fn(() => mockBuilder as RequestBuilder),
      load
    }

    const attributeProductClicksInCampaign = vi.fn()

    mockNostojs({
      createRecommendationRequest: () => mockBuilder as RequestBuilder,
      attributeProductClicksInCampaign
    })

    const sectionHTML = `<div class=\"wrapper\"><div class=\"inner\">Rendered Section</div></div>`
    const response = {
      ok: true,
      text: vi.fn().mockResolvedValue(`<section>${sectionHTML}</section>`)
    }
    global.fetch = vi.fn().mockResolvedValue(response as unknown as Response)

    const el = new NostoSection()
    el.placement = "placement1"
    el.section = "featured-section"
    document.body.appendChild(el)

    await el.connectedCallback()
    await flushBatches()

    expect(load).toHaveBeenCalled()
    // Batching may invoke setElements with duplicates; ensure placement present
    const callArg = (mockBuilder.setElements as unknown as { mock: { calls: [string[]][] } }).mock.calls[0][0]
    expect(callArg).toContain("placement1")

    const expectedUrl = new URL("/search", window.location.href)
    expectedUrl.searchParams.set("section_id", "featured-section")
    expectedUrl.searchParams.set("q", "product-a:product-b")
    // First arg to fetch is either Request|string
    const firstCallArg = (global.fetch as unknown as { mock: { calls: [unknown[]][] } }).mock.calls[0][0]
    const actual = firstCallArg instanceof URL ? firstCallArg.href : String(firstCallArg)
    expect(actual).toBe(expectedUrl.href)
    expect(el.innerHTML).toBe(`<div class=\"wrapper\"><div class=\"inner\">Rendered Section</div></div>`)
    expect(attributeProductClicksInCampaign).toHaveBeenCalledWith(el, { products })
    expect(el.hasAttribute("loading")).toBe(false)
  })

  it("throws when section fetch fails", async () => {
    const products = [{ handle: "x" }]
    const load = vi.fn().mockResolvedValue({
      recommendations: {
        badplacement: { products }
      }
    })
    const mockBuilder: Partial<RequestBuilder> = {
      disableCampaignInjection: () => mockBuilder as RequestBuilder,
      setElements: () => mockBuilder as RequestBuilder,
      setResponseMode: () => mockBuilder as RequestBuilder,
      setProducts: () => mockBuilder as RequestBuilder,
      load
    }
    mockNostojs({
      createRecommendationRequest: () => mockBuilder as RequestBuilder,
      attributeProductClicksInCampaign: vi.fn()
    })
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      text: vi.fn().mockResolvedValue("")
    } as unknown as Response)

    const el = new NostoSection()
    el.placement = "badplacement"
    el.section = "missing-section"

    await expect(el.connectedCallback()).rejects.toThrow("Failed to fetch section missing-section")
    expect(el.hasAttribute("loading")).toBe(false)
  })
})
