/** @jsx createElement */
import { describe, it, expect, vi } from "vitest"
import { SimpleCard } from "@/components/SimpleCard/SimpleCard"
import { addHandlers } from "../../msw.setup"
import { http, HttpResponse } from "msw"
import { createElement } from "../../utils/jsx"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import type { ShopifyProduct } from "@/shopify/types"

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

  function getShadowContent(card: SimpleCard) {
    const shadowContent = card.shadowRoot?.innerHTML || ""
    // Remove the style tag and its content to get just the HTML content
    return shadowContent.replace(/<style>[\s\S]*?<\/style>/g, "").trim()
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

  it("should fetch product data and render basic card", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const card = (<nosto-simple-card handle="test-product" />) as SimpleCard

    await card.connectedCallback()

    const shadowContent = getShadowContent(card)
    expect(shadowContent).toContain("card")
    expect(shadowContent).toContain("Awesome Test Product")
    expect(shadowContent).toContain("$19.99")
    expect(shadowContent).toContain("https://example.com/image1.jpg")
    expect(card.hasAttribute("loading")).toBe(false)
  })

  it("should render brand when brand attribute is enabled", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const card = (<nosto-simple-card handle="test-product" brand />) as SimpleCard

    await card.connectedCallback()

    const shadowContent = getShadowContent(card)
    expect(shadowContent).toContain("brand")
    expect(shadowContent).toContain("Test Brand")
  })

  it("should handle add to cart clicks", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const card = (
      <nosto-simple-card handle="test-product" brand>
        <button n-atc>Add to Cart</button>
      </nosto-simple-card>
    ) as SimpleCard

    await card.connectedCallback()
    card.variantId = 789

    window.Nosto = { addSkuToCart: vi.fn(() => Promise.resolve()) }

    const button = card.querySelector("[n-atc]") as HTMLButtonElement
    button.click()

    expect(window.Nosto!.addSkuToCart).toHaveBeenCalledWith({ productId: "123456", skuId: "789" }, undefined, undefined)
  })

  it("should not render brand when brand attribute is disabled", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const card = (<nosto-simple-card handle="test-product" />) as SimpleCard

    await card.connectedCallback()

    const shadowContent = getShadowContent(card)
    expect(shadowContent).not.toContain("brand")
    expect(shadowContent).not.toContain("Test Brand")
  })

  it("should render original price when discount attribute is enabled and product has discount", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const card = (<nosto-simple-card handle="test-product" discount />) as SimpleCard

    await card.connectedCallback()

    const shadowContent = getShadowContent(card)
    expect(shadowContent).toContain("$24.99") // original price
    expect(shadowContent).toContain("$19.99") // current price
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

    const shadowContent = getShadowContent(card)
    expect(shadowContent).not.toContain("price-original")
  })

  it("should render rating when rating attribute is provided", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const card = (<nosto-simple-card handle="test-product" rating={4.2} />) as SimpleCard

    await card.connectedCallback()

    const shadowContent = getShadowContent(card)
    expect(shadowContent).toContain("rating")
    expect(shadowContent).toContain("★★★★☆ (4.2)")
  })

  it("should render alternate image when alternate attribute is enabled", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const card = (<nosto-simple-card handle="test-product" alternate />) as SimpleCard

    await card.connectedCallback()

    const shadowContent = getShadowContent(card)
    expect(shadowContent).toContain("img primary")
    expect(shadowContent).toContain("img alternate")
    expect(shadowContent).toContain("https://example.com/image2.jpg")
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

    const shadowContent = getShadowContent(card)
    // Should still render primary image class
    expect(shadowContent).toContain("img primary")
    // But should NOT render the alternate image container or alternate image class
    expect(shadowContent).not.toContain("image alternate")
    expect(shadowContent).not.toContain("img alternate")
  })

  it("should render all features when all attributes are enabled", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const card = (<nosto-simple-card handle="test-product" brand discount rating={3.5} alternate />) as SimpleCard

    await card.connectedCallback()

    const shadowContent = getShadowContent(card)
    expect(shadowContent).toContain("brand")
    expect(shadowContent).toContain("Test Brand")
    expect(shadowContent).toContain("$24.99") // original price shown with discount attribute
    expect(shadowContent).toContain("rating")
    expect(shadowContent).toContain("★★★☆☆ (3.5)")
    expect(shadowContent).toContain("img primary")
    expect(shadowContent).toContain("img alternate")
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

    const shadowContent = getShadowContent(card)
    expect(shadowContent).toContain("image placeholder")
  })

  it("should handle error when product fetch fails", async () => {
    addProductHandlers({
      "missing-product": { status: 404 }
    })

    const card = (<nosto-simple-card handle="missing-product" />) as SimpleCard

    // Since error handling is removed, the component should throw
    await expect(card.connectedCallback()).rejects.toThrow()
  })

  it("should remove loading attribute even when error occurs", async () => {
    addProductHandlers({
      "error-product": { status: 500 }
    })

    const card = (<nosto-simple-card handle="error-product" />) as SimpleCard

    // The component should throw on error, but loading state should be cleaned up
    await expect(card.connectedCallback()).rejects.toThrow()
    expect(card.hasAttribute("loading")).toBe(false)
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
    expect(getShadowContent(card)).toContain("Product 1")

    card.handle = "product-2"
    await card.attributeChangedCallback("handle", "product-1", "product-2")
    expect(getShadowContent(card)).toContain("Product 2")
  })

  it("should escape HTML in product data", async () => {
    const productWithHTML = {
      ...mockProduct,
      title: "<script>alert('xss')</script>Safe Title",
      vendor: "<img src=x onerror=alert('xss')>Brand"
    }

    addProductHandlers({
      "test-product": { product: productWithHTML }
    })

    const card = (<nosto-simple-card handle="test-product" brand />) as SimpleCard

    await card.connectedCallback()

    const shadowContent = getShadowContent(card)
    expect(shadowContent).toContain("&lt;script&gt;")
    expect(shadowContent).toContain("Safe Title")
    expect(shadowContent).toContain("&lt;img") // malicious img tag is escaped
    expect(shadowContent).toContain("Brand") // content is still displayed
    // In text content, script tags should be escaped
    expect(shadowContent).toContain("&lt;script&gt;alert('xss')&lt;/script&gt;Safe Title")
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

    const shadowContent = getShadowContent(card)
    expect(shadowContent).toContain("$9.99")
    expect(shadowContent).toContain("$12.99")
  })

  it("should forward sizes attribute to nosto-image elements", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const sizesValue = "(max-width: 768px) 100vw, 50vw"
    const card = (<nosto-simple-card handle="test-product" sizes={sizesValue} />) as SimpleCard

    await card.connectedCallback()

    const shadowContent = getShadowContent(card)
    expect(shadowContent).toContain(`sizes="${sizesValue}"`)
  })

  it("should forward sizes attribute to both primary and alternate images", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const sizesValue = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    const card = (<nosto-simple-card handle="test-product" alternate sizes={sizesValue} />) as SimpleCard

    await card.connectedCallback()

    const shadowContent = getShadowContent(card)
    // Should contain sizes attribute twice - once for primary, once for alternate
    const sizesMatches = shadowContent.match(new RegExp(`sizes="${sizesValue.replace(/[()]/g, "\\$&")}"`, "g"))
    expect(sizesMatches).toHaveLength(2)
  })

  it("should not add sizes attribute when not provided", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const card = (<nosto-simple-card handle="test-product" />) as SimpleCard

    await card.connectedCallback()

    const shadowContent = getShadowContent(card)
    expect(shadowContent).not.toContain("sizes=")
  })

  it("should include slot for additional content", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const card = (<nosto-simple-card handle="test-product" />) as SimpleCard
    await card.connectedCallback()

    const shadowContent = getShadowContent(card)
    expect(shadowContent).toContain("slot")
    expect(shadowContent).toContain("<slot></slot>")
  })

  it("should handle variant change events and update images", async () => {
    const variantProduct = {
      ...mockProduct,
      options: [
        {
          name: "Color",
          position: 1,
          values: ["Red", "Blue"]
        }
      ],
      variants: [
        {
          id: 1001,
          title: "Red",
          option1: "Red",
          option2: null,
          option3: null,
          sku: "TEST-RED",
          requires_shipping: true,
          taxable: true,
          featured_image: {
            id: 555,
            product_id: 123456,
            position: 2,
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
            alt: "Blue variant image",
            width: 800,
            height: 800,
            src: "https://example.com/red.jpg",
            variant_ids: [1002]
          },
          available: true,
          name: "Red",
          public_title: "Red",
          options: ["Red"],
          price: 2499, // Different price
          weight: 100,
          compare_at_price: 2999,
          inventory_quantity: 10,
          inventory_management: "shopify",
          inventory_policy: "deny",
          barcode: "123456789",
          quantity_rule: { min: 1, max: null, increment: 1 },
          quantity_price_breaks: [],
          requires_selling_plan: false,
          selling_plan_allocations: []
        },
        {
          id: 1002,
          title: "Blue",
          option1: "Blue",
          option2: null,
          option3: null,
          sku: "TEST-BLUE",
          requires_shipping: true,
          taxable: true,
          featured_image: {
            id: 555,
            product_id: 123456,
            position: 2,
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
            alt: "Blue variant image",
            width: 800,
            height: 800,
            src: "https://example.com/blue.jpg",
            variant_ids: [1002]
          },
          available: true,
          name: "Blue",
          public_title: "Blue",
          options: ["Blue"],
          price: 1999,
          weight: 100,
          compare_at_price: 2499,
          inventory_quantity: 5,
          inventory_management: "shopify",
          inventory_policy: "deny",
          barcode: "123456790",
          quantity_rule: { min: 1, max: null, increment: 1 },
          quantity_price_breaks: [],
          requires_selling_plan: false,
          selling_plan_allocations: []
        }
      ]
    } satisfies ShopifyProduct

    addProductHandlers({
      "variant-product": { product: variantProduct }
    })

    const card = (<nosto-simple-card handle="variant-product" />) as SimpleCard
    await card.connectedCallback()

    // Simulate variant change event
    const variantChangeEvent = new CustomEvent("variantchange", {
      detail: {
        variant: variantProduct.variants[1] // Blue variant
      },
      bubbles: true
    })

    card.dispatchEvent(variantChangeEvent)

    // Wait for the event to be processed
    await new Promise(resolve => setTimeout(resolve, 0))

    // Verify that the image was updated to the blue variant
    const primaryImg = card.shadowRoot?.querySelector(".img.primary") as HTMLImageElement
    expect(primaryImg?.src).toBe("https://example.com/blue.jpg")
  })
})
