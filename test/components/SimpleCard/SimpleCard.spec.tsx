/** @jsx createDOMElement */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { SimpleCard } from "@/components/SimpleCard/SimpleCard"
import { addHandlers } from "../../msw.setup"
import { http, HttpResponse } from "msw"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createDOMElement } from "@/templating/jsx"
import type { ShopifyProduct } from "@/shopify/graphql/types"
import { JSONProduct } from "@nosto/nosto-js/client"
import { toProductId } from "@/shopify/graphql/utils"
import { clearProductCache } from "@/shopify/graphql/fetchProduct"
import { getApiUrl } from "@/shopify/graphql/getApiUrl"
import { mockSimpleCardProduct } from "@/mock/products"

describe("SimpleCard", () => {
  beforeEach(() => {
    clearProductCache()
  })

  function addProductHandlers(responses: Record<string, { product?: ShopifyProduct; status?: number }>) {
    const graphqlPath = getApiUrl().pathname

    addHandlers(
      http.post(graphqlPath, async ({ request }) => {
        const body = (await request.json()) as { variables: { handle: string } }
        const handle = body.variables.handle
        const response = responses[handle]
        if (!response) {
          return HttpResponse.json({ errors: [{ message: "Not Found" }] }, { status: 404 })
        }
        const product = (response.product || response) as ShopifyProduct
        // Wrap images and variants in nodes structure for GraphQL response
        const graphqlProduct = {
          ...product,
          images: { nodes: product.images }
        }
        return HttpResponse.json({ data: { product: graphqlProduct } }, { status: response.status || 200 })
      })
    )
  }

  function getShadowContent(card: SimpleCard) {
    const shadowContent = card.shadowRoot?.innerHTML || ""
    // Remove the style tag and its content to get just the HTML content
    return shadowContent.replace(/<style>[\s\S]*?<\/style>/g, "").trim()
  }

  const mockProduct = mockSimpleCardProduct

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
    const productWithoutDiscount: ShopifyProduct = {
      ...mockProduct,
      price: { currencyCode: "USD", amount: "19.99" },
      compareAtPrice: { currencyCode: "USD", amount: "19.99" }, // same price, no discount
      variants: [
        {
          id: "gid://shopify/ProductVariant/789",
          title: "Default Title",
          availableForSale: true,
          selectedOptions: [],
          price: { currencyCode: "USD", amount: "19.99" },
          compareAtPrice: { currencyCode: "USD", amount: "19.99" }, // same price, no discount
          product: { id: "gid://shopify/Product/123", onlineStoreUrl: "/products/test-product" }
        }
      ]
    }

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

  it('should render alternate image when image-mode="alternate"', async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const card = (<nosto-simple-card handle="test-product" image-mode="alternate" />) as SimpleCard

    await card.connectedCallback()

    const shadowContent = getShadowContent(card)
    expect(shadowContent).toContain("img primary")
    expect(shadowContent).toContain("img alternate")
    expect(shadowContent).toContain("https://example.com/image2.jpg")
  })

  it('should not render alternate image when product has only one image with image-mode="alternate"', async () => {
    const productWithOneImage = {
      ...mockProduct,
      images: [mockProduct.images[0]] // only one image
    }

    addProductHandlers({
      "test-product": { product: productWithOneImage }
    })

    const card = (<nosto-simple-card handle="test-product" image-mode="alternate" />) as SimpleCard

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

    const card = (
      <nosto-simple-card handle="test-product" brand discount rating={3.5} image-mode="alternate" />
    ) as SimpleCard

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
    const product1: ShopifyProduct = { ...mockProduct, title: "Product 1" }
    const product2: ShopifyProduct = {
      ...mockProduct,
      images: [
        {
          altText: "Product image 3",
          height: 400,
          width: 400,
          thumbhash: null,
          url: "https://example.com/image3.jpg"
        },
        {
          altText: "Product image 4",
          height: 400,
          width: 400,
          thumbhash: null,
          url: "https://example.com/image4.jpg"
        }
      ],
      featuredImage: {
        altText: "Product image 3",
        height: 400,
        width: 400,
        thumbhash: null,
        url: "https://example.com/image3.jpg"
      },
      title: "Product 2"
    }

    addProductHandlers({
      "product-1": { product: product1 },
      "product-2": { product: product2 }
    })

    const card = (<nosto-simple-card handle="product-1" />) as SimpleCard
    document.body.appendChild(card)

    await card.connectedCallback()
    expect(getShadowContent(card)).toContain("Product 1")
    expect(getShadowContent(card)).toContain("https://example.com/image1.jpg")

    card.handle = "product-2"
    await card.attributeChangedCallback("handle", "product-1", "product-2")
    expect(getShadowContent(card)).toContain("Product 2")
    expect(getShadowContent(card)).toContain("https://example.com/image3.jpg")
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
    const productWithDifferentPrice: ShopifyProduct = {
      ...mockProduct,
      price: { currencyCode: "USD", amount: "9.99" },
      compareAtPrice: { currencyCode: "USD", amount: "12.99" },
      variants: [
        {
          id: "gid://shopify/ProductVariant/789",
          title: "Default Title",
          availableForSale: true,
          selectedOptions: [],
          price: { currencyCode: "USD", amount: "9.99" },
          compareAtPrice: { currencyCode: "USD", amount: "12.99" },
          product: { id: "gid://shopify/Product/123", onlineStoreUrl: "/products/test-product" }
        }
      ]
    }

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
    const card = (<nosto-simple-card handle="test-product" image-mode="alternate" sizes={sizesValue} />) as SimpleCard

    await card.connectedCallback()

    const shadowContent = getShadowContent(card)
    // Should contain sizes attribute twice - once for primary, once for alternate
    const sizesMatches = shadowContent.match(new RegExp(`sizes="${sizesValue.replace(/[()]/g, "\\$&")}"`, "g"))
    expect(sizesMatches).toHaveLength(2)
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
    const variantProduct: ShopifyProduct = {
      ...mockProduct,
      options: [
        {
          name: "Color",
          optionValues: [
            {
              name: "Red",
              swatch: null,
              firstSelectableVariant: {
                id: "gid://shopify/ProductVariant/1001",
                title: "Red",
                availableForSale: true,
                price: { currencyCode: "USD", amount: "24.99" },
                compareAtPrice: { currencyCode: "USD", amount: "29.99" },
                product: { id: "gid://shopify/Product/456", onlineStoreUrl: "/products/variant-product" }
              }
            },
            {
              name: "Blue",
              swatch: null,
              firstSelectableVariant: {
                id: "gid://shopify/ProductVariant/1002",
                title: "Blue",
                availableForSale: true,
                price: { currencyCode: "USD", amount: "19.99" },
                compareAtPrice: { currencyCode: "USD", amount: "24.99" },
                product: { id: "gid://shopify/Product/456", onlineStoreUrl: "/products/variant-product" }
              }
            }
          ]
        }
      ],
      variants: [
        {
          id: "gid://shopify/ProductVariant/1001",
          title: "Red",
          availableForSale: true,
          selectedOptions: [{ name: "Color", value: "Red" }],
          image: {
            altText: "Red variant image",
            height: 800,
            width: 800,
            thumbhash: null,
            url: "https://example.com/red.jpg"
          },
          price: { currencyCode: "USD", amount: "24.99" },
          compareAtPrice: { currencyCode: "USD", amount: "29.99" },
          product: { id: "gid://shopify/Product/456", onlineStoreUrl: "/products/variant-product" }
        },
        {
          id: "gid://shopify/ProductVariant/1002",
          title: "Blue",
          availableForSale: true,
          selectedOptions: [{ name: "Color", value: "Blue" }],
          image: {
            altText: "Blue variant image",
            height: 800,
            width: 800,
            thumbhash: null,
            url: "https://example.com/blue.jpg"
          },
          price: { currencyCode: "USD", amount: "19.99" },
          compareAtPrice: { currencyCode: "USD", amount: "24.99" },
          product: { id: "gid://shopify/Product/456", onlineStoreUrl: "/products/variant-product" }
        }
      ]
    }

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

  it("should emit SimpleCard/rendered event when content is loaded", async () => {
    const validProduct = { ...mockProduct, title: "Event Test Product" }
    addProductHandlers({
      "event-test-handle": { product: validProduct }
    })

    const card = (<nosto-simple-card handle="event-test-handle" />) as SimpleCard

    // Set up event listener to capture the event
    let eventEmitted = false
    card.addEventListener("@nosto/SimpleCard/rendered", () => {
      eventEmitted = true
    })

    // Call connectedCallback manually since it's not automatically triggered in tests
    await card.connectedCallback()

    expect(getShadowContent(card)).toContain("Event Test Product")
    expect(eventEmitted).toBe(true)
    expect(card.hasAttribute("loading")).toBe(false)
  })

  it("should emit SimpleCard/rendered event when product property is set", async () => {
    // Set up mock for the network fetch that will also happen
    addProductHandlers({
      "test-handle": { product: mockProduct }
    })

    const mockJSONProduct: JSONProduct = {
      image_url: "https://example.com/json-product.jpg",
      alternate_image_urls: ["https://example.com/json-alt.jpg"],
      name: "JSON Product Test",
      brand: "JSON Brand",
      url: "https://example.com/json-product",
      list_price: 2999,
      price: 1999,
      price_currency_code: "USD"
    } as JSONProduct

    const card = (<nosto-simple-card handle="test-handle" />) as SimpleCard
    card.product = mockJSONProduct

    // Set up event listener to capture the event
    let eventCount = 0
    card.addEventListener("@nosto/SimpleCard/rendered", () => {
      eventCount++
    })

    // Call connectedCallback manually - this should render using the product property AND fetch
    await card.connectedCallback()

    // Final content should be from fetched data (network overrides product property)
    expect(getShadowContent(card)).toContain("Awesome Test Product")
    // Should be called only once for product property render (network fetch doesn't emit when product property exists)
    expect(eventCount).toBe(1)
  })

  describe("Mock Mode", () => {
    it("should render all mock features when all attributes are enabled", async () => {
      const card = (<nosto-simple-card handle="test-handle" mock brand discount rating={3.5} />) as SimpleCard

      await card.connectedCallback()

      const shadowContent = getShadowContent(card)
      expect(shadowContent).toContain("Mock Product")
      expect(shadowContent).toContain("Mock Brand")
      expect(shadowContent).toContain("$12.00") // original price
      expect(shadowContent).toContain("$10.00") // sale price
      expect(shadowContent).toContain("★★★☆☆ (3.5)")
    })

    it("should emit rendered event when mock mode is enabled", async () => {
      const card = (<nosto-simple-card handle="test-handle" mock />) as SimpleCard

      const renderedEvent = vi.fn()
      card.addEventListener("@nosto/SimpleCard/rendered", renderedEvent)

      await card.connectedCallback()

      expect(renderedEvent).toHaveBeenCalled()
    })

    it("should not fetch from Shopify when mock mode is enabled", async () => {
      let fetchCalled = false
      addProductHandlers({
        "test-handle": {
          product: {
            ...mockProduct,
            get id() {
              fetchCalled = true
              return toProductId(123)
            }
          }
        }
      })

      const card = (<nosto-simple-card handle="test-handle" mock />) as SimpleCard

      await card.connectedCallback()

      const shadowContent = getShadowContent(card)
      expect(shadowContent).toContain("Mock Product")
      expect(fetchCalled).toBe(false)
    })
  })

  describe("Carousel Mode", () => {
    it('should render carousel when image-mode="carousel"', async () => {
      addProductHandlers({
        "test-product": { product: mockProduct }
      })

      const card = (<nosto-simple-card handle="test-product" image-mode="carousel" />) as SimpleCard

      await card.connectedCallback()

      const shadowContent = getShadowContent(card)
      expect(shadowContent).toContain("carousel")
      expect(shadowContent).toContain("carousel-images")
      expect(shadowContent).toContain("carousel-indicators")
    })

    it('should not render carousel when product has only one image with image-mode="carousel"', async () => {
      const productWithOneImage = {
        ...mockProduct,
        images: [mockProduct.images[0]]
      }

      addProductHandlers({
        "test-product": { product: productWithOneImage }
      })

      const card = (<nosto-simple-card handle="test-product" image-mode="carousel" />) as SimpleCard

      await card.connectedCallback()

      const shadowContent = getShadowContent(card)
      expect(shadowContent).not.toContain("carousel-images")
    })

    it("should render carousel indicators for each image", async () => {
      addProductHandlers({
        "test-product": { product: mockProduct }
      })

      const card = (<nosto-simple-card handle="test-product" image-mode="carousel" />) as SimpleCard

      await card.connectedCallback()

      const indicators = card.shadowRoot?.querySelectorAll(".carousel-indicator")
      expect(indicators?.length).toBe(2) // mockProduct has 2 images
    })

    it("should support horizontal scroll for navigation", async () => {
      addProductHandlers({
        "test-product": { product: mockProduct }
      })

      const card = (<nosto-simple-card handle="test-product" image-mode="carousel" />) as SimpleCard
      document.body.appendChild(card)

      await card.connectedCallback()

      const carouselImages = card.shadowRoot?.querySelector(".carousel-images") as HTMLElement

      expect(carouselImages).toBeTruthy()
      // Check that scroll container exists for horizontal scrolling
      expect(carouselImages.classList.contains("carousel-images")).toBe(true)

      document.body.removeChild(card)
    })

    it("should navigate to specific image when indicator is clicked", async () => {
      addProductHandlers({
        "test-product": { product: mockProduct }
      })

      const card = (<nosto-simple-card handle="test-product" image-mode="carousel" />) as SimpleCard
      document.body.appendChild(card)

      await card.connectedCallback()

      const indicators = card.shadowRoot?.querySelectorAll(".carousel-indicator")
      const slides = card.shadowRoot?.querySelectorAll(".carousel-slide")

      expect(indicators?.[0]?.classList.contains("active")).toBe(true)
      expect(indicators?.[1]?.classList.contains("active")).toBe(false)

      // Mock scrollIntoView for the second slide
      const scrollIntoViewMock = vi.fn()
      slides?.forEach(slide => {
        slide.scrollIntoView = scrollIntoViewMock
      })

      // Click on second indicator
      const secondIndicator = indicators?.[1] as HTMLButtonElement
      secondIndicator.click()

      // Verify scrollIntoView was called
      expect(scrollIntoViewMock).toHaveBeenCalledWith({
        behavior: "smooth",
        block: "nearest",
        inline: "start"
      })

      document.body.removeChild(card)
    })
  })

  describe("Image Mode", () => {
    it("should render basic image without alternate or carousel when image-mode is not set", async () => {
      addProductHandlers({
        "test-product": { product: mockProduct }
      })

      const card = (<nosto-simple-card handle="test-product" />) as SimpleCard

      await card.connectedCallback()

      const shadowContent = getShadowContent(card)
      expect(shadowContent).toContain("img primary")
      expect(shadowContent).not.toContain("img alternate")
      expect(shadowContent).not.toContain("carousel")
    })
  })
})
