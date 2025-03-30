import { NostoCard } from "../../src/components/NostoCard"
import { describe, beforeEach, expect, it, vi } from "vitest"
import * as Liquid from "liquidjs"

describe("NostoCard", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    window.Liquid = Liquid
  })

  it("should throw an error if handle is not provided", () => {
    const card = new NostoCard()
    card.recoId = "test"
    card.template = "test"
    expect(() => card.connectedCallback()).toThrowError("Product handle is required.")
  })

  it("should throw an error if recoId is not provided", () => {
    const card = new NostoCard()
    card.handle = "test"
    card.template = "test"
    expect(() => card.connectedCallback()).toThrowError("Slot ID is required.")
  })

  it("should throw an error if template is not provided", () => {
    const card = new NostoCard()
    card.handle = "test"
    card.recoId = "test"
    expect(() => card.connectedCallback()).toThrowError("Template is required.")
  })

  it("should render the product", async () => {
    const card = new NostoCard()
    card.handle = "test"
    card.recoId = "test"
    card.template = "test"
    card.wrap = false

    const mockProductData = { product: { id: 123, title: "Test Product" } }
    const mockTemplateText = "<h1>{{ title }}</h1>"

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockProductData)
    })

    document.getElementById = vi.fn().mockReturnValue({
      innerHTML: mockTemplateText,
      getAttribute: vi.fn().mockReturnValue("text/liquid")
    })

    await card.connectedCallback()

    expect(fetch).toHaveBeenCalledWith("products/test.json")
    expect(document.getElementById).toHaveBeenCalledWith("test")
    expect(card.innerHTML).toBe("<h1>Test Product</h1>")
  })

  it("should render the product with wrapper", async () => {
    const card = new NostoCard()
    card.handle = "test"
    card.recoId = "test"
    card.template = "test"
    card.wrap = true

    const mockProductData = { product: { id: 123, title: "Test Product" } }
    const mockTemplateText = "<h1>{{ title }}</h1>"

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockProductData)
    })

    document.getElementById = vi.fn().mockReturnValue({
      innerHTML: mockTemplateText,
      getAttribute: vi.fn().mockReturnValue("text/liquid")
    })

    await card.connectedCallback()

    expect(fetch).toHaveBeenCalledWith("products/test.json")
    expect(document.getElementById).toHaveBeenCalledWith("test")
    // @ts-expect-error type mismatch
    expect(card.firstChild?.innerHTML).toBe("<h1>Test Product</h1>")
  })
})
