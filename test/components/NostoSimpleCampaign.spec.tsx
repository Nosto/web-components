/** @jsx createElement */
import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from "vitest"
import {
  NostoSimpleCampaign,
  loadSimpleCampaign,
  renderCampaign,
  renderGrid,
  createProductElement
} from "@/components/NostoSimpleCampaign/NostoSimpleCampaign"
import { mockNostoRecs } from "../mockNostoRecs"
import { addHandlers } from "../msw.setup"
import { createElement } from "../utils/jsx"
import { JSONResult } from "@nosto/nosto-js/client"
import { http, HttpResponse } from "msw"

describe("NostoSimpleCampaign", () => {
  let campaign: NostoSimpleCampaign

  beforeAll(() => {
    if (!customElements.get("nosto-simple-campaign")) {
      customElements.define("nosto-simple-campaign", NostoSimpleCampaign)
    }
  })

  beforeEach(() => {
    document.body.innerHTML = ""
    // Add MSW handlers for dynamic card requests
    addHandlers(
      http.get("/products/:handle", ({ params }) => {
        const handle = params.handle as string
        return HttpResponse.text(`<div class="product-card">${handle}</div>`, { status: 200 })
      })
    )
  })

  afterEach(() => {
    campaign?.remove?.()
  })

  it("should be defined as a custom element", () => {
    expect(customElements.get("nosto-simple-campaign")).toBeDefined()
  })

  it("should throw in connectedCallback if placement is missing", async () => {
    campaign = (<nosto-simple-campaign />) as NostoSimpleCampaign
    await expect(campaign.connectedCallback()).rejects.toThrow(
      "placement attribute is required for NostoSimpleCampaign"
    )
  })

  it("should load campaign and render in grid mode by default", async () => {
    const mockResult = {
      products: [
        { name: "Product 1", price: "$10", image_url: "https://example.com/img1.jpg", url: "/products/product-1" },
        { name: "Product 2", price: "$20", image_url: "https://example.com/img2.jpg", url: "/products/product-2" }
      ]
    }
    const { mockBuilder } = mockNostoRecs({ "test-placement": mockResult })

    campaign = (<nosto-simple-campaign placement="test-placement" />) as NostoSimpleCampaign
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    expect(mockBuilder.load).toHaveBeenCalledWith()
    expect(campaign.querySelector(".nosto-grid")).toBeTruthy()
    expect(campaign.querySelectorAll(".nosto-product")).toHaveLength(2)
    expect(campaign.hasAttribute("loading")).toBe(false)
  })

  it("should render campaign in carousel mode when mode=carousel", async () => {
    const mockResult = {
      products: [{ name: "Product 1", price: "$10", url: "/products/product-1" }]
    }
    mockNostoRecs({ "test-placement": mockResult })

    campaign = (<nosto-simple-campaign placement="test-placement" mode="carousel" />) as NostoSimpleCampaign
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    expect(campaign.querySelector(".nosto-carousel")).toBeTruthy()
    expect(campaign.querySelector(".nosto-grid")).toBeFalsy()
  })

  it("should render campaign in bundle mode when mode=bundle", async () => {
    const mockResult = {
      products: [{ name: "Product 1", price: "$10", url: "/products/product-1" }]
    }
    mockNostoRecs({ "test-placement": mockResult })

    campaign = (<nosto-simple-campaign placement="test-placement" mode="bundle" />) as NostoSimpleCampaign
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    expect(campaign.querySelector(".nosto-bundle")).toBeTruthy()
    expect(campaign.querySelector(".nosto-grid")).toBeFalsy()
  })

  it("should handle empty campaign results gracefully", async () => {
    const { mockBuilder } = mockNostoRecs({ "test-placement": { products: [] } })

    campaign = (<nosto-simple-campaign placement="test-placement" />) as NostoSimpleCampaign
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    expect(mockBuilder.load).toHaveBeenCalledWith()
    expect(campaign.innerHTML).toBe("")
    expect(campaign.hasAttribute("loading")).toBe(false)
  })

  it("should use NostoDynamicCard when card attribute is provided", async () => {
    const mockResult = {
      products: [{ name: "Product 1", price: "$10", handle: "test-handle" }]
    }
    mockNostoRecs({ "test-placement": mockResult })

    campaign = (<nosto-simple-campaign placement="test-placement" card="product-card" />) as NostoSimpleCampaign
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    const dynamicCard = campaign.querySelector("nosto-dynamic-card")
    expect(dynamicCard).toBeTruthy()
    expect(dynamicCard?.getAttribute("handle")).toBe("test-handle")
    expect(dynamicCard?.getAttribute("template")).toBe("product-card")
  })

  it("should fall back to basic product display when card attribute is provided but no handle found", async () => {
    const mockResult = {
      products: [{ name: "Product 1", price: "$10" }]
    }
    mockNostoRecs({ "test-placement": mockResult })

    campaign = (<nosto-simple-campaign placement="test-placement" card="product-card" />) as NostoSimpleCampaign
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    expect(campaign.querySelector("nosto-dynamic-card")).toBeFalsy()
    expect(campaign.querySelector(".nosto-product")).toBeTruthy()
    expect(campaign.querySelector(".nosto-product")?.textContent).toContain("Product 1")
  })

  it("should handle loading state correctly", async () => {
    const mockResult = { products: [{ name: "Product 1" }] }
    mockNostoRecs({ "test-placement": mockResult })

    campaign = (<nosto-simple-campaign placement="test-placement" />) as NostoSimpleCampaign
    document.body.appendChild(campaign)

    const loadingPromise = campaign.connectedCallback()
    expect(campaign.hasAttribute("loading")).toBe(true)

    await loadingPromise
    expect(campaign.hasAttribute("loading")).toBe(false)
  })
})

