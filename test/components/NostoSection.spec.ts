import { describe, it, beforeEach, expect, vi } from "vitest"
import { mockNostojs } from "@nosto/nosto-js/testing"
import { NostoSection } from "@/components/NostoSection/NostoSection"
import { JSONProduct, RequestBuilder } from "@nosto/nosto-js/client"
import { addHandlers } from "../msw.setup"
import { http, HttpResponse } from "msw"

// TODO replace with vi fake timers
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
    const { attributeProductClicksInCampaign, load, mockBuilder } = mockNosto({ products })

    const sectionHTML = `<div class=\"wrapper\"><div class=\"inner\">Rendered Section</div></div>`
    addHandlers(
      http.get("/search", () => {
        return HttpResponse.text(`<section>${sectionHTML}</section>`)
      })
    )

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

    expect(el.innerHTML).toBe(`<div class=\"wrapper\"><div class=\"inner\">Rendered Section</div></div>`)
    expect(attributeProductClicksInCampaign).toHaveBeenCalledWith(el, { products })
    expect(el.hasAttribute("loading")).toBe(false)
  })

  it("throws when section fetch fails", async () => {
    mockNosto({ products: [{ handle: "x" }] })

    addHandlers(http.get("/search", () => HttpResponse.text("Error", { status: 500 })))

    const el = new NostoSection()
    el.placement = "placement1"
    el.section = "missing-section"

    await expect(el.connectedCallback()).rejects.toThrow("Failed to fetch section missing-section")
    expect(el.hasAttribute("loading")).toBe(false)
  })
})

function mockNosto(result: { products: Partial<JSONProduct>[] }) {
  const load = vi.fn().mockResolvedValue({
    recommendations: {
      placement1: result
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

  const api = {
    createRecommendationRequest: () => mockBuilder as RequestBuilder,
    attributeProductClicksInCampaign
  }
  mockNostojs(api)

  return {
    load,
    mockBuilder,
    attributeProductClicksInCampaign
  }
}
