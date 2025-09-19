/** @jsx createElement */
import { describe, it, expect, vi, afterEach, beforeAll } from "vitest"
import { SimpleCard } from "@/components/SimpleCard/SimpleCard"
import { addHandlers } from "../msw.setup"
import { http, HttpResponse } from "msw"
import { createElement } from "../utils/jsx"
import { createShopifyUrl } from "@/utils"

describe("SimpleCard", () => {
  beforeAll(() => {
    if (!customElements.get("nosto-simple-card")) {
      customElements.define("nosto-simple-card", SimpleCard)
    }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  function addProductHandlers(responses: Record<string, { product?: unknown; status?: number }>) {
    // Use createShopifyUrl to get the correct path with Shopify root handling
    const productUrl = createShopifyUrl("products/:handle.js")
    const productPath = productUrl.pathname.replace(":handle", "([^/]+)")

    addHandlers(
      http.get(new RegExp(productPath), ({ params }) => {
        const handle = Array.isArray(params[0]) ? params[0][0] : params[0]
        const response = responses[handle as string]
        if (!response) {
          return HttpResponse.json({}, { status: 404 })
        }
        return HttpResponse.json(response.product || {}, { status: response.status || 200 })
      })
    )
  }

  const mockProduct = {
    id: 1234567890,
    title: "Test Product",
    handle: "test-product",
    description: "A test product description",
    published_at: "2023-01-01T00:00:00Z",
    created_at: "2023-01-01T00:00:00Z",
    vendor: "Test Vendor",
    type: "Test Type",
    tags: ["test", "product"],
    price: 2999, // $29.99 in cents
    price_min: 2999,
    price_max: 2999,
    available: true,
    price_varies: false,
    compare_at_price: 3999, // $39.99 in cents
    compare_at_price_min: 3999,
    compare_at_price_max: 3999,
    compare_at_price_varies: false,
    variants: [
      {
        id: 987654321,
        title: "Default Title",
        option1: null,
        option2: null,
        option3: null,
        sku: "TEST-SKU-001",
        requires_shipping: true,
        taxable: true,
        featured_image: null,
        available: true,
        name: "Test Product",
        public_title: "Default Title",
        options: [],
        price: 2999,
        weight: 100,
        compare_at_price: 3999,
        inventory_management: "shopify",
        barcode: "1234567890123",
        featured_media: null
      }
    ],
    images: ["https://example.com/test-product-1.jpg", "https://example.com/test-product-2.jpg"],
    featured_image: "https://example.com/test-product-1.jpg",
    options: [],
    url: "/products/test-product",
    media: [
      {
        alt: "Test Product Image",
        id: 123456789,
        position: 1,
        preview_image: {
          id: 123456789,
          product_id: 1234567890,
          position: 1,
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
          alt: "Test Product Image",
          width: 800,
          height: 600,
          src: "https://example.com/test-product-1.jpg",
          variant_ids: []
        },
        aspect_ratio: 1.33,
        height: 600,
        media_type: "image",
        src: "https://example.com/test-product-1.jpg",
        width: 800
      }
    ]
  }

  it("should be defined as a custom element", () => {
    expect(customElements.get("nosto-simple-card")).toBeDefined()
  })

  it("should throw error if handle is missing", async () => {
    const card = (<nosto-simple-card />) as SimpleCard
    await expect(card.connectedCallback()).rejects.toThrow("Property handle is required.")
  })

  it("should fetch and render basic product card", async () => {
    addProductHandlers({
      "test-product": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-product" />) as SimpleCard

    await card.connectedCallback()

    expect(card.innerHTML).toContain("Test Product")
    expect(card.innerHTML).toContain("$29.99")
    expect(card.innerHTML).toContain("/products/test-product")
    expect(card.querySelector("img")?.getAttribute("src")).toBe("https://example.com/test-product-1.jpg")
  })

  it("should show brand when brand attribute is true", async () => {
    addProductHandlers({
      "test-product": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-product" brand />) as SimpleCard

    await card.connectedCallback()

    expect(card.innerHTML).toContain("Test Vendor")
    expect(card.querySelector(".caption-with-letter-spacing")).toBeTruthy()
  })

  it("should not show brand when brand attribute is false", async () => {
    addProductHandlers({
      "test-product": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-product" />) as SimpleCard

    await card.connectedCallback()

    expect(card.innerHTML).not.toContain("Test Vendor")
    expect(card.querySelector(".caption-with-letter-spacing")).toBeFalsy()
  })

  it("should show discount badge when discount attribute is true and product is on sale", async () => {
    addProductHandlers({
      "test-product": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-product" discount />) as SimpleCard

    await card.connectedCallback()

    expect(card.innerHTML).toContain("$39.99") // compare at price
    expect(card.innerHTML).toContain("Sale")
    expect(card.querySelector(".badge")).toBeTruthy()
  })

  it("should not show discount badge when product is not on sale", async () => {
    const productNotOnSale = { ...mockProduct, compare_at_price: null }
    addProductHandlers({
      "test-product": {
        product: productNotOnSale
      }
    })

    const card = (<nosto-simple-card handle="test-product" discount />) as SimpleCard

    await card.connectedCallback()

    expect(card.innerHTML).not.toContain("Sale")
    expect(card.querySelector(".badge")).toBeFalsy()
  })

  it("should show alternate image on hover when alternate attribute is true", async () => {
    addProductHandlers({
      "test-product": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-product" alternate />) as SimpleCard

    await card.connectedCallback()

    const mediaElement = card.querySelector(".media")
    expect(mediaElement?.classList.contains("media--hover-effect")).toBe(true)

    const images = card.querySelectorAll("img")
    expect(images).toHaveLength(2)
    expect(images[0]?.getAttribute("src")).toBe("https://example.com/test-product-1.jpg")
    expect(images[1]?.getAttribute("src")).toBe("https://example.com/test-product-2.jpg")
  })

  it("should not show alternate image when only one image available", async () => {
    const productSingleImage = { ...mockProduct, images: ["https://example.com/test-product-1.jpg"] }
    addProductHandlers({
      "test-product": {
        product: productSingleImage
      }
    })

    const card = (<nosto-simple-card handle="test-product" alternate />) as SimpleCard

    await card.connectedCallback()

    const images = card.querySelectorAll("img")
    expect(images).toHaveLength(1)
  })

  it("should show sold out badge when product is not available", async () => {
    const soldOutProduct = { ...mockProduct, available: false }
    addProductHandlers({
      "test-product": {
        product: soldOutProduct
      }
    })

    const card = (<nosto-simple-card handle="test-product" />) as SimpleCard

    await card.connectedCallback()

    expect(card.innerHTML).toContain("Sold out")
    expect(card.querySelector(".badge")).toBeTruthy()
  })

  it("should handle product without image", async () => {
    const productNoImage = {
      ...mockProduct,
      featured_image: null,
      images: []
    }
    addProductHandlers({
      "test-product": {
        product: productNoImage
      }
    })

    const card = (<nosto-simple-card handle="test-product" />) as SimpleCard

    await card.connectedCallback()

    expect(card.innerHTML).toContain("Test Product")
    expect(card.querySelector("img")).toBeFalsy()
    expect(card.querySelector(".card")?.classList.contains("card--text")).toBe(true)
    expect(card.querySelector(".card")?.classList.contains("card--media")).toBe(false)
  })

  it("should throw error when product fetch fails", async () => {
    addProductHandlers({
      "non-existent": {
        status: 404
      }
    })

    const card = (<nosto-simple-card handle="non-existent" />) as SimpleCard

    await expect(card.connectedCallback()).rejects.toThrow("Failed to fetch")
  })

  it("should handle attribute changes and re-render", async () => {
    addProductHandlers({
      "test-product": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-product" />) as SimpleCard

    await card.connectedCallback()

    // Initially no brand shown
    expect(card.innerHTML).not.toContain("Test Vendor")

    // Change brand attribute
    card.setAttribute("brand", "")

    // Manually trigger re-read of attributes and re-render
    card.brand = card.hasAttribute("brand")
    await card.loadAndRender()

    // Now brand should be shown
    expect(card.innerHTML).toContain("Test Vendor")
  })

  it("should use Shopify routes root when available", async () => {
    // Set up window.Shopify.routes.root
    vi.stubGlobal("Shopify", { routes: { root: "/en-us/" } })

    addProductHandlers({
      "test-product": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-product" />) as SimpleCard

    await card.connectedCallback()

    expect(card.innerHTML).toContain("Test Product")

    // Restore original globals
    vi.unstubAllGlobals()
  })

  it("should handle all attributes together", async () => {
    addProductHandlers({
      "test-product": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-product" alternate brand discount />) as SimpleCard

    await card.connectedCallback()

    // Should show brand
    expect(card.innerHTML).toContain("Test Vendor")

    // Should show discount
    expect(card.innerHTML).toContain("$39.99")
    expect(card.innerHTML).toContain("Sale")

    // Should have alternate image
    const images = card.querySelectorAll("img")
    expect(images).toHaveLength(2)

    // Should have hover effect
    expect(card.querySelector(".media")?.classList.contains("media--hover-effect")).toBe(true)
  })
})
