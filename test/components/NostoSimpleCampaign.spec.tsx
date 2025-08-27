/** @jsx createElement */
import { describe, it, expect, beforeAll, beforeEach, afterEach } from "vitest"
import { NostoSimpleCampaign } from "@/components/NostoSimpleCampaign/NostoSimpleCampaign"
import { mockNostoRecs } from "../mockNostoRecs"
import { addHandlers } from "../msw.setup"
import { createElement } from "../utils/jsx"
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

  it("should create NostoDynamicCard elements when card and handle are provided", async () => {
    const mockResult = {
      products: [
        { name: "Product 1", handle: "test-handle-1" },
        { name: "Product 2", handle: "test-handle-2" }
      ]
    }
    mockNostoRecs({ "test-placement": mockResult })

    campaign = (<nosto-simple-campaign placement="test-placement" card="product-card" />) as NostoSimpleCampaign
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    const dynamicCards = campaign.querySelectorAll("nosto-dynamic-card")
    expect(dynamicCards).toHaveLength(2)
    expect(dynamicCards[0]?.getAttribute("handle")).toBe("test-handle-1")
    expect(dynamicCards[1]?.getAttribute("handle")).toBe("test-handle-2")
    expect(dynamicCards[0]?.getAttribute("template")).toBe("product-card")
  })

  it("should fallback to basic product elements when card is provided but no handle", async () => {
    const mockResult = {
      products: [
        { name: "Product 1", price: "$10" }, // no handle
        { name: "Product 2", handle: "test-handle" } // has handle
      ]
    }
    mockNostoRecs({ "test-placement": mockResult })

    campaign = (<nosto-simple-campaign placement="test-placement" card="product-card" />) as NostoSimpleCampaign
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    const dynamicCards = campaign.querySelectorAll("nosto-dynamic-card")
    const basicProducts = campaign.querySelectorAll(".nosto-product")

    expect(dynamicCards).toHaveLength(1) // Only product with handle
    expect(basicProducts).toHaveLength(1) // Only product without handle
    expect(dynamicCards[0]?.getAttribute("handle")).toBe("test-handle")
  })

  it("should handle products with complete information in basic fallback", async () => {
    const mockResult = {
      products: [
        {
          name: "Complete Product",
          price: "$25.99",
          image_url: "https://example.com/image.jpg"
        }
      ]
    }
    mockNostoRecs({ "test-placement": mockResult })

    campaign = (<nosto-simple-campaign placement="test-placement" />) as NostoSimpleCampaign
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    const productElement = campaign.querySelector(".nosto-product")
    expect(productElement).toBeTruthy()
    expect(productElement?.innerHTML).toContain("Complete Product")
    expect(productElement?.innerHTML).toContain("$25.99")
    expect(productElement?.innerHTML).toContain('src="https://example.com/image.jpg"')
    expect(productElement?.innerHTML).toContain('alt="Complete Product"')
  })

  it("should handle products with minimal information in basic fallback", async () => {
    const mockResult = {
      products: [{ name: "Basic Product" }] // Only name, no price or image
    }
    mockNostoRecs({ "test-placement": mockResult })

    campaign = (<nosto-simple-campaign placement="test-placement" />) as NostoSimpleCampaign
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    const productElement = campaign.querySelector(".nosto-product")
    expect(productElement).toBeTruthy()
    expect(productElement?.innerHTML).toContain("Basic Product")
    expect(productElement?.innerHTML).not.toContain("<img")
    expect(productElement?.innerHTML).not.toContain("price")
  })

  it("should handle products with no name gracefully", async () => {
    const mockResult = {
      products: [{ price: "$10" }] // No name
    }
    mockNostoRecs({ "test-placement": mockResult })

    campaign = (<nosto-simple-campaign placement="test-placement" />) as NostoSimpleCampaign
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    const productElement = campaign.querySelector(".nosto-product")
    expect(productElement).toBeTruthy()
    expect(productElement?.innerHTML).toContain("Unnamed Product")
    expect(productElement?.innerHTML).toContain("$10")
  })

  it("should render different modes correctly with mixed product types", async () => {
    const mockResult = {
      products: [
        { name: "Product 1", handle: "handle-1" },
        { name: "Product 2" } // no handle
      ]
    }

    // Test grid mode
    mockNostoRecs({ "test-placement": mockResult })
    campaign = (
      <nosto-simple-campaign placement="test-placement" mode="grid" card="product-card" />
    ) as NostoSimpleCampaign
    document.body.appendChild(campaign)
    await campaign.connectedCallback()

    expect(campaign.querySelector(".nosto-grid")).toBeTruthy()
    expect(campaign.querySelectorAll("nosto-dynamic-card")).toHaveLength(1)
    expect(campaign.querySelectorAll(".nosto-product")).toHaveLength(1)
    campaign.remove()

    // Test carousel mode
    mockNostoRecs({ "test-placement": mockResult })
    campaign = (
      <nosto-simple-campaign placement="test-placement" mode="carousel" card="product-card" />
    ) as NostoSimpleCampaign
    document.body.appendChild(campaign)
    await campaign.connectedCallback()

    expect(campaign.querySelector(".nosto-carousel")).toBeTruthy()
    expect(campaign.querySelectorAll("nosto-dynamic-card")).toHaveLength(1)
    expect(campaign.querySelectorAll(".nosto-product")).toHaveLength(1)
    campaign.remove()

    // Test bundle mode
    mockNostoRecs({ "test-placement": mockResult })
    campaign = (
      <nosto-simple-campaign placement="test-placement" mode="bundle" card="product-card" />
    ) as NostoSimpleCampaign
    document.body.appendChild(campaign)
    await campaign.connectedCallback()

    expect(campaign.querySelector(".nosto-bundle")).toBeTruthy()
    expect(campaign.querySelectorAll("nosto-dynamic-card")).toHaveLength(1)
    expect(campaign.querySelectorAll(".nosto-product")).toHaveLength(1)
  })

  it("should default to grid mode for unknown modes", async () => {
    const mockResult = {
      products: [{ name: "Product 1", price: "$10" }]
    }
    mockNostoRecs({ "test-placement": mockResult })

    campaign = (
      <nosto-simple-campaign placement="test-placement" mode={"unknown-mode" as "grid" | "carousel" | "bundle"} />
    ) as NostoSimpleCampaign
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    expect(campaign.querySelector(".nosto-grid")).toBeTruthy()
    expect(campaign.querySelector(".nosto-carousel")).toBeFalsy()
    expect(campaign.querySelector(".nosto-bundle")).toBeFalsy()
  })
})
