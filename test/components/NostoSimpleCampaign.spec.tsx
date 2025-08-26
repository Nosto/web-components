/** @jsx createElement */
import { describe, it, expect, vi, beforeAll, afterEach } from "vitest"
import { NostoSimpleCampaign } from "@/components/NostoSimpleCampaign/NostoSimpleCampaign"
import { mockNostoRecs } from "../mockNostoRecs"
import { createElement } from "../utils/jsx"

beforeAll(() => {
  if (!customElements.get("nosto-simple-campaign")) {
    customElements.define("nosto-simple-campaign", NostoSimpleCampaign)
  }
})

describe("NostoSimpleCampaign", () => {
  let campaign: NostoSimpleCampaign

  afterEach(() => {
    vi.clearAllMocks()
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

  it("should render empty content when no products are returned", async () => {
    mockNostoRecs({ "empty-placement": { products: [] } })

    campaign = (<nosto-simple-campaign placement="empty-placement" />) as NostoSimpleCampaign
    await campaign.connectedCallback()

    expect(campaign.innerHTML).toBe("")
  })

  it("should render in grid mode by default", async () => {
    const mockProducts = [
      {
        name: "Test Product 1",
        price_text: "$19.99",
        thumb_url: "https://example.com/image1.jpg",
        url: "/products/test-product-1"
      },
      {
        name: "Test Product 2",
        price_text: "$29.99",
        thumb_url: "https://example.com/image2.jpg",
        url: "/products/test-product-2"
      }
    ]

    mockNostoRecs({ "grid-placement": { products: mockProducts } })

    campaign = (<nosto-simple-campaign placement="grid-placement" />) as NostoSimpleCampaign
    await campaign.connectedCallback()

    expect(campaign.innerHTML).toContain('class="nosto-simple-campaign nosto-grid"')
    expect(campaign.innerHTML).toContain('class="nosto-grid-container"')
    expect(campaign.innerHTML).toContain("Test Product 1")
    expect(campaign.innerHTML).toContain("Test Product 2")
    expect(campaign.innerHTML).toContain("$19.99")
    expect(campaign.innerHTML).toContain("$29.99")
  })

  it("should render in carousel mode when specified", async () => {
    const mockProducts = [
      {
        name: "Carousel Product",
        price_text: "$39.99",
        thumb_url: "https://example.com/carousel.jpg",
        url: "/products/carousel-product"
      }
    ]

    mockNostoRecs({ "carousel-placement": { products: mockProducts } })

    campaign = (<nosto-simple-campaign placement="carousel-placement" mode="carousel" />) as NostoSimpleCampaign
    await campaign.connectedCallback()

    expect(campaign.innerHTML).toContain('class="nosto-simple-campaign nosto-carousel"')
    expect(campaign.innerHTML).toContain('class="nosto-carousel-container"')
    expect(campaign.innerHTML).toContain("Carousel Product")
  })

  it("should render in bundle mode when specified", async () => {
    const mockProducts = [
      {
        name: "Bundle Product",
        price_text: "$49.99",
        thumb_url: "https://example.com/bundle.jpg",
        url: "/products/bundle-product"
      }
    ]

    mockNostoRecs({ "bundle-placement": { products: mockProducts } })

    campaign = (<nosto-simple-campaign placement="bundle-placement" mode="bundle" />) as NostoSimpleCampaign
    await campaign.connectedCallback()

    expect(campaign.innerHTML).toContain('class="nosto-simple-campaign nosto-bundle"')
    expect(campaign.innerHTML).toContain('class="nosto-bundle-container"')
    expect(campaign.innerHTML).toContain("Bundle Product")
  })

  it("should use NostoDynamicCard when card attribute is provided", async () => {
    const mockProducts = [
      {
        name: "Dynamic Card Product",
        url: "/products/dynamic-card-product"
      },
      {
        name: "Another Product",
        url: "/products/another-product"
      }
    ]

    mockNostoRecs({ "dynamic-placement": { products: mockProducts } })

    campaign = (
      <nosto-simple-campaign placement="dynamic-placement" mode="grid" card="product-card-template" />
    ) as NostoSimpleCampaign
    await campaign.connectedCallback()

    expect(campaign.innerHTML).toContain("<nosto-dynamic-card")
    expect(campaign.innerHTML).toContain('handle="dynamic-card-product"')
    expect(campaign.innerHTML).toContain('handle="another-product"')
    expect(campaign.innerHTML).toContain('template="product-card-template"')
    expect(campaign.innerHTML).toContain('class="nosto-simple-campaign nosto-grid"')
  })

  it("should include variant-id in NostoDynamicCard when provided", async () => {
    const mockProducts = [
      {
        name: "Variant Product",
        url: "/products/variant-product"
      }
    ]

    mockNostoRecs({ "variant-placement": { products: mockProducts } })

    campaign = (
      <nosto-simple-campaign placement="variant-placement" card="product-card" variantId="12345" />
    ) as NostoSimpleCampaign
    await campaign.connectedCallback()

    expect(campaign.innerHTML).toContain("<nosto-dynamic-card")
    expect(campaign.innerHTML).toContain('variant-id="12345"')
  })

  it("should handle products without images gracefully", async () => {
    const mockProducts = [
      {
        name: "No Image Product",
        price_text: "$15.99",
        url: "/products/no-image-product"
      }
    ]

    mockNostoRecs({ "no-image-placement": { products: mockProducts } })

    campaign = (<nosto-simple-campaign placement="no-image-placement" />) as NostoSimpleCampaign
    await campaign.connectedCallback()

    expect(campaign.innerHTML).toContain("No Image Product")
    expect(campaign.innerHTML).toContain("$15.99")
    expect(campaign.innerHTML).not.toContain("<img")
  })

  it("should extract product handle from different URL formats", async () => {
    const mockProducts = [
      {
        name: "Product with query params",
        url: "/products/test-handle?variant=123"
      },
      {
        name: "Product with hash",
        url: "/products/another-handle#section"
      }
    ]

    mockNostoRecs({ "url-test-placement": { products: mockProducts } })

    campaign = (<nosto-simple-campaign placement="url-test-placement" card="test-template" />) as NostoSimpleCampaign
    await campaign.connectedCallback()

    expect(campaign.innerHTML).toContain('handle="test-handle"')
    expect(campaign.innerHTML).toContain('handle="another-handle"')
  })

  it("should skip products without valid handles when using dynamic cards", async () => {
    const mockProducts = [
      {
        name: "Valid Product",
        url: "/products/valid-handle"
      },
      {
        name: "Invalid Product",
        url: "/invalid/url"
      },
      {
        name: "Another Valid Product",
        url: "/products/another-valid"
      }
    ]

    mockNostoRecs({ "mixed-placement": { products: mockProducts } })

    campaign = (<nosto-simple-campaign placement="mixed-placement" card="test-template" />) as NostoSimpleCampaign
    await campaign.connectedCallback()

    expect(campaign.innerHTML).toContain('handle="valid-handle"')
    expect(campaign.innerHTML).toContain('handle="another-valid"')
    expect(campaign.innerHTML).not.toContain('handle="invalid"')
    // Should only have 2 nosto-dynamic-card elements
    expect((campaign.innerHTML.match(/<nosto-dynamic-card/g) || []).length).toBe(2)
  })
})
