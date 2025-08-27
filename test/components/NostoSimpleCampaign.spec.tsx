/** @jsx createElement */
import { describe, it, expect, afterEach } from "vitest"
import {
  NostoGridCampaign,
  NostoCarouselCampaign,
  NostoBundleCampaign
} from "@/components/NostoSimpleCampaign/NostoSimpleCampaign"
import { mockNostoRecs } from "../mockNostoRecs"
import { addHandlers } from "../msw.setup"
import { createElement } from "../utils/jsx"
import { http, HttpResponse } from "msw"

describe("NostoGridCampaign", () => {
  let campaign: NostoGridCampaign

  function addProductHandlers() {
    addHandlers(
      http.get("/products/:handle", ({ params }) => {
        const handle = params.handle as string
        return HttpResponse.text(`<div class="product-card">${handle}</div>`, { status: 200 })
      })
    )
  }

  afterEach(() => {
    document.body.innerHTML = ""
    campaign?.remove?.()
  })

  it("should be defined as a custom element", () => {
    expect(customElements.get("nosto-grid-campaign")).toBeDefined()
  })

  it("should throw in connectedCallback if placement is missing", async () => {
    campaign = (<nosto-grid-campaign />) as NostoGridCampaign
    await expect(campaign.connectedCallback()).rejects.toThrow("placement attribute is required")
  })

  it("should load campaign and render in grid layout", async () => {
    const mockResult = {
      products: [
        { name: "Product 1", price: "$10", image_url: "https://example.com/img1.jpg", url: "/products/product-1" },
        { name: "Product 2", price: "$20", image_url: "https://example.com/img2.jpg", url: "/products/product-2" }
      ]
    }
    const { mockBuilder } = mockNostoRecs({ "test-placement": mockResult })

    campaign = (<nosto-grid-campaign placement="test-placement" />) as NostoGridCampaign
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    expect(mockBuilder.load).toHaveBeenCalledWith()
    expect(campaign.querySelector(".nosto-grid")).toBeTruthy()
    expect(campaign.querySelectorAll(".nosto-product")).toHaveLength(2)
    expect(campaign.hasAttribute("loading")).toBe(false)
  })

  it("should handle empty campaign results gracefully", async () => {
    const { mockBuilder } = mockNostoRecs({ "test-placement": { products: [] } })

    campaign = (<nosto-grid-campaign placement="test-placement" />) as NostoGridCampaign
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    expect(mockBuilder.load).toHaveBeenCalledWith()
    expect(campaign.innerHTML).toBe("")
    expect(campaign.hasAttribute("loading")).toBe(false)
  })

  it("should use NostoDynamicCard when card attribute is provided", async () => {
    addProductHandlers()
    const mockResult = {
      products: [{ name: "Product 1", price: "$10", handle: "test-handle" }]
    }
    mockNostoRecs({ "test-placement": mockResult })

    campaign = (<nosto-grid-campaign placement="test-placement" card="product-card" />) as NostoGridCampaign
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    const dynamicCard = campaign.querySelector("nosto-dynamic-card")
    expect(dynamicCard).toBeTruthy()
    expect(dynamicCard?.getAttribute("handle")).toBe("test-handle")
    expect(dynamicCard?.getAttribute("template")).toBe("product-card")
  })

  it("should handle loading state correctly", async () => {
    const mockResult = { products: [{ name: "Product 1" }] }
    mockNostoRecs({ "test-placement": mockResult })

    campaign = (<nosto-grid-campaign placement="test-placement" />) as NostoGridCampaign
    document.body.appendChild(campaign)

    const loadingPromise = campaign.connectedCallback()
    expect(campaign.hasAttribute("loading")).toBe(true)

    await loadingPromise
    expect(campaign.hasAttribute("loading")).toBe(false)
  })
})

describe("NostoCarouselCampaign", () => {
  let campaign: NostoCarouselCampaign

  function addProductHandlers() {
    addHandlers(
      http.get("/products/:handle", ({ params }) => {
        const handle = params.handle as string
        return HttpResponse.text(`<div class="product-card">${handle}</div>`, { status: 200 })
      })
    )
  }

  afterEach(() => {
    document.body.innerHTML = ""
    campaign?.remove?.()
  })

  it("should be defined as a custom element", () => {
    expect(customElements.get("nosto-carousel-campaign")).toBeDefined()
  })

  it("should render campaign in carousel mode with Swiper structure", async () => {
    const mockResult = {
      products: [{ name: "Product 1", price: "$10", url: "/products/product-1" }]
    }
    mockNostoRecs({ "test-placement": mockResult })

    campaign = (<nosto-carousel-campaign placement="test-placement" />) as NostoCarouselCampaign
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    expect(campaign.querySelector("swiper-container.nosto-carousel")).toBeTruthy()
    expect(campaign.querySelector("swiper-slide")).toBeTruthy()
    expect(campaign.querySelector(".nosto-grid")).toBeFalsy()
  })

  it("should use NostoDynamicCard in carousel mode when card attribute is provided", async () => {
    addProductHandlers()
    const mockResult = {
      products: [{ name: "Product 1", price: "$10", handle: "test-handle" }]
    }
    mockNostoRecs({ "test-placement": mockResult })

    campaign = (<nosto-carousel-campaign placement="test-placement" card="product-card" />) as NostoCarouselCampaign
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    const dynamicCard = campaign.querySelector("nosto-dynamic-card")
    expect(dynamicCard).toBeTruthy()
    expect(dynamicCard?.getAttribute("handle")).toBe("test-handle")
    expect(dynamicCard?.getAttribute("template")).toBe("product-card")
    expect(campaign.querySelector("swiper-container.nosto-carousel")).toBeTruthy()
  })
})