describe("NostoSimpleCampaign utility functions", () => {
  describe("createProductElement", () => {
    let element: NostoSimpleCampaign

    beforeEach(() => {
      element = document.createElement("nosto-simple-campaign") as NostoSimpleCampaign
    })

    it("should create NostoDynamicCard when card attribute and handle provided", () => {
      element.setAttribute("card", "product-card")
      element.card = "product-card"

      const product = {
        name: "Test Product",
        handle: "test-handle"
      }

      const result = createProductElement(element, product)

      expect(result.tagName.toLowerCase()).toBe("nosto-dynamic-card")
      expect(result.getAttribute("handle")).toBe("test-handle")
      expect(result.getAttribute("template")).toBe("product-card")
    })

    it("should create basic product element when no card attribute", () => {
      const product = {
        name: "Test Product",
        price: 25,
        image_url: "https://example.com/image.jpg"
      }

      const result = createProductElement(element, product)

      expect(result.tagName.toLowerCase()).toBe("div")
      expect(result.className).toBe("nosto-product")
      expect(result.innerHTML).toContain("Test Product")
      expect(result.innerHTML).toContain("25")
      expect(result.innerHTML).toContain('src="https://example.com/image.jpg"')
    })

    it("should handle product with missing optional fields", () => {
      const product = { name: "Basic Product" }

      const result = createProductElement(element, product)

      expect(result.className).toBe("nosto-product")
      expect(result.innerHTML).toContain("Basic Product")
      expect(result.innerHTML).not.toContain("<img")
      expect(result.innerHTML).not.toContain("price")
    })
  })

  describe("renderCampaign", () => {
    let element: NostoSimpleCampaign
    let mockCampaign: JSONResult

    beforeEach(() => {
      element = document.createElement("nosto-simple-campaign") as NostoSimpleCampaign
      mockCampaign = {
        products: [
          { name: "Product 1", price: 10 },
          { name: "Product 2", price: 20 }
        ]
      } as unknown as JSONResult
    })

    it("should call renderGrid for grid mode", async () => {
      const renderGridSpy = vi.fn().mockImplementation(renderGrid)
      vi.doMock("@/components/NostoSimpleCampaign/NostoSimpleCampaign", async () => ({
        ...(await vi.importActual("@/components/NostoSimpleCampaign/NostoSimpleCampaign")),
        renderGrid: renderGridSpy
      }))

      await renderCampaign(element, mockCampaign, "grid")

      expect(element.querySelector(".nosto-grid")).toBeTruthy()
    })

    it("should call renderCarousel for carousel mode", async () => {
      await renderCampaign(element, mockCampaign, "carousel")

      expect(element.querySelector(".nosto-carousel")).toBeTruthy()
    })

    it("should call renderBundle for bundle mode", async () => {
      await renderCampaign(element, mockCampaign, "bundle")

      expect(element.querySelector(".nosto-bundle")).toBeTruthy()
    })

    it("should default to grid for unknown mode", async () => {
      await renderCampaign(element, mockCampaign, "unknown")

      expect(element.querySelector(".nosto-grid")).toBeTruthy()
    })
  })

  describe("loadSimpleCampaign", () => {
    let element: NostoSimpleCampaign

    beforeEach(() => {
      element = document.createElement("nosto-simple-campaign") as NostoSimpleCampaign
      element.placement = "test-placement"
    })

    it("should handle API errors gracefully", async () => {
      const { mockBuilder } = mockNostoRecs({})
      mockBuilder.load = vi.fn().mockRejectedValue(new Error("API Error"))

      await expect(loadSimpleCampaign(element)).rejects.toThrow("API Error")
      expect(element.hasAttribute("loading")).toBe(false)
    })

    it("should handle null campaign results", async () => {
      mockNostoRecs({ "test-placement": { products: [] } })

      await loadSimpleCampaign(element)

      expect(element.innerHTML).toBe("")
      expect(element.hasAttribute("loading")).toBe(false)
    })
  })
})
