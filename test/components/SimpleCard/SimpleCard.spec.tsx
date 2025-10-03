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
    available: true, // Product is available
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
    expect(shadowContent).toContain("simple-card")
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
    expect(shadowContent).toContain("simple-card__brand")
    expect(shadowContent).toContain("Test Brand")
  })

  it("should not render brand when brand attribute is disabled", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const card = (<nosto-simple-card handle="test-product" />) as SimpleCard

    await card.connectedCallback()

    const shadowContent = getShadowContent(card)
    expect(shadowContent).not.toContain("simple-card__brand")
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
    expect(shadowContent).not.toContain("simple-card__price-original")
  })

  it("should render rating when rating attribute is provided", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const card = (<nosto-simple-card handle="test-product" rating={4.2} />) as SimpleCard

    await card.connectedCallback()

    const shadowContent = getShadowContent(card)
    expect(shadowContent).toContain("simple-card__rating")
    expect(shadowContent).toContain("★★★★☆ (4.2)")
  })

  it("should render alternate image when alternate attribute is enabled", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const card = (<nosto-simple-card handle="test-product" alternate />) as SimpleCard

    await card.connectedCallback()

    const shadowContent = getShadowContent(card)
    expect(shadowContent).toContain("simple-card__img--primary")
    expect(shadowContent).toContain("simple-card__img--alternate")
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
    expect(shadowContent).toContain("simple-card__img--primary")
    // But should NOT render the alternate image container or alternate image class
    expect(shadowContent).not.toContain("simple-card__image--alternate")
    expect(shadowContent).not.toContain("simple-card__img--alternate")
  })

  it("should render all features when all attributes are enabled", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const card = (<nosto-simple-card handle="test-product" brand discount rating={3.5} alternate />) as SimpleCard

    await card.connectedCallback()

    const shadowContent = getShadowContent(card)
    expect(shadowContent).toContain("simple-card__brand")
    expect(shadowContent).toContain("Test Brand")
    expect(shadowContent).toContain("$24.99") // original price shown with discount attribute
    expect(shadowContent).toContain("simple-card__rating")
    expect(shadowContent).toContain("★★★☆☆ (3.5)")
    expect(shadowContent).toContain("simple-card__img--primary")
    expect(shadowContent).toContain("simple-card__img--alternate")
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
    expect(shadowContent).toContain("simple-card__image--placeholder")
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
    expect(getShadowContent(card)).toContain("Product 1")

    card.handle = "product-2"
    await card.attributeChangedCallback()
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

  describe("New features", () => {
    const mockProductWithColors = {
      ...mockProduct,
      available: true, // Ensure it's available
      options: [
        {
          name: "Color",
          position: 1,
          values: ["Red", "Blue", "Green", "Yellow", "Black"]
        },
        {
          name: "Size",
          position: 2,
          values: ["S", "M", "L"]
        }
      ]
    } as ShopifyProduct

    it("should render swatches when swatches attribute is enabled", async () => {
      addProductHandlers({
        "test-product": { product: mockProductWithColors }
      })

      const card = (<nosto-simple-card handle="test-product" swatches />) as SimpleCard

      await card.connectedCallback()

      const shadowContent = getShadowContent(card)
      expect(shadowContent).toContain("simple-card__swatches")
      expect(shadowContent).toContain("simple-card__swatch")
      expect(shadowContent).toContain("title=\"Red\"")
      expect(shadowContent).toContain("title=\"Blue\"")
      expect(shadowContent).toContain("title=\"Green\"")
    })

    it("should limit swatches when maxSwatches attribute is set", async () => {
      addProductHandlers({
        "test-product": { product: mockProductWithColors }
      })

      const card = (<nosto-simple-card handle="test-product" swatches max-swatches="3" />) as SimpleCard

      await card.connectedCallback()

      const shadowContent = getShadowContent(card)
      expect(shadowContent).toContain("simple-card__swatches")
      expect(shadowContent).toContain("simple-card__swatch-more")
      expect(shadowContent).toContain("+2") // 5 colors - 3 shown = 2 more
    })

    it("should not render swatches when product has no color options", async () => {
      const productWithoutColors = {
        ...mockProduct,
        options: [{ name: "Size", position: 1, values: ["S", "M", "L"] }]
      } as ShopifyProduct

      addProductHandlers({
        "test-product": { product: productWithoutColors }
      })

      const card = (<nosto-simple-card handle="test-product" swatches />) as SimpleCard

      await card.connectedCallback()

      const shadowContent = getShadowContent(card)
      expect(shadowContent).not.toContain("simple-card__swatches")
    })

    it("should render sold out badge when oosBadge is enabled and product is unavailable", async () => {
      const unavailableProduct = {
        ...mockProduct,
        available: false
      } as ShopifyProduct

      addProductHandlers({
        "test-product": { product: unavailableProduct }
      })

      const card = (<nosto-simple-card handle="test-product" oos-badge />) as SimpleCard

      await card.connectedCallback()

      const shadowContent = getShadowContent(card)
      expect(shadowContent).toContain("simple-card__badge--oos")
      expect(shadowContent).toContain("Sold Out")
    })

    it("should not render sold out badge when product is available", async () => {
      addProductHandlers({
        "test-product": { product: mockProduct }
      })

      const card = (<nosto-simple-card handle="test-product" oos-badge />) as SimpleCard

      await card.connectedCallback()

      const shadowContent = getShadowContent(card)
      expect(shadowContent).not.toContain("simple-card__badge--oos")
    })

    it("should render sale badge with text when saleBadge is enabled", async () => {
      addProductHandlers({
        "test-product": { product: mockProduct }
      })

      const card = (<nosto-simple-card handle="test-product" sale-badge />) as SimpleCard

      await card.connectedCallback()

      const shadowContent = getShadowContent(card)
      expect(shadowContent).toContain("simple-card__badge--sale")
      expect(shadowContent).toContain("Sale")
    })

    it("should render sale badge with percentage when saleBadgeType is percentage", async () => {
      addProductHandlers({
        "test-product": { product: mockProduct }
      })

      const card = (
        <nosto-simple-card handle="test-product" sale-badge sale-badge-type="percentage" />
      ) as SimpleCard

      await card.connectedCallback()

      const shadowContent = getShadowContent(card)
      expect(shadowContent).toContain("simple-card__badge--sale")
      expect(shadowContent).toContain("-20%") // (2499-1999)/2499 = 20%
    })

    it("should render sale badge with fixed amount when saleBadgeType is fixed", async () => {
      addProductHandlers({
        "test-product": { product: mockProduct }
      })

      const card = (<nosto-simple-card handle="test-product" sale-badge sale-badge-type="fixed" />) as SimpleCard

      await card.connectedCallback()

      const shadowContent = getShadowContent(card)
      expect(shadowContent).toContain("simple-card__badge--sale")
      expect(shadowContent).toContain("-$5.00") // 2499-1999 = 500 cents = $5.00
    })

    it("should not render sale badge when discount is not enabled or no discount exists", async () => {
      const productWithoutDiscount = {
        ...mockProduct,
        compare_at_price: null
      } as ShopifyProduct

      addProductHandlers({
        "test-product": { product: productWithoutDiscount }
      })

      const card = (<nosto-simple-card handle="test-product" sale-badge />) as SimpleCard

      await card.connectedCallback()

      const shadowContent = getShadowContent(card)
      expect(shadowContent).not.toContain("simple-card__badge--sale")
    })

    it("should forward sizes attribute to nosto-image", async () => {
      addProductHandlers({
        "test-product": { product: mockProduct }
      })

      const card = (
        <nosto-simple-card handle="test-product" sizes="(max-width: 768px) 100vw, 50vw" />
      ) as SimpleCard

      await card.connectedCallback()

      const shadowContent = getShadowContent(card)
      expect(shadowContent).toContain('sizes="(max-width: 768px) 100vw, 50vw"')
    })

    it("should render multiple badges together", async () => {
      const unavailableDiscountedProduct = {
        ...mockProduct,
        available: false
      } as ShopifyProduct

      addProductHandlers({
        "test-product": { product: unavailableDiscountedProduct }
      })

      const card = (<nosto-simple-card handle="test-product" oos-badge sale-badge />) as SimpleCard

      await card.connectedCallback()

      const shadowContent = getShadowContent(card)
      expect(shadowContent).toContain("simple-card__badge--oos")
      expect(shadowContent).toContain("simple-card__badge--sale")
      expect(shadowContent).toContain("Sold Out")
      expect(shadowContent).toContain("Sale")
    })

    it("should render all new features together", async () => {
      addProductHandlers({
        "test-product": { product: mockProductWithColors }
      })

      const card = (
        <nosto-simple-card
          handle="test-product"
          swatches
          max-swatches="2"
          sale-badge
          sale-badge-type="percentage"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) as SimpleCard

      await card.connectedCallback()

      const shadowContent = getShadowContent(card)
      expect(shadowContent).toContain("simple-card__swatches")
      expect(shadowContent).toContain("simple-card__swatch-more")
      expect(shadowContent).toContain("+3") // 5 colors - 2 shown = 3 more
      expect(shadowContent).toContain("simple-card__badge--sale")
      expect(shadowContent).toContain("-20%")
      expect(shadowContent).toContain('sizes="(max-width: 768px) 100vw, 50vw"')
    })
  })
})
