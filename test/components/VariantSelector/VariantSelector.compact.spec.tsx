/** @jsx createElement */
import { describe, it, expect, beforeEach } from "vitest"
import { VariantSelector } from "@/components/VariantSelector/VariantSelector"
import { addHandlers } from "../../msw.setup"
import { http, HttpResponse } from "msw"
import { createElement } from "../../utils/jsx"
import type { ShopifyProduct, VariantChangeDetail } from "@/shopify/graphql/types"
import { mockProductWithSingleValueOptionTest } from "@/mock/products"
import { clearProductCache } from "@/shopify/graphql/fetchProduct"
import { getApiUrl } from "@/shopify/graphql/constants"

describe("VariantSelector - Compact Mode", () => {
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

  function getShadowContent(selector: VariantSelector) {
    const shadowContent = selector.shadowRoot?.innerHTML || ""
    return shadowContent.replace(/<style>[\s\S]*?<\/style>/g, "").trim()
  }

  const mockProductWithVariants: ShopifyProduct = {
    id: "gid://shopify/Product/123456",
    title: "Variant Test Product",
    vendor: "Test Brand",
    description: "A product with variants for testing",
    encodedVariantExistence: "",
    onlineStoreUrl: "/products/variant-test-product",
    availableForSale: true,
    adjacentVariants: [],
    images: [
      {
        altText: "Product image 1",
        height: 300,
        width: 300,
        thumbhash: null,
        url: "https://example.com/image1.jpg"
      },
      {
        altText: "Product image 2",
        height: 300,
        width: 300,
        thumbhash: null,
        url: "https://example.com/image2.jpg"
      }
    ],
    featuredImage: {
      altText: "Product image 1",
      height: 300,
      width: 300,
      thumbhash: null,
      url: "https://example.com/image1.jpg"
    },
    options: [
      {
        name: "Size",
        optionValues: [
          {
            name: "Small",
            swatch: null,
            firstSelectableVariant: {
              id: "gid://shopify/ProductVariant/1001",
              title: "Small / Red",
              availableForSale: true,
              price: { currencyCode: "USD", amount: "19.99" },
              compareAtPrice: null,
              product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
            }
          },
          {
            name: "Medium",
            swatch: null,
            firstSelectableVariant: {
              id: "gid://shopify/ProductVariant/1002",
              title: "Medium / Blue",
              availableForSale: true,
              price: { currencyCode: "USD", amount: "24.99" },
              compareAtPrice: null,
              product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
            }
          },
          {
            name: "Large",
            swatch: null,
            firstSelectableVariant: {
              id: "gid://shopify/ProductVariant/1003",
              title: "Large / Red",
              availableForSale: true,
              price: { currencyCode: "USD", amount: "29.99" },
              compareAtPrice: null,
              product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
            }
          }
        ]
      },
      {
        name: "Color",
        optionValues: [
          {
            name: "Red",
            swatch: null,
            firstSelectableVariant: {
              id: "gid://shopify/ProductVariant/1001",
              title: "Small / Red",
              availableForSale: true,
              price: { currencyCode: "USD", amount: "19.99" },
              compareAtPrice: null,
              product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
            }
          },
          {
            name: "Blue",
            swatch: null,
            firstSelectableVariant: {
              id: "gid://shopify/ProductVariant/1002",
              title: "Medium / Blue",
              availableForSale: true,
              price: { currencyCode: "USD", amount: "24.99" },
              compareAtPrice: null,
              product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
            }
          },
          {
            name: "Green",
            swatch: null,
            firstSelectableVariant: {
              id: "gid://shopify/ProductVariant/1004",
              title: "Small / Green",
              availableForSale: true,
              price: { currencyCode: "USD", amount: "19.99" },
              compareAtPrice: null,
              product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
            }
          }
        ]
      }
    ],
    price: { currencyCode: "USD", amount: "19.99" },
    compareAtPrice: null,
    variants: [
      {
        id: "gid://shopify/ProductVariant/1001",
        title: "Small / Red",
        availableForSale: true,
        selectedOptions: [
          { name: "Size", value: "Small" },
          { name: "Color", value: "Red" }
        ],
        price: { currencyCode: "USD", amount: "19.99" },
        compareAtPrice: null,
        product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
      },
      {
        id: "gid://shopify/ProductVariant/1002",
        title: "Medium / Blue",
        availableForSale: true,
        selectedOptions: [
          { name: "Size", value: "Medium" },
          { name: "Color", value: "Blue" }
        ],
        price: { currencyCode: "USD", amount: "24.99" },
        compareAtPrice: null,
        product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
      },
      {
        id: "gid://shopify/ProductVariant/1003",
        title: "Large / Red",
        availableForSale: true,
        selectedOptions: [
          { name: "Size", value: "Large" },
          { name: "Color", value: "Red" }
        ],
        price: { currencyCode: "USD", amount: "29.99" },
        compareAtPrice: null,
        product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
      }
    ]
  }

  it("should render a dropdown in compact mode", async () => {
    addProductHandlers({
      "variant-test-product": { product: mockProductWithVariants }
    })

    const selector = (<nosto-variant-selector handle="variant-test-product" mode="compact" />) as VariantSelector
    await selector.connectedCallback()

    const shadowContent = getShadowContent(selector)
    expect(shadowContent).toContain("compact-selector")
    expect(shadowContent).toContain("variant-dropdown")
    expect(shadowContent).toContain("<select")
  })

  it("should render all variants as dropdown options in compact mode", async () => {
    addProductHandlers({
      "variant-test-product": { product: mockProductWithVariants }
    })

    const selector = (<nosto-variant-selector handle="variant-test-product" mode="compact" />) as VariantSelector
    await selector.connectedCallback()

    const dropdown = selector.shadowRoot!.querySelector(".variant-dropdown") as HTMLSelectElement
    expect(dropdown).toBeTruthy()

    const options = dropdown.querySelectorAll("option")
    expect(options.length).toBe(3) // Small/Red, Medium/Blue, Large/Red

    expect(options[0].value).toBe("gid://shopify/ProductVariant/1001")
    expect(options[0].textContent).toContain("Small / Red")
    expect(options[0].disabled).toBe(false)

    expect(options[1].value).toBe("gid://shopify/ProductVariant/1002")
    expect(options[1].textContent).toContain("Medium / Blue")
    expect(options[1].disabled).toBe(false)

    expect(options[2].value).toBe("gid://shopify/ProductVariant/1003")
    expect(options[2].textContent).toContain("Large / Red")
    expect(options[2].disabled).toBe(false)
  })

  it("should mark unavailable variants as disabled in compact mode", async () => {
    const productWithUnavailableVariants = {
      ...mockProductWithVariants,
      variants: [
        ...mockProductWithVariants.variants.map((v, idx) => ({
          ...v,
          availableForSale: idx === 1 // Only Medium/Blue is available
        }))
      ]
    }

    addProductHandlers({
      "variant-test-product": { product: productWithUnavailableVariants }
    })

    const selector = (<nosto-variant-selector handle="variant-test-product" mode="compact" />) as VariantSelector
    await selector.connectedCallback()

    const dropdown = selector.shadowRoot!.querySelector(".variant-dropdown") as HTMLSelectElement
    const options = dropdown.querySelectorAll("option")

    expect(options[0].disabled).toBe(true)
    expect(options[1].disabled).toBe(false)
    expect(options[2].disabled).toBe(true)
  })

  it("should preselect first available variant in compact mode when preselect is true", async () => {
    const productWithUnavailableVariants = {
      ...mockProductWithVariants,
      variants: [
        ...mockProductWithVariants.variants.map((v, idx) => ({
          ...v,
          availableForSale: idx !== 0 // First variant is unavailable
        }))
      ]
    }

    addProductHandlers({
      "variant-test-product": { product: productWithUnavailableVariants }
    })

    const selector = (
      <nosto-variant-selector handle="variant-test-product" mode="compact" preselect />
    ) as VariantSelector
    await selector.connectedCallback()

    const dropdown = selector.shadowRoot!.querySelector(".variant-dropdown") as HTMLSelectElement
    expect(dropdown.value).toBe("gid://shopify/ProductVariant/1002") // Should select Medium/Blue
  })

  it("should emit variantchange event when dropdown selection changes in compact mode", async () => {
    addProductHandlers({
      "variant-test-product": { product: mockProductWithVariants }
    })

    const selector = (<nosto-variant-selector handle="variant-test-product" mode="compact" />) as VariantSelector
    await selector.connectedCallback()

    let eventFired = false
    let eventDetail: VariantChangeDetail | undefined

    selector.addEventListener("variantchange", e => {
      eventFired = true
      eventDetail = (e as CustomEvent).detail
    })

    const dropdown = selector.shadowRoot!.querySelector(".variant-dropdown") as HTMLSelectElement
    dropdown.value = "gid://shopify/ProductVariant/1002"
    dropdown.dispatchEvent(new Event("change", { bubbles: true }))

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(eventFired).toBe(true)
    expect(eventDetail).toBeDefined()
    expect(eventDetail!.variant.id).toBe("gid://shopify/ProductVariant/1002")
    expect(eventDetail!.variant.title).toBe("Medium / Blue")
  })

  it("should not render dropdown if product has only one variant in compact mode", async () => {
    const productWithSingleVariant = {
      ...mockProductWithVariants,
      variants: [mockProductWithVariants.variants[0]]
    }

    addProductHandlers({
      "single-variant-product": { product: productWithSingleVariant }
    })

    const selector = (<nosto-variant-selector handle="single-variant-product" mode="compact" />) as VariantSelector
    await selector.connectedCallback()

    const shadowContent = getShadowContent(selector)
    expect(shadowContent).not.toContain("variant-dropdown")
    expect(shadowContent).toContain("<slot")
  })

  it("should update variantId when variant is selected in compact mode", async () => {
    addProductHandlers({
      "variant-test-product": { product: mockProductWithVariants }
    })

    const selector = (<nosto-variant-selector handle="variant-test-product" mode="compact" />) as VariantSelector
    await selector.connectedCallback()

    const dropdown = selector.shadowRoot!.querySelector(".variant-dropdown") as HTMLSelectElement
    dropdown.value = "gid://shopify/ProductVariant/1002"
    dropdown.dispatchEvent(new Event("change", { bubbles: true }))

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(selector.variantId).toBe(1002)
    expect(dropdown.value).toBe("gid://shopify/ProductVariant/1002")
  })

  it("should skip single-value options in compact mode dropdown titles", async () => {
    addProductHandlers({
      "single-value-test": { product: mockProductWithSingleValueOptionTest }
    })

    const selector = (<nosto-variant-selector handle="single-value-test" mode="compact" />) as VariantSelector
    await selector.connectedCallback()

    const dropdown = selector.shadowRoot!.querySelector(".variant-dropdown") as HTMLSelectElement
    expect(dropdown).toBeTruthy()

    const options = dropdown.querySelectorAll("option")
    expect(options.length).toBe(3) // Small, Medium, Large

    // Material is fixed to "Cotton" across all variants, so it should not appear in option text
    expect(options[0].textContent).toBe("Small")
    expect(options[0].textContent).not.toContain("Cotton")
    expect(options[1].textContent).toBe("Medium")
    expect(options[1].textContent).not.toContain("Cotton")
    expect(options[2].textContent).toBe("Large")
    expect(options[2].textContent).not.toContain("Cotton")
  })

  it("should disable dropdown when all variants are unavailable", async () => {
    const productWithAllUnavailable = {
      ...mockProductWithVariants,
      variants: mockProductWithVariants.variants.map(v => ({
        ...v,
        availableForSale: false
      }))
    }

    addProductHandlers({
      "all-unavailable-product": { product: productWithAllUnavailable }
    })

    const selector = (<nosto-variant-selector handle="all-unavailable-product" mode="compact" />) as VariantSelector
    await selector.connectedCallback()

    const dropdown = selector.shadowRoot!.querySelector(".variant-dropdown") as HTMLSelectElement
    expect(dropdown).toBeTruthy()
    expect(dropdown.disabled).toBe(true)
  })

  it("should enable dropdown when at least one variant is available", async () => {
    const productWithOneAvailable = {
      ...mockProductWithVariants,
      variants: mockProductWithVariants.variants.map((v, idx) => ({
        ...v,
        availableForSale: idx === 1 // Only second variant is available
      }))
    }

    addProductHandlers({
      "one-available-product": { product: productWithOneAvailable }
    })

    const selector = (<nosto-variant-selector handle="one-available-product" mode="compact" />) as VariantSelector
    await selector.connectedCallback()

    const dropdown = selector.shadowRoot!.querySelector(".variant-dropdown") as HTMLSelectElement
    expect(dropdown).toBeTruthy()
    expect(dropdown.disabled).toBe(false)
  })

  it("should not emit variantchange event when disabled dropdown is changed", async () => {
    const productWithAllUnavailable = {
      ...mockProductWithVariants,
      variants: mockProductWithVariants.variants.map(v => ({
        ...v,
        availableForSale: false
      }))
    }

    addProductHandlers({
      "all-unavailable-product": { product: productWithAllUnavailable }
    })

    const selector = (<nosto-variant-selector handle="all-unavailable-product" mode="compact" />) as VariantSelector
    await selector.connectedCallback()

    let eventFired = false

    selector.addEventListener("variantchange", () => {
      eventFired = true
    })

    const dropdown = selector.shadowRoot!.querySelector(".variant-dropdown") as HTMLSelectElement
    expect(dropdown.disabled).toBe(true)

    // Try to change the value (this should not trigger the event on disabled dropdown)
    dropdown.value = "gid://shopify/ProductVariant/1002"
    dropdown.dispatchEvent(new Event("change", { bubbles: true }))

    await new Promise(resolve => setTimeout(resolve, 100))

    // Event should not fire because dropdown is disabled
    expect(eventFired).toBe(false)
  })

  it("should apply disabled styling when dropdown is disabled", async () => {
    const productWithAllUnavailable = {
      ...mockProductWithVariants,
      variants: mockProductWithVariants.variants.map(v => ({
        ...v,
        availableForSale: false
      }))
    }

    addProductHandlers({
      "all-unavailable-product": { product: productWithAllUnavailable }
    })

    const selector = (<nosto-variant-selector handle="all-unavailable-product" mode="compact" />) as VariantSelector
    await selector.connectedCallback()

    const dropdown = selector.shadowRoot!.querySelector(".variant-dropdown") as HTMLSelectElement
    expect(dropdown).toBeTruthy()
    expect(dropdown.disabled).toBe(true)

    // Check that the element can be queried with :disabled selector
    const disabledDropdown = selector.shadowRoot!.querySelector(".variant-dropdown:disabled")
    expect(disabledDropdown).toBeTruthy()
  })
})
