import { NostoProductCard } from "../../src/components/NostoProductCard"
import { describe, beforeEach, expect, it, vi } from "vitest"
import { createElement } from "../utils/jsx"

describe("NostoProductCard", () => {
  beforeEach(() => {
    document.body.innerHTML = ""
    vi.resetAllMocks()
  })

  it("should throw an error if template is not provided", () => {
    const card = new NostoProductCard()
    expect(card.connectedCallback()).rejects.toThrowError("Property template is required.")
  })

  it("should render the product", async () => {
    const card = new NostoProductCard()
    card.template = "test1"

    const mockProductData = { product: { id: 123, title: "Test Product" } }
    document.body.append(
      <script id="test1" type="text/x-liquid-template">
        <h1>{"{{ product.title }}"}</h1>
      </script>
    )
    card.append(
      <script type="application/json" product-data>
        {JSON.stringify(mockProductData.product)}
      </script>
    )

    await card.connectedCallback()

    expect(card.children[1].outerHTML).toBe("<h1>Test Product</h1>")
  })

  it("should render the product from DOM data", async () => {
    const card = new NostoProductCard()
    card.template = "test2"

    const mockProductData = { product: { id: 123, title: "Test Product" } }
    document.body.append(
      <script id="test2" type="text/x-liquid-template">
        <h1>{"{{ product.title }}"}</h1>
      </script>
    )
    card.append(
      <script type="application/json" product-data>
        {JSON.stringify(mockProductData.product)}
      </script>
    )

    await card.connectedCallback()

    expect(card.children[1].outerHTML).toBe("<h1>Test Product</h1>")
  })

  it("should expose dataset to template context", async () => {
    const card = new NostoProductCard()
    card.template = "test3"
    card.dataset.test = "test"

    const mockProductData = { product: { id: 123, title: "Test Product" } }
    document.body.append(
      <script id="test3" type="text/x-liquid-template">
        <h1>{"{{ product.title }} {{ data.test }}"}</h1>
      </script>
    )
    card.append(
      <script type="application/json" product-data>
        {JSON.stringify(mockProductData.product)}
      </script>
    )

    await card.connectedCallback()

    expect(card.children[1].outerHTML).toBe("<h1>Test Product test</h1>")
  })
})
