/** @jsx createElement */
import { describe, it, expect, beforeEach, beforeAll } from "vitest"
import { VariantSelector } from "@/components/VariantSelector/VariantSelector"
import { getRenderer } from "@/components/VariantSelector/renderers/factory"
import { OptionsRenderer } from "@/components/VariantSelector/renderers/OptionsRenderer"
import { CompactRenderer } from "@/components/VariantSelector/renderers/CompactRenderer"
import { addHandlers } from "../../msw.setup"
import { http, HttpResponse } from "msw"
import { createElement } from "../../utils/jsx"
import type { ShopifyProduct } from "@/shopify/graphql/types"
import { clearProductCache } from "@/shopify/graphql/fetchProduct"
import { getApiUrl } from "@/shopify/graphql/constants"

describe("VariantSelector Renderers", () => {
  beforeAll(() => {
    if (!customElements.get("nosto-variant-selector")) {
      customElements.define("nosto-variant-selector", VariantSelector)
    }
  })

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
        const graphqlProduct = {
          ...product,
          images: { nodes: product.images }
        }
        return HttpResponse.json({ data: { product: graphqlProduct } }, { status: response.status || 200 })
      })
    )
  }

  const mockProduct: ShopifyProduct = {
    id: "gid://shopify/Product/123",
    title: "Test Product",
    vendor: "Test Brand",
    description: "Test description",
    encodedVariantExistence: "",
    onlineStoreUrl: "/products/test",
    availableForSale: true,
    adjacentVariants: [],
    images: [],
    featuredImage: {
      altText: "Test",
      height: 300,
      width: 300,
      thumbhash: null,
      url: "https://example.com/image.jpg"
    },
    options: [
      {
        name: "Size",
        optionValues: [
          {
            name: "Small",
            swatch: null,
            firstSelectableVariant: {
              id: "gid://shopify/ProductVariant/1",
              title: "Small",
              availableForSale: true,
              price: { currencyCode: "USD", amount: "10.00" },
              compareAtPrice: null,
              product: { id: "gid://shopify/Product/123", onlineStoreUrl: "/products/test" }
            }
          },
          {
            name: "Medium",
            swatch: null,
            firstSelectableVariant: {
              id: "gid://shopify/ProductVariant/2",
              title: "Medium",
              availableForSale: true,
              price: { currencyCode: "USD", amount: "12.00" },
              compareAtPrice: null,
              product: { id: "gid://shopify/Product/123", onlineStoreUrl: "/products/test" }
            }
          }
        ]
      }
    ],
    price: { currencyCode: "USD", amount: "10.00" },
    compareAtPrice: null,
    variants: [
      {
        id: "gid://shopify/ProductVariant/1",
        title: "Small",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "Small" }],
        price: { currencyCode: "USD", amount: "10.00" },
        compareAtPrice: null,
        product: { id: "gid://shopify/Product/123", onlineStoreUrl: "/products/test" }
      },
      {
        id: "gid://shopify/ProductVariant/2",
        title: "Medium",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "Medium" }],
        price: { currencyCode: "USD", amount: "12.00" },
        compareAtPrice: null,
        product: { id: "gid://shopify/Product/123", onlineStoreUrl: "/products/test" }
      }
    ]
  }

  describe("Renderer Factory", () => {
    it("should return OptionsRenderer for default mode", () => {
      const element = (<nosto-variant-selector handle="test" />) as VariantSelector
      const renderer = getRenderer(element)
      expect(renderer).toBeInstanceOf(OptionsRenderer)
    })

    it("should return OptionsRenderer for options mode", () => {
      const element = (<nosto-variant-selector handle="test" mode="options" />) as VariantSelector
      const renderer = getRenderer(element)
      expect(renderer).toBeInstanceOf(OptionsRenderer)
    })

    it("should return CompactRenderer for compact mode", () => {
      const element = (<nosto-variant-selector handle="test" mode="compact" />) as VariantSelector
      const renderer = getRenderer(element)
      expect(renderer).toBeInstanceOf(CompactRenderer)
    })

    it("should return the same renderer instance for the same mode", () => {
      const element1 = (<nosto-variant-selector handle="test" mode="options" />) as VariantSelector
      const element2 = (<nosto-variant-selector handle="test" mode="options" />) as VariantSelector

      const renderer1 = getRenderer(element1)
      const renderer2 = getRenderer(element2)

      expect(renderer1).toBe(renderer2)
    })
  })

  describe("Mode Switching", () => {
    it("should switch renderer when mode attribute changes", async () => {
      addProductHandlers({ test: { product: mockProduct } })

      const element = (<nosto-variant-selector handle="test" mode="options" />) as VariantSelector

      // Mount to DOM so attribute changes trigger callbacks
      document.body.appendChild(element)
      await element.connectedCallback()

      expect(element.renderer).toBeInstanceOf(OptionsRenderer)
      expect(element.shadowRoot!.querySelector(".selector")).toBeTruthy()

      element.setAttribute("mode", "compact")
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(element.renderer).toBeInstanceOf(CompactRenderer)
      expect(element.shadowRoot!.querySelector(".compact-selector")).toBeTruthy()

      // Cleanup
      document.body.removeChild(element)
    })

    it("should switch from compact to options mode", async () => {
      addProductHandlers({ test: { product: mockProduct } })

      const element = (<nosto-variant-selector handle="test" mode="compact" />) as VariantSelector

      // Mount to DOM so attribute changes trigger callbacks
      document.body.appendChild(element)
      await element.connectedCallback()

      expect(element.renderer).toBeInstanceOf(CompactRenderer)
      expect(element.shadowRoot!.querySelector(".variant-dropdown")).toBeTruthy()

      element.setAttribute("mode", "options")
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(element.renderer).toBeInstanceOf(OptionsRenderer)
      expect(element.shadowRoot!.querySelector(".selector")).toBeTruthy()

      // Cleanup
      document.body.removeChild(element)
    })
  })

  describe("Renderer Interface", () => {
    it("should expose renderer property on VariantSelector", async () => {
      addProductHandlers({ test: { product: mockProduct } })

      const element = (<nosto-variant-selector handle="test" />) as VariantSelector
      await element.connectedCallback()

      expect(element.renderer).toBeTruthy()
      expect(element.renderer).toHaveProperty("render")
      expect(element.renderer).toHaveProperty("setupEventListeners")
      expect(element.renderer).toHaveProperty("updateSelection")
    })

    it("should call renderer.render during connectedCallback", async () => {
      addProductHandlers({ test: { product: mockProduct } })

      const element = (<nosto-variant-selector handle="test" />) as VariantSelector
      await element.connectedCallback()

      expect(element.renderer).toBeInstanceOf(OptionsRenderer)
      expect(element.shadowRoot!.innerHTML).toContain("selector")
    })

    it("should call renderer.setupEventListeners during render", async () => {
      addProductHandlers({ test: { product: mockProduct } })

      const element = (<nosto-variant-selector handle="test" mode="options" />) as VariantSelector
      await element.connectedCallback()

      const button = element.shadowRoot!.querySelector(".value") as HTMLElement
      expect(button).toBeTruthy()

      let eventFired = false
      element.addEventListener("variantchange", () => {
        eventFired = true
      })

      button.click()
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(eventFired).toBe(true)
    })
  })

  describe("OptionsRenderer", () => {
    it("should render options mode correctly", async () => {
      addProductHandlers({ test: { product: mockProduct } })

      const element = (<nosto-variant-selector handle="test" mode="options" />) as VariantSelector
      await element.connectedCallback()

      const shadowRoot = element.shadowRoot!
      expect(shadowRoot.querySelector(".selector")).toBeTruthy()
      expect(shadowRoot.querySelector(".value")).toBeTruthy()
    })

    it("should update selection in options mode", async () => {
      addProductHandlers({ test: { product: mockProduct } })

      const element = (<nosto-variant-selector handle="test" mode="options" />) as VariantSelector
      await element.connectedCallback()

      element.selectedOptions["Size"] = "Small"
      element.renderer!.updateSelection(element)

      const activeButton = element.shadowRoot!.querySelector('[part*="active"]')
      expect(activeButton).toBeTruthy()
    })
  })

  describe("CompactRenderer", () => {
    it("should render compact mode correctly", async () => {
      addProductHandlers({ test: { product: mockProduct } })

      const element = (<nosto-variant-selector handle="test" mode="compact" />) as VariantSelector
      await element.connectedCallback()

      const shadowRoot = element.shadowRoot!
      expect(shadowRoot.querySelector(".compact-selector")).toBeTruthy()
      expect(shadowRoot.querySelector(".variant-dropdown")).toBeTruthy()
    })

    it("should handle dropdown changes in compact mode", async () => {
      addProductHandlers({ test: { product: mockProduct } })

      const element = (<nosto-variant-selector handle="test" mode="compact" />) as VariantSelector
      await element.connectedCallback()

      let eventFired = false
      element.addEventListener("variantchange", () => {
        eventFired = true
      })

      const dropdown = element.shadowRoot!.querySelector(".variant-dropdown") as HTMLSelectElement
      dropdown.value = "gid://shopify/ProductVariant/2"
      dropdown.dispatchEvent(new Event("change", { bubbles: true }))

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(eventFired).toBe(true)
    })

    it("should not need to update selection in compact mode", () => {
      const element = (<nosto-variant-selector handle="test" mode="compact" />) as VariantSelector
      const renderer = new CompactRenderer()

      expect(() => renderer.updateSelection(element)).not.toThrow()
    })
  })
})
