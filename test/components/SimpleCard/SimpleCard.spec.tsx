/** @jsx createElement */
import { describe, it, expect } from "vitest"
import { SimpleCard } from "@/components/SimpleCard/SimpleCard"
import { addHandlers } from "../../msw.setup"
import { http, HttpResponse } from "msw"
import { createElement } from "../../utils/jsx"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import type { ShopifyProduct } from "@/components/SimpleCard/types"

describe("SimpleCard", () => {
  function addProductHandlers(responses: Record<string, { product?: ShopifyProduct; status?: number }>) {
    // Use createShopifyUrl to get the correct path with Shopify root handling
    const productUrl = createShopifyUrl("products/:handle.js")
    const productPath = productUrl.pathname

    addHandlers(
      http.get(productPath, ({ params }) => {
        const handle = params.handle as string
        const response = responses[handle]
        if (!response) {
          return HttpResponse.json({ error: "Not Found" }, { status: 404 })
        }
        // SimpleCard expects the product data directly, not wrapped in a product property
        return HttpResponse.json(response.product || response, { status: response.status || 200 })
      })
    )
  }

  const mockProduct = {
    id: 123456,
    title: "Awesome Test Product",
    handle: "awesome-test-product",
    description: "A great product for testing",
    vendor: "Test Brand",
    tags: ["test", "awesome"],
    images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
    featured_image: "https://example.com/image1.jpg",
    price: 1999, // $19.99 in cents
    compare_at_price: 2499, // $24.99 in cents
    url: "/products/awesome-test-product",
    variants: [
      {
        id: 789,
        price: 1999, // $19.99 in cents
        compare_at_price: 2499, // $24.99 in cents
        available: true,
        title: "Default Title"
      }
    ]
  } as ShopifyProduct

  it("should throw an error if handle is not provided", async () => {
    const card = (<nosto-simple-card />) as SimpleCard
    await expect(card.connectedCallback()).rejects.toThrowError("Property handle is required.")
  })

  it("should fetch product data and render basic card using lit-html", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const card = (<nosto-simple-card handle="test-product" />) as SimpleCard

    await card.connectedCallback()

    expect(card.innerHTML).toContain("simple-card")
    expect(card.innerHTML).toContain("Awesome Test Product")
    expect(card.innerHTML).toContain("$19.99")
    expect(card.innerHTML).toContain("https://example.com/image1.jpg")
    expect(card.hasAttribute("loading")).toBe(false)
    // Check that lit-html rendered the template correctly
    expect(card.querySelector(".simple-card")).not.toBeNull()
    expect(card.querySelector(".simple-card__title")).not.toBeNull()
  })

  it("should render brand when brand attribute is enabled", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const card = (<nosto-simple-card handle="test-product" brand />) as SimpleCard

    await card.connectedCallback()

    expect(card.innerHTML).toContain("simple-card__brand")
    expect(card.innerHTML).toContain("Test Brand")
    expect(card.querySelector(".simple-card__brand")).not.toBeNull()
  })

  it("should not render brand when brand attribute is disabled", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const card = (<nosto-simple-card handle="test-product" />) as SimpleCard

    await card.connectedCallback()

    expect(card.innerHTML).not.toContain("simple-card__brand")
    expect(card.innerHTML).not.toContain("Test Brand")
    expect(card.querySelector(".simple-card__brand")).toBeNull()
  })

  it("should render original price when discount attribute is enabled and product has discount", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const card = (<nosto-simple-card handle="test-product" discount />) as SimpleCard

    await card.connectedCallback()

    expect(card.innerHTML).toContain("$24.99") // original price
    expect(card.innerHTML).toContain("$19.99") // current price
    expect(card.querySelector(".simple-card__price-original")).not.toBeNull()
  })

  it("should not render original price when product has no discount", async () => {
    const productWithoutDiscount = {
      ...mockProduct,
      price: 1999,
      compare_at_price: 1999, // same price, no discount
      variants: [
        {
          id: 789,
          price: 1999,
          compare_at_price: 1999, // same price, no discount
          available: true,
          title: "Default Title"
        }
      ]
    } as ShopifyProduct

    addProductHandlers({
      "test-product": { product: productWithoutDiscount }
    })

    const card = (<nosto-simple-card handle="test-product" discount />) as SimpleCard

    await card.connectedCallback()

    expect(card.querySelector(".simple-card__price-original")).toBeNull()
  })

  it("should render rating when rating attribute is provided", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const card = (<nosto-simple-card handle="test-product" rating={4.2} />) as SimpleCard

    await card.connectedCallback()

    expect(card.innerHTML).toContain("simple-card__rating")
    expect(card.innerHTML).toContain("★★★★☆ (4.2)")
    expect(card.querySelector(".simple-card__rating")).not.toBeNull()
  })

  it("should render alternate image when alternate attribute is enabled", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const card = (<nosto-simple-card handle="test-product" alternate />) as SimpleCard

    await card.connectedCallback()

    expect(card.innerHTML).toContain("simple-card__img--primary")
    expect(card.innerHTML).toContain("simple-card__img--alternate")
    expect(card.innerHTML).toContain("https://example.com/image2.jpg")
    expect(card.querySelector(".simple-card__img--primary")).not.toBeNull()
    expect(card.querySelector(".simple-card__img--alternate")).not.toBeNull()
  })

  it("should not render alternate image when product has only one image", async () => {
    const productWithOneImage = {
      ...mockProduct,
      images: [mockProduct.images[0]] // only one image
    }

    addProductHandlers({
      "test-product": { product: productWithOneImage }
    })

    const card = (<nosto-simple-card handle="test-product" alternate />) as SimpleCard

    await card.connectedCallback()

    // Should still render primary image class
    expect(card.innerHTML).toContain("simple-card__img--primary")
    // But should NOT render the alternate image container or alternate image class
    expect(card.innerHTML).not.toContain("simple-card__image--alternate")
    expect(card.innerHTML).not.toContain("simple-card__img--alternate")
    expect(card.querySelector(".simple-card__img--alternate")).toBeNull()
  })

  it("should render all features when all attributes are enabled", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const card = (<nosto-simple-card handle="test-product" brand discount rating={3.5} alternate />) as SimpleCard

    await card.connectedCallback()

    expect(card.innerHTML).toContain("simple-card__brand")
    expect(card.innerHTML).toContain("Test Brand")
    expect(card.innerHTML).toContain("$24.99") // original price shown with discount attribute
    expect(card.innerHTML).toContain("simple-card__rating")
    expect(card.innerHTML).toContain("★★★☆☆ (3.5)")
    expect(card.innerHTML).toContain("simple-card__img--primary")
    expect(card.innerHTML).toContain("simple-card__img--alternate")

    // Check that all elements exist
    expect(card.querySelector(".simple-card__brand")).not.toBeNull()
    expect(card.querySelector(".simple-card__rating")).not.toBeNull()
    expect(card.querySelector(".simple-card__img--primary")).not.toBeNull()
    expect(card.querySelector(".simple-card__img--alternate")).not.toBeNull()
  })

  it("should handle product with no images", async () => {
    const productWithoutImages = {
      ...mockProduct,
      images: []
    }

    addProductHandlers({
      "test-product": { product: productWithoutImages }
    })

    const card = (<nosto-simple-card handle="test-product" />) as SimpleCard

    await card.connectedCallback()

    expect(card.innerHTML).toContain("simple-card__image--placeholder")
    expect(card.querySelector(".simple-card__image--placeholder")).not.toBeNull()
  })

  it("should handle error when product fetch fails", async () => {
    addProductHandlers({
      "missing-product": { status: 404 }
    })

    const card = (<nosto-simple-card handle="missing-product" />) as SimpleCard

    // Since error handling is removed, the component should throw
    await expect(card.connectedCallback()).rejects.toThrow()
  })

  it("should re-render when handle attribute changes", async () => {
    const product1 = { ...mockProduct, title: "Product 1" }
    const product2 = { ...mockProduct, title: "Product 2" }

    addProductHandlers({
      "product-1": { product: product1 },
      "product-2": { product: product2 }
    })

    const card = (<nosto-simple-card handle="product-1" />) as SimpleCard
    document.body.appendChild(card)

    await card.connectedCallback()
    expect(card.innerHTML).toContain("Product 1")

    card.handle = "product-2"
    await card.attributeChangedCallback()
    expect(card.innerHTML).toContain("Product 2")
  })

  it("should use lit-html template rendering correctly", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const card = (<nosto-simple-card handle="test-product" />) as SimpleCard

    await card.connectedCallback()

    // Verify the DOM structure created by lit-html
    const cardElement = card.querySelector(".simple-card")
    expect(cardElement).not.toBeNull()

    const link = cardElement?.querySelector(".simple-card__link")
    expect(link).not.toBeNull()
    expect(link?.getAttribute("href")).toBe("/products/awesome-test-product")

    const title = cardElement?.querySelector(".simple-card__title")
    expect(title).not.toBeNull()
    expect(title?.textContent?.trim()).toBe("Awesome Test Product")

    // Verify nosto-image elements are properly rendered
    const nostoImage = cardElement?.querySelector("nosto-image")
    expect(nostoImage).not.toBeNull()
    expect(nostoImage?.getAttribute("src")).toBe("https://example.com/image1.jpg")
    expect(nostoImage?.getAttribute("alt")).toBe("Awesome Test Product")
  })

  it("should format price correctly", async () => {
    const productWithDifferentPrice = {
      ...mockProduct,
      price: 999, // $9.99 in cents
      compare_at_price: 1299, // $12.99 in cents
      variants: [
        {
          id: 789,
          price: 999, // $9.99 in cents
          compare_at_price: 1299, // $12.99 in cents
          available: true,
          title: "Default Title"
        }
      ]
    } as ShopifyProduct

    addProductHandlers({
      "test-product": { product: productWithDifferentPrice }
    })

    const card = (<nosto-simple-card handle="test-product" discount />) as SimpleCard

    await card.connectedCallback()

    expect(card.innerHTML).toContain("$9.99")
    expect(card.innerHTML).toContain("$12.99")
  })
})
