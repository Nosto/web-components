/** @jsx createElement */
import { describe, it, expect, vi, afterEach, beforeAll } from "vitest"
import { SimpleCard } from "@/components/SimpleCard/SimpleCard"
import type { ShopifyProduct } from "@/components/SimpleCard/types"
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

  function addProductHandlers(responses: Record<string, { product?: ShopifyProduct; status?: number }>) {
    // Use createShopifyUrl to get the correct path with Shopify root handling
    const productUrl = createShopifyUrl("products/:handle.js")
    const productPath = productUrl.pathname

    addHandlers(
      http.get(productPath, ({ params }) => {
        const handle = params.handle as string
        const response = responses[handle]
        if (!response) {
          return HttpResponse.json({ error: "Product not found" }, { status: 404 })
        }
        return HttpResponse.json(response.product, { status: response.status || 200 })
      })
    )
  }

  const mockProduct = {
    id: 123456,
    title: "Test Product",
    handle: "test-product",
    description: "A test product",
    published_at: "2023-01-01T00:00:00Z",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    vendor: "Test Brand",
    product_type: "Test Type",
    tags: ["test"],
    price: 2999, // $29.99 in cents
    price_min: 2999,
    price_max: 2999,
    available: true,
    price_varies: false,
    compare_at_price: 3999, // $39.99 in cents
    variants: [],
    images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
    featured_image: "https://example.com/image1.jpg",
    options: [],
    url: "/products/test-product"
  }

  it("throws error when handle is not provided", async () => {
    const card = (<nosto-simple-card />) as SimpleCard

    // The error should be thrown during connectedCallback when assertRequired is called
    await expect(card.connectedCallback()).rejects.toThrow("Property handle is required.")

    document.body.innerHTML = ""
  })

  it("fetches product data and renders card with basic information", async () => {
    addProductHandlers({
      "test-product": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-product" />) as SimpleCard
    document.body.appendChild(card)

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(card.innerHTML).toContain("Test Product")
    expect(card.innerHTML).toContain("$29.99")
    expect(card.querySelector("img")).toBeInstanceOf(HTMLImageElement)
    expect(card.querySelector("img")?.src).toBe("https://example.com/image1.jpg")

    document.body.innerHTML = ""
  })

  it("shows brand information when brand attribute is true", async () => {
    addProductHandlers({
      "test-product": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-product" brand />) as SimpleCard
    document.body.appendChild(card)

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(card.innerHTML).toContain("Test Brand")

    document.body.innerHTML = ""
  })

  it("shows discount information when discount attribute is true", async () => {
    addProductHandlers({
      "test-product": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-product" discount />) as SimpleCard
    document.body.appendChild(card)

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(card.innerHTML).toContain("$29.99") // Sale price
    expect(card.innerHTML).toContain("$39.99") // Compare price
    expect(card.innerHTML).toContain("Sale") // Sale badge

    document.body.innerHTML = ""
  })

  it("shows alternate image when alternate attribute is true", async () => {
    addProductHandlers({
      "test-product": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-product" alternate />) as SimpleCard
    document.body.appendChild(card)

    await new Promise(resolve => setTimeout(resolve, 100))

    const images = card.querySelectorAll("img")
    expect(images.length).toBe(2)
    expect(images[0].src).toBe("https://example.com/image1.jpg")
    expect(images[1].src).toBe("https://example.com/image2.jpg")

    document.body.innerHTML = ""
  })

  it("shows rating when rating attribute is true", async () => {
    addProductHandlers({
      "test-product": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-product" rating />) as SimpleCard
    document.body.appendChild(card)

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(card.innerHTML).toContain("★★★★☆")
    expect(card.querySelector(".card__rating")).toBeInstanceOf(HTMLElement)

    document.body.innerHTML = ""
  })

  it("shows sold out badge when product is not available", async () => {
    const unavailableProduct = { ...mockProduct, available: false }
    addProductHandlers({
      "sold-out-product": {
        product: unavailableProduct
      }
    })

    const card = (<nosto-simple-card handle="sold-out-product" />) as SimpleCard
    document.body.appendChild(card)

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(card.innerHTML).toContain("Sold out")

    document.body.innerHTML = ""
  })

  it("renders error message when product fetch fails", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    addProductHandlers({
      "nonexistent-product": {
        status: 404
      }
    })

    const card = (<nosto-simple-card handle="nonexistent-product" />) as SimpleCard
    document.body.appendChild(card)

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(card.innerHTML).toContain("Failed to load product:")
    expect(card.innerHTML).toContain("nonexistent-product")

    consoleErrorSpy.mockRestore()
    document.body.innerHTML = ""
  })

  it("handles product without images", async () => {
    const productWithoutImages = { ...mockProduct, images: [], featured_image: undefined }
    addProductHandlers({
      "no-image-product": {
        product: productWithoutImages
      }
    })

    const card = (<nosto-simple-card handle="no-image-product" />) as SimpleCard
    document.body.appendChild(card)

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(card.innerHTML).toContain("Test Product")
    expect(card.querySelector("img")).toBeNull()

    document.body.innerHTML = ""
  })

  it("updates when handle attribute changes", async () => {
    const secondProduct = { ...mockProduct, title: "Second Product", handle: "second-product" }

    addProductHandlers({
      "test-product": { product: mockProduct },
      "second-product": { product: secondProduct }
    })

    const card = (<nosto-simple-card handle="test-product" />) as SimpleCard
    document.body.appendChild(card)

    await new Promise(resolve => setTimeout(resolve, 100))
    expect(card.innerHTML).toContain("Test Product")

    // Change handle
    card.handle = "second-product"
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(card.innerHTML).toContain("Second Product")

    document.body.innerHTML = ""
  })

  it("formats prices correctly", async () => {
    const productWithVariousPrices = {
      ...mockProduct,
      price: 1234, // $12.34
      compare_at_price: undefined
    }

    addProductHandlers({
      "price-test": { product: productWithVariousPrices }
    })

    const card = (<nosto-simple-card handle="price-test" />) as SimpleCard
    document.body.appendChild(card)

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(card.innerHTML).toContain("$12.34")

    document.body.innerHTML = ""
  })
})
