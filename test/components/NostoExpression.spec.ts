import { describe, beforeEach, it, expect, vi } from "vitest"
import { NostoExpression } from "@/components/NostoExpression/NostoExpression"
import { mockNostojs } from "@nosto/nosto-js/testing"
import type { TaggingData } from "@nosto/nosto-js/client"

describe("NostoExpression", () => {
  beforeEach(() => {
    document.body.innerHTML = ""
    vi.resetAllMocks()
  })

  it("should evaluate simple property expression and display result", async () => {
    const mockPageTagging = {
      product: {
        name: "Test Product",
        price: 29.99
      }
    }

    mockNostojs({
      pageTagging: () => mockPageTagging as Partial<TaggingData>
    })

    const element = new NostoExpression()
    element.expr = "product.name"

    await element.connectedCallback()

    expect(element.textContent).toBe("Test Product")
  })

  it("should evaluate calculated expression and display result", async () => {
    const mockPageTagging = {
      product: {
        price: 25.0
      }
    }

    mockNostojs({
      pageTagging: () => mockPageTagging as Partial<TaggingData>
    })

    const element = new NostoExpression()
    element.expr = "product.price * 1.2"

    await element.connectedCallback()

    expect(element.textContent).toBe("30")
  })

  it("should display empty string when expression is undefined", async () => {
    const mockPageTagging = {
      product: {
        name: "Test Product"
      }
    }

    mockNostojs({
      pageTagging: () => mockPageTagging as Partial<TaggingData>
    })

    const element = new NostoExpression()
    element.expr = "product.nonexistent"

    await element.connectedCallback()

    expect(element.textContent).toBe("")
  })

  it("should display empty string when expr attribute is empty", async () => {
    const mockPageTagging = {}

    mockNostojs({
      pageTagging: () => mockPageTagging as Partial<TaggingData>
    })

    const element = new NostoExpression()
    element.expr = ""

    await element.connectedCallback()

    expect(element.textContent).toBe("")
  })

  it("should throw error when expression is invalid", async () => {
    const mockPageTagging = {}

    mockNostojs({
      pageTagging: () => mockPageTagging as Partial<TaggingData>
    })

    const element = new NostoExpression()
    element.expr = "invalid.syntax(("

    await expect(element.connectedCallback()).rejects.toThrow()
  })

  it("should update content when expr attribute changes", async () => {
    const mockPageTagging = {
      product: {
        name: "Original Product",
        price: 15.0
      }
    }

    mockNostojs({
      pageTagging: () => mockPageTagging as Partial<TaggingData>
    })

    const element = new NostoExpression()
    element.expr = "product.name"
    document.body.appendChild(element)

    await element.connectedCallback()
    expect(element.textContent).toBe("Original Product")

    // Change the expression
    element.expr = "product.price"
    element.attributeChangedCallback()

    // Wait for async connectedCallback to complete
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(element.textContent).toBe("15")
  })

  it("should work with complex expressions and nested objects", async () => {
    const mockPageTagging = {
      cart: {
        items: [
          {
            name: "Item 1",
            price_currency_code: "USD",
            product_id: "1",
            quantity: 1,
            unit_price: 10.0,
            price: 10.0
          },
          {
            name: "Item 2",
            price_currency_code: "USD",
            product_id: "2",
            quantity: 1,
            unit_price: 20.0,
            price: 20.0
          },
          {
            name: "Item 3",
            price_currency_code: "USD",
            product_id: "3",
            quantity: 1,
            unit_price: 30.0,
            price: 30.0
          }
        ]
      }
    }

    mockNostojs({
      pageTagging: () => mockPageTagging as Partial<TaggingData>
    })

    const element = new NostoExpression()
    element.expr = "cart.items.length"

    await element.connectedCallback()

    expect(element.textContent).toBe("3")
  })
})