describe("NostoBundleCampaign", () => {
  let campaign: NostoBundleCampaign

  function addProductHandlers() {
    addHandlers(
      http.get("/products/:handle", ({ params }) => {
        const handle = params.handle as string
        return HttpResponse.text(`<div class="product-card">${handle}</div>`, { status: 200 })
      })
    )
  }

  afterEach(() => {
    document.body.innerHTML = ""
    campaign?.remove?.()
  })

  it("should be defined as a custom element", () => {
    expect(customElements.get("nosto-bundle-campaign")).toBeDefined()
  })

  it("should render campaign in bundle mode", async () => {
    const mockResult = {
      products: [{ name: "Product 1", price: "$10", url: "/products/product-1" }]
    }
    mockNostoRecs({ "test-placement": mockResult })

    campaign = (<nosto-bundle-campaign placement="test-placement" />) as NostoBundleCampaign
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    expect(campaign.querySelector(".nosto-bundle")).toBeTruthy()
    expect(campaign.querySelector(".nosto-grid")).toBeFalsy()
  })

  it("should use NostoDynamicCard in bundle mode when card attribute is provided", async () => {
    addProductHandlers()
    const mockResult = {
      products: [{ name: "Product 1", price: "$10", handle: "test-handle" }]
    }
    mockNostoRecs({ "test-placement": mockResult })

    campaign = (<nosto-bundle-campaign placement="test-placement" card="product-card" />) as NostoBundleCampaign
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    const dynamicCard = campaign.querySelector("nosto-dynamic-card")
    expect(dynamicCard).toBeTruthy()
    expect(dynamicCard?.getAttribute("handle")).toBe("test-handle")
    expect(dynamicCard?.getAttribute("template")).toBe("product-card")
    expect(campaign.querySelector(".nosto-bundle")).toBeTruthy()
  })
})

describe("Shared Campaign Functionality", () => {
  let campaign: NostoGridCampaign

  function addProductHandlers() {
    addHandlers(
      http.get("/products/:handle", ({ params }) => {
        const handle = params.handle as string
        return HttpResponse.text(`<div class="product-card">${handle}</div>`, { status: 200 })
      })
    )
  }

  afterEach(() => {
    document.body.innerHTML = ""
    campaign?.remove?.()
  })

  it("should fall back to basic product display when card attribute is provided but no handle found", async () => {
    addProductHandlers()
    const mockResult = {
      products: [{ name: "Product 1", price: "$10" }]
    }
    mockNostoRecs({ "test-placement": mockResult })

    campaign = (<nosto-grid-campaign placement="test-placement" card="product-card" />) as NostoGridCampaign
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    expect(campaign.querySelector("nosto-dynamic-card")).toBeFalsy()
    expect(campaign.querySelector(".nosto-product")).toBeTruthy()
    expect(campaign.querySelector(".nosto-product")?.textContent).toContain("Product 1")
  })

  it("should create NostoDynamicCard elements when card and handle are provided", async () => {
    addProductHandlers()
    const mockResult = {
      products: [
        { name: "Product 1", handle: "test-handle-1" },
        { name: "Product 2", handle: "test-handle-2" }
      ]
    }
    mockNostoRecs({ "test-placement": mockResult })

    campaign = (<nosto-grid-campaign placement="test-placement" card="product-card" />) as NostoGridCampaign
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    const dynamicCards = campaign.querySelectorAll("nosto-dynamic-card")
    expect(dynamicCards).toHaveLength(2)
    expect(dynamicCards[0]?.getAttribute("handle")).toBe("test-handle-1")
    expect(dynamicCards[1]?.getAttribute("handle")).toBe("test-handle-2")
    expect(dynamicCards[0]?.getAttribute("template")).toBe("product-card")
  })

  it("should fallback to basic product elements when card is provided but no handle", async () => {
    addProductHandlers()
    const mockResult = {
      products: [
        { name: "Product 1", price: "$10" }, // no handle
        { name: "Product 2", handle: "test-handle" } // has handle
      ]
    }
    mockNostoRecs({ "test-placement": mockResult })

    campaign = (<nosto-grid-campaign placement="test-placement" card="product-card" />) as NostoGridCampaign
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

    campaign = (<nosto-grid-campaign placement="test-placement" />) as NostoGridCampaign
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

    campaign = (<nosto-grid-campaign placement="test-placement" />) as NostoGridCampaign
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

    campaign = (<nosto-grid-campaign placement="test-placement" />) as NostoGridCampaign
    document.body.appendChild(campaign)

    await campaign.connectedCallback()

    const productElement = campaign.querySelector(".nosto-product")
    expect(productElement).toBeTruthy()
    expect(productElement?.innerHTML).toContain("Unnamed Product")
    expect(productElement?.innerHTML).toContain("$10")
  })
})
