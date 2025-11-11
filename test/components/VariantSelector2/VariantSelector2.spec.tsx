/** @jsx createElement */
import { describe, it, expect, beforeAll } from "vitest"
import { VariantSelector2 } from "@/components/VariantSelector2/VariantSelector2"
import { addHandlers } from "../../msw.setup"
import { http, HttpResponse } from "msw"
import { createElement } from "../../utils/jsx"
import type { ShopifyProduct } from "@/shopify/types"

// Register the custom element before tests
beforeAll(() => {
  if (!customElements.get("nosto-variant-selector2")) {
    customElements.define("nosto-variant-selector2", VariantSelector2)
  }
})

describe("VariantSelector2", () => {
  const testConfig = {
    storefrontAccessToken: "test-token",
    shopDomain: "test-shop.myshopify.com"
  }

  function addStorefrontHandlers(responses: Record<string, { product?: ShopifyProduct; status?: number }>) {
    addHandlers(
      http.post("*/api/*/graphql.json", async ({ request }) => {
        const body = (await request.json()) as { query: string; variables: { handle: string } }
        const handle = body.variables.handle
        const response = responses[handle]
        if (!response) {
          return HttpResponse.json({ errors: [{ message: "Not Found" }] }, { status: 404 })
        }

        // Convert ShopifyProduct to GraphQL response format
        const product = (response.product || response) as ShopifyProduct
        const gqlProduct = transformToGraphQLResponse(product)
        return HttpResponse.json({ data: { product: gqlProduct } }, { status: response.status || 200 })
      })
    )
  }

  function transformToGraphQLResponse(product: ShopifyProduct) {
    return {
      id: `gid://shopify/Product/${product.id}`,
      title: product.title,
      handle: product.handle,
      description: product.description,
      vendor: product.vendor,
      productType: product.type,
      tags: product.tags,
      createdAt: product.created_at,
      publishedAt: product.published_at,
      availableForSale: product.available,
      priceRange: {
        minVariantPrice: {
          amount: (product.price_min / 100).toFixed(2),
          currencyCode: "USD"
        },
        maxVariantPrice: {
          amount: (product.price_max / 100).toFixed(2),
          currencyCode: "USD"
        }
      },
      compareAtPriceRange: {
        minVariantPrice: product.compare_at_price_min
          ? {
              amount: (product.compare_at_price_min / 100).toFixed(2),
              currencyCode: "USD"
            }
          : null,
        maxVariantPrice: product.compare_at_price_max
          ? {
              amount: (product.compare_at_price_max / 100).toFixed(2),
              currencyCode: "USD"
            }
          : null
      },
      images: {
        edges: product.images.map(url => ({ node: { url, altText: null } }))
      },
      featuredImage: product.featured_image ? { url: product.featured_image, altText: null } : null,
      media: {
        edges: product.media.map(m => ({
          node: {
            id: `gid://shopify/MediaImage/${m.id}`,
            image: {
              url: m.src,
              altText: m.alt,
              width: m.width,
              height: m.height
            },
            mediaContentType: "IMAGE"
          }
        }))
      },
      options: product.options.map(opt => ({
        name: opt.name,
        values: opt.values
      })),
      variants: {
        edges: product.variants.map(v => ({
          node: {
            id: `gid://shopify/ProductVariant/${v.id}`,
            title: v.title,
            availableForSale: v.available,
            sku: v.sku,
            requiresShipping: v.requires_shipping,
            taxable: v.taxable,
            barcode: v.barcode,
            weight: v.weight,
            weightUnit: "KILOGRAMS",
            selectedOptions: v.options.map((value, index) => ({
              name: product.options[index].name,
              value
            })),
            price: {
              amount: (v.price / 100).toFixed(2),
              currencyCode: "USD"
            },
            compareAtPrice: v.compare_at_price
              ? {
                  amount: (v.compare_at_price / 100).toFixed(2),
                  currencyCode: "USD"
                }
              : null,
            image: v.featured_image
              ? {
                  url: v.featured_image.src,
                  altText: v.featured_image.alt,
                  width: v.featured_image.width,
                  height: v.featured_image.height
                }
              : null,
            quantityAvailable: v.inventory_quantity
          }
        }))
      }
    }
  }

  function getShadowContent(selector: VariantSelector2) {
    const shadowContent = selector.shadowRoot?.innerHTML || ""
    return shadowContent.replace(/<style>[\s\S]*?<\/style>/g, "").trim()
  }

  const mockProductWithVariants: ShopifyProduct = {
    id: 123456,
    title: "Variant Test Product",
    handle: "variant-test-product",
    description: "A product with variants for testing",
    vendor: "Test Brand",
    tags: ["test", "variants"],
    images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
    featured_image: "https://example.com/image1.jpg",
    price: 1999,
    compare_at_price: 2499,
    published_at: "2023-01-01T00:00:00Z",
    created_at: "2023-01-01T00:00:00Z",
    type: "Test",
    price_min: 1999,
    price_max: 2999,
    available: true,
    price_varies: true,
    compare_at_price_min: 2499,
    compare_at_price_max: 3499,
    compare_at_price_varies: true,
    url: "/products/variant-test-product",
    media: [
      {
        id: 1,
        src: "https://example.com/image1.jpg",
        alt: "Product image 1",
        position: 1,
        aspect_ratio: 1,
        height: 300,
        width: 300,
        media_type: "image",
        preview_image: {
          aspect_ratio: 1,
          height: 300,
          width: 300,
          src: "https://example.com/image1.jpg"
        }
      }
    ],
    requires_selling_plan: false,
    selling_plan_groups: [],
    options: [
      {
        name: "Size",
        position: 1,
        values: ["Small", "Medium", "Large"]
      },
      {
        name: "Color",
        position: 2,
        values: ["Red", "Blue", "Green"]
      }
    ],
    variants: [
      {
        id: 1001,
        title: "Small / Red",
        option1: "Small",
        option2: "Red",
        option3: null,
        sku: null,
        requires_shipping: true,
        taxable: true,
        featured_image: null,
        available: true,
        name: "Small / Red",
        public_title: null,
        options: ["Small", "Red"],
        price: 1999,
        weight: 100,
        compare_at_price: null,
        inventory_quantity: 10,
        inventory_management: null,
        inventory_policy: "deny",
        barcode: null,
        quantity_rule: { min: 1, max: null, increment: 1 },
        quantity_price_breaks: [],
        requires_selling_plan: false,
        selling_plan_allocations: []
      },
      {
        id: 1002,
        title: "Medium / Blue",
        option1: "Medium",
        option2: "Blue",
        option3: null,
        sku: null,
        requires_shipping: true,
        taxable: true,
        featured_image: null,
        available: true,
        name: "Medium / Blue",
        public_title: null,
        options: ["Medium", "Blue"],
        price: 2499,
        weight: 100,
        compare_at_price: null,
        inventory_quantity: 5,
        inventory_management: null,
        inventory_policy: "deny",
        barcode: null,
        quantity_rule: { min: 1, max: null, increment: 1 },
        quantity_price_breaks: [],
        requires_selling_plan: false,
        selling_plan_allocations: []
      },
      {
        id: 1003,
        title: "Large / Red",
        option1: "Large",
        option2: "Red",
        option3: null,
        sku: null,
        requires_shipping: true,
        taxable: true,
        featured_image: null,
        available: true,
        name: "Large / Red",
        public_title: null,
        options: ["Large", "Red"],
        price: 2999,
        weight: 100,
        compare_at_price: null,
        inventory_quantity: 3,
        inventory_management: null,
        inventory_policy: "deny",
        barcode: null,
        quantity_rule: { min: 1, max: null, increment: 1 },
        quantity_price_breaks: [],
        requires_selling_plan: false,
        selling_plan_allocations: []
      }
    ]
  }

  const mockProductWithoutVariants: ShopifyProduct = {
    ...mockProductWithVariants,
    options: [],
    variants: [
      {
        ...mockProductWithVariants.variants[0],
        id: 2001,
        title: "Default",
        option1: null,
        option2: null,
        options: []
      }
    ]
  }

  it("should be defined as a custom element", () => {
    expect(customElements.get("nosto-variant-selector2")).toBe(VariantSelector2)
  })

  it("should throw an error if handle attribute is not provided", async () => {
    const selector = (
      <nosto-variant-selector2 storefrontAccessToken="token" shopDomain="shop.myshopify.com" />
    ) as VariantSelector2
    await expect(selector.connectedCallback()).rejects.toThrow("Property handle is required.")
  })

  it("should throw an error if storefrontAccessToken attribute is not provided", async () => {
    const selector = (<nosto-variant-selector2 handle="test" shopDomain="shop.myshopify.com" />) as VariantSelector2
    await expect(selector.connectedCallback()).rejects.toThrow("Property storefrontAccessToken is required.")
  })

  it("should throw an error if shopDomain attribute is not provided", async () => {
    const selector = (<nosto-variant-selector2 handle="test" storefrontAccessToken="token" />) as VariantSelector2
    await expect(selector.connectedCallback()).rejects.toThrow("Property shopDomain is required.")
  })

  it("should render variant options for products with multiple variants", async () => {
    addStorefrontHandlers({
      "variant-test-product": { product: mockProductWithVariants }
    })

    const selector = (<nosto-variant-selector2 handle="variant-test-product" {...testConfig} />) as VariantSelector2
    await selector.connectedCallback()

    const shadowContent = getShadowContent(selector)
    expect(shadowContent).toContain("selector")
    expect(shadowContent).toContain("Size:")
    expect(shadowContent).toContain("Color:")
    expect(shadowContent).toContain("Small")
    expect(shadowContent).toContain("Medium")
    expect(shadowContent).toContain("Large")
    expect(shadowContent).toContain("Red")
    expect(shadowContent).toContain("Blue")
    expect(shadowContent).toContain("Green")
  })

  it("should not render selector UI for products without variants but include slot", async () => {
    addStorefrontHandlers({
      "no-variants": { product: mockProductWithoutVariants }
    })

    const selector = (<nosto-variant-selector2 handle="no-variants" {...testConfig} />) as VariantSelector2
    await selector.connectedCallback()

    const shadowContent = getShadowContent(selector)
    expect(shadowContent).toBe("<slot></slot>")
  })

  it("should not preselect by default", async () => {
    addStorefrontHandlers({
      "variant-test-product": { product: mockProductWithVariants }
    })

    const selector = (<nosto-variant-selector2 handle="variant-test-product" {...testConfig} />) as VariantSelector2
    await selector.connectedCallback()

    expect(selector.selectedOptions["Size"]).toBeUndefined()
    expect(selector.selectedOptions["Color"]).toBeUndefined()

    const shadowContent = getShadowContent(selector)
    expect(shadowContent).not.toContain("value active")
  })

  it("should preselect when preselect attribute is present", async () => {
    addStorefrontHandlers({
      "variant-test-product": { product: mockProductWithVariants }
    })

    const selector = (
      <nosto-variant-selector2 handle="variant-test-product" preselect {...testConfig} />
    ) as VariantSelector2
    await selector.connectedCallback()

    expect(selector.selectedOptions["Size"]).toBe("Small")
    expect(selector.selectedOptions["Color"]).toBe("Red")

    expect(selector.shadowRoot!.querySelector("[part='value active']")).toBeTruthy()
  })
})
