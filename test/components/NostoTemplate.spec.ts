import { describe, it, beforeEach, expect, vi } from "vitest"
import { mockNostojs } from "@nosto/nosto-js/testing"
import { NostoTemplate } from "@/components/NostoTemplate/NostoTemplate"

describe("NostoTemplate", () => {
  let template: NostoTemplate

  beforeEach(() => {
    document.body.innerHTML = ""
  })

  function mount() {
    template = new NostoTemplate()
    return template
  }

  function createTemplate(content: string) {
    const templateElement = document.createElement("template")
    templateElement.innerHTML = content
    return templateElement
  }

  it("should be defined as a custom element", () => {
    expect(customElements.get("nosto-template")).toBeDefined()
  })

  it("should render template with page tagging data", async () => {
    const mockTaggingData = {
      pageType: "product",
      customer: {
        firstName: "John",
        lastName: "Doe"
      },
      products: [{ productId: "123", name: "Test Product" }],
      cart: undefined,
      variation: undefined,
      restoreLink: undefined,
      order: undefined,
      searchTerms: undefined,
      brands: undefined,
      categories: undefined,
      categoryIds: undefined,
      parentCategoryIds: undefined,
      tags: undefined,
      customFields: undefined,
      elements: undefined,
      affinitySignals: undefined,
      sortOrder: undefined,
      pluginVersion: undefined
    }

    mockNostojs({
      pageTagging: vi.fn().mockReturnValue(mockTaggingData)
    })

    template = mount()
    const templateEl = createTemplate(`
      <div class="page-type">{{ pageType }}</div>
      <div class="customer-name" v-if="customer">{{ customer.firstName }}</div>
      <div class="product-count">Products: {{ products.length }}</div>
    `)
    template.appendChild(templateEl)

    await template.connectedCallback()

    expect(template.querySelector(".page-type")?.textContent).toBe("product")
    expect(template.querySelector(".customer-name")?.textContent).toBe("John")
    expect(template.querySelector(".product-count")?.textContent).toBe("Products: 1")
  })

  it("should handle v-if directive with customer data", async () => {
    const mockTaggingData = {
      pageType: "category",
      customer: undefined,
      products: [],
      cart: undefined,
      variation: undefined,
      restoreLink: undefined,
      order: undefined,
      searchTerms: undefined,
      brands: undefined,
      categories: undefined,
      categoryIds: undefined,
      parentCategoryIds: undefined,
      tags: undefined,
      customFields: undefined,
      elements: undefined,
      affinitySignals: undefined,
      sortOrder: undefined,
      pluginVersion: undefined
    }

    mockNostojs({
      pageTagging: vi.fn().mockReturnValue(mockTaggingData)
    })

    template = mount()
    const templateEl = createTemplate(`
      <div class="welcome" v-if="customer">Welcome back!</div>
      <div class="anonymous" v-if="!customer">Welcome visitor!</div>
      <div class="page-type">{{ pageType }}</div>
    `)
    template.appendChild(templateEl)

    await template.connectedCallback()

    expect(template.querySelector(".welcome")).toBeNull()
    expect(template.querySelector(".anonymous")?.textContent).toBe("Welcome visitor!")
    expect(template.querySelector(".page-type")?.textContent).toBe("category")
  })

  it("should handle v-for directive with products", async () => {
    const mockTaggingData = {
      pageType: "search",
      customer: undefined,
      products: [
        { productId: "123", name: "Product 1" },
        { productId: "456", name: "Product 2" }
      ],
      cart: undefined,
      variation: undefined,
      restoreLink: undefined,
      order: undefined,
      searchTerms: undefined,
      brands: undefined,
      categories: undefined,
      categoryIds: undefined,
      parentCategoryIds: undefined,
      tags: undefined,
      customFields: undefined,
      elements: undefined,
      affinitySignals: undefined,
      sortOrder: undefined,
      pluginVersion: undefined
    }

    mockNostojs({
      pageTagging: vi.fn().mockReturnValue(mockTaggingData)
    })

    template = mount()
    const templateEl = createTemplate(`
      <div class="product" v-for="product in products">
        {{ product.name }} (ID: {{ product.productId }})
      </div>
    `)
    template.appendChild(templateEl)

    await template.connectedCallback()

    const productElements = template.querySelectorAll(".product")
    expect(productElements).toHaveLength(2)
    expect(productElements[0]?.textContent?.trim()).toBe("Product 1 (ID: 123)")
    expect(productElements[1]?.textContent?.trim()).toBe("Product 2 (ID: 456)")
  })

  it("should handle cart data", async () => {
    const mockTaggingData = {
      pageType: "cart",
      customer: undefined,
      products: [],
      cart: {
        hcid: "cart123",
        items: [
          { productId: "123", skuId: "sku1", name: "Cart Item 1", unitPrice: 19.99, price: 19.99, quantity: 1 },
          { productId: "456", skuId: "sku2", name: "Cart Item 2", unitPrice: 29.99, price: 59.98, quantity: 2 }
        ]
      },
      variation: undefined,
      restoreLink: undefined,
      order: undefined,
      searchTerms: undefined,
      brands: undefined,
      categories: undefined,
      categoryIds: undefined,
      parentCategoryIds: undefined,
      tags: undefined,
      customFields: undefined,
      elements: undefined,
      affinitySignals: undefined,
      sortOrder: undefined,
      pluginVersion: undefined
    }

    mockNostojs({
      pageTagging: vi.fn().mockReturnValue(mockTaggingData)
    })

    template = mount()
    const templateEl = createTemplate(`
      <div class="cart-id" v-if="cart">Cart: {{ cart.hcid }}</div>
      <div class="cart-count" v-if="cart">Items: {{ cart.items.length }}</div>
      <div class="cart-item" v-for="item in cart.items">
        {{ item.name }} - {{ item.price }}
      </div>
    `)
    template.appendChild(templateEl)

    await template.connectedCallback()

    expect(template.querySelector(".cart-id")?.textContent).toBe("Cart: cart123")
    expect(template.querySelector(".cart-count")?.textContent).toBe("Items: 2")

    const cartItems = template.querySelectorAll(".cart-item")
    expect(cartItems).toHaveLength(2)
    expect(cartItems[0]?.textContent?.trim()).toBe("Cart Item 1 - 19.99")
    expect(cartItems[1]?.textContent?.trim()).toBe("Cart Item 2 - 59.98")
  })

  it("should handle errors gracefully", async () => {
    mockNostojs({
      pageTagging: vi.fn().mockImplementation(() => {
        throw new Error("API Error")
      })
    })

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    template = mount()
    const templateEl = createTemplate(`
      <div>This should not render</div>
    `)
    template.appendChild(templateEl)

    await template.connectedCallback()

    expect(template.innerHTML).toBe("")
    expect(consoleSpy).toHaveBeenCalledWith("NostoTemplate: Failed to load template", expect.any(Error))

    consoleSpy.mockRestore()
  })

  it("should throw error when template is missing", async () => {
    mockNostojs({
      pageTagging: vi.fn().mockReturnValue({})
    })

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    template = mount()
    // No template element provided

    await template.connectedCallback()

    expect(template.innerHTML).toBe("")
    expect(consoleSpy).toHaveBeenCalledWith("NostoTemplate: Failed to load template", expect.any(Error))

    consoleSpy.mockRestore()
  })

  it("should support reload method", async () => {
    const mockTaggingData = {
      pageType: "home",
      customer: undefined,
      products: [],
      cart: undefined,
      variation: undefined,
      restoreLink: undefined,
      order: undefined,
      searchTerms: undefined,
      brands: undefined,
      categories: undefined,
      categoryIds: undefined,
      parentCategoryIds: undefined,
      tags: undefined,
      customFields: undefined,
      elements: undefined,
      affinitySignals: undefined,
      sortOrder: undefined,
      pluginVersion: undefined
    }

    const pageTaggingMock = vi.fn().mockReturnValue(mockTaggingData)
    mockNostojs({
      pageTagging: pageTaggingMock
    })

    template = mount()
    const templateEl = createTemplate(`
      <div class="page-type">{{ pageType }}</div>
    `)
    template.appendChild(templateEl)

    await template.connectedCallback()
    expect(pageTaggingMock).toHaveBeenCalledTimes(1)
    expect(template.querySelector(".page-type")?.textContent).toBe("home")

    // Call reload
    await template.reload()
    expect(pageTaggingMock).toHaveBeenCalledTimes(2)
  })
})
