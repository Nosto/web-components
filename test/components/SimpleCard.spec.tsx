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

  function addProductHandlers(responses: Record<string, { product?: object; status?: number }>) {
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
        return HttpResponse.json(response.product || {}, { status: response.status || 200 })
      })
    )
  }

  const mockProduct = {
    id: 123456,
    title: "Awesome Product",
    handle: "awesome-product",
    vendor: "Awesome Brand",
    price: 2999,
    compare_at_price: 3999,
    images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
    variants: [
      {
        id: 789,
        title: "Default Title",
        price: 2999,
        compare_at_price: 3999
      }
    ],
    url: "/products/awesome-product"
  }

  it("should throw an error if handle is not provided", async () => {
    const card = (<nosto-simple-card />) as SimpleCard
    await expect(card.connectedCallback()).rejects.toThrowError("Property handle is required.")
  })

  it("should fetch product data and render basic card", async () => {
    addProductHandlers({
      "test-handle": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-handle" />) as SimpleCard

    await card.connectedCallback()

    expect(card.innerHTML).toContain("Awesome Product")
    expect(card.innerHTML).toContain("$29.99")
    expect(card.innerHTML).toContain("/products/awesome-product")
    expect(card.innerHTML).toContain("https://example.com/image1.jpg")
    expect(card.hasAttribute("loading")).toBe(false)
  })

  it("should show brand when brand attribute is true", async () => {
    addProductHandlers({
      "test-handle": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-handle" brand={true} />) as SimpleCard

    await card.connectedCallback()

    expect(card.innerHTML).toContain("Awesome Brand")
    expect(card.innerHTML).toContain("card__vendor")
  })

  it("should not show brand when brand attribute is false", async () => {
    addProductHandlers({
      "test-handle": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-handle" />) as SimpleCard
    // Explicitly set brand to false
    card.brand = false

    await card.connectedCallback()

    expect(card.innerHTML).not.toContain("Awesome Brand")
    expect(card.innerHTML).not.toContain("card__vendor")
  })

  it("should show discount information when discount attribute is true", async () => {
    addProductHandlers({
      "test-handle": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-handle" discount={true} />) as SimpleCard

    await card.connectedCallback()

    expect(card.innerHTML).toContain("25% off")
    expect(card.innerHTML).toContain("badge--discount")
    expect(card.innerHTML).toContain("$39.99")
    expect(card.innerHTML).toContain("price__sale")
  })

  it("should not show discount when discount attribute is false", async () => {
    addProductHandlers({
      "test-handle": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-handle" />) as SimpleCard
    // Explicitly set discount to false
    card.discount = false

    await card.connectedCallback()

    expect(card.innerHTML).not.toContain("% off")
    expect(card.innerHTML).not.toContain("badge--discount")
    expect(card.innerHTML).not.toContain("price__sale")
  })

  it("should show secondary image when alternate attribute is true", async () => {
    addProductHandlers({
      "test-handle": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-handle" alternate={true} />) as SimpleCard

    await card.connectedCallback()

    expect(card.innerHTML).toContain("https://example.com/image2.jpg")
    expect(card.innerHTML).toContain("secondary-image")
  })

  it("should not show secondary image when alternate attribute is false", async () => {
    addProductHandlers({
      "test-handle": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-handle" />) as SimpleCard
    // Explicitly set alternate to false
    card.alternate = false

    await card.connectedCallback()

    expect(card.innerHTML).not.toContain("https://example.com/image2.jpg")
    expect(card.innerHTML).not.toContain("secondary-image")
  })

  it("should show rating when rating attribute is true", async () => {
    addProductHandlers({
      "test-handle": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-handle" rating={true} />) as SimpleCard

    await card.connectedCallback()

    expect(card.innerHTML).toContain("card__rating")
    expect(card.innerHTML).toContain("★★★★☆")
    expect(card.innerHTML).toContain("rating-count")
  })

  it("should not show rating when rating attribute is false", async () => {
    addProductHandlers({
      "test-handle": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-handle" />) as SimpleCard
    // Explicitly set rating to false
    card.rating = false

    await card.connectedCallback()

    expect(card.innerHTML).not.toContain("card__rating")
    expect(card.innerHTML).not.toContain("★★★★☆")
  })

  it("should handle products without images", async () => {
    const productWithoutImages = {
      ...mockProduct,
      images: []
    }

    addProductHandlers({
      "no-images": {
        product: productWithoutImages
      }
    })

    const card = (<nosto-simple-card handle="no-images" />) as SimpleCard

    await card.connectedCallback()

    expect(card.innerHTML).toContain("Awesome Product")
    expect(card.innerHTML).not.toContain("card__media")
    expect(card.innerHTML).not.toContain("<img")
  })

  it("should handle products without discount", async () => {
    const productWithoutDiscount = {
      ...mockProduct,
      compare_at_price: null
    }

    addProductHandlers({
      "no-discount": {
        product: productWithoutDiscount
      }
    })

    const card = (<nosto-simple-card handle="no-discount" discount={true} />) as SimpleCard

    await card.connectedCallback()

    expect(card.innerHTML).not.toContain("% off")
    expect(card.innerHTML).not.toContain("badge--discount")
    expect(card.innerHTML).toContain("$29.99")
  })

  it("should emit loaded event when card is rendered", async () => {
    addProductHandlers({
      "event-test": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="event-test" />) as SimpleCard

    let eventEmitted = false
    card.addEventListener("@nosto/SimpleCard/loaded", () => {
      eventEmitted = true
    })

    await card.connectedCallback()

    expect(eventEmitted).toBe(true)
    expect(card.hasAttribute("loading")).toBe(false)
  })

  it("should handle fetch errors gracefully", async () => {
    addProductHandlers({
      "error-handle": {
        status: 500
      }
    })

    const card = (<nosto-simple-card handle="error-handle" />) as SimpleCard

    await card.connectedCallback()

    expect(card.innerHTML).toContain("simple-card-error")
    expect(card.innerHTML).toContain("Failed to load product")
    expect(card.hasAttribute("loading")).toBe(false)
  })

  it("should re-render when attributes change", async () => {
    addProductHandlers({
      "test-handle": {
        product: mockProduct
      },
      "updated-handle": {
        product: {
          ...mockProduct,
          title: "Updated Product"
        }
      }
    })

    const card = (<nosto-simple-card handle="test-handle" />) as SimpleCard
    document.body.appendChild(card)

    await card.connectedCallback()
    expect(card.innerHTML).toContain("Awesome Product")

    card.handle = "updated-handle"
    // Wait for attribute change to process
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(card.innerHTML).toContain("Updated Product")

    document.body.removeChild(card)
  })

  it("should handle all attributes together", async () => {
    addProductHandlers({
      "full-featured": {
        product: mockProduct
      }
    })

    const card = (
      <nosto-simple-card handle="full-featured" alternate={true} brand={true} discount={true} rating={true} />
    ) as SimpleCard

    await card.connectedCallback()

    // Should contain all features
    expect(card.innerHTML).toContain("Awesome Product")
    expect(card.innerHTML).toContain("Awesome Brand")
    expect(card.innerHTML).toContain("25% off")
    expect(card.innerHTML).toContain("https://example.com/image2.jpg")
    expect(card.innerHTML).toContain("★★★★☆")
    expect(card.innerHTML).toContain("secondary-image")
    expect(card.innerHTML).toContain("card__vendor")
    expect(card.innerHTML).toContain("badge--discount")
    expect(card.innerHTML).toContain("card__rating")
  })
})
