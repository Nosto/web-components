import { NostoProductCard } from "../../src/components/NostoProductCard"
import { describe, beforeEach, expect, it, vi } from "vitest"
import { createElement } from "../utils/jsx"

describe("NostoProductCard", () => {
  beforeEach(() => {
    document.body.innerHTML = ""
    vi.resetAllMocks()
  })

  it("should throw an error if recoId is not provided", () => {
    const card = new NostoProductCard()
    card.template = "test"
    expect(() => card.connectedCallback()).toThrowError("Slot ID is required.")
  })

  it("should throw an error if template is not provided", () => {
    const card = new NostoProductCard()
    card.recoId = "test"
    expect(() => card.connectedCallback()).toThrowError("Template is required.")
  })

  it("should render the product", async () => {
    const card = new NostoProductCard()
    card.recoId = "test"
    card.template = "test1"
    card.wrap = false

    const mockProductData = { product: { id: 123, title: "Test Product" } }
    document.body.append(
      <template id="test1" type="text/liquid">
        <h1>{"{{ product.title }}"}</h1>
      </template>
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
    card.recoId = "test"
    card.template = "test2"
    card.wrap = false

    const mockProductData = { product: { id: 123, title: "Test Product" } }
    document.body.append(
      <template id="test2" type="text/liquid">
        <h1>{"{{ product.title }}"}</h1>
      </template>
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
    card.recoId = "test"
    card.template = "test3"
    card.wrap = false
    card.dataset.test = "test"

    const mockProductData = { product: { id: 123, title: "Test Product" } }
    document.body.append(
      <template id="test3" type="text/liquid">
        <h1>{"{{ product.title }} {{ data.test }}"}</h1>
      </template>
    )
    card.append(
      <script type="application/json" product-data>
        {JSON.stringify(mockProductData.product)}
      </script>
    )

    await card.connectedCallback()

    expect(card.children[1].outerHTML).toBe("<h1>Test Product test</h1>")
  })

  it("should render the product with wrapper", async () => {
    const card = new NostoProductCard()
    card.recoId = "test"
    card.template = "test4"
    card.wrap = true

    const mockProductData = { product: { id: 123, title: "Test Product" } }
    document.body.append(
      <template id="test4" type="text/liquid">
        <h1>{"{{ product.title }}"}</h1>
      </template>
    )
    card.append(
      <script type="application/json" product-data>
        {JSON.stringify(mockProductData.product)}
      </script>
    )

    await card.connectedCallback()

    expect(card.children[1].outerHTML).toBe(
      `<nosto-product reco-id="test" product-id="123"><h1>Test Product</h1></nosto-product>`
    )
  })
})
