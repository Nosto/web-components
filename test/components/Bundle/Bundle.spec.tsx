import { describe, it, expect } from "vitest"
import { Bundle } from "@/components/Bundle/Bundle"
import { SimpleCard } from "@/components/SimpleCard/SimpleCard"
import { createElement } from "../../utils/jsx"
import { getApiUrl } from "@/shopify/graphql/getApiUrl"
import { addHandlers } from "../../msw.setup"
import { http, HttpResponse } from "msw"
import { mockSimpleCardProduct } from "@/mock/products"
import type { JSONProduct } from "@nosto/nosto-js/client"
import type { ShopifyProduct } from "@/shopify/graphql/types"

describe("Bundle", () => {
  const mockProduct = mockSimpleCardProduct
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
  it("should be defined as a custom element", () => {
    expect(customElements.get("nosto-bundle")).toBeDefined()
  })
  it("initializes selectedProducts and updates summary on connectedCallback", () => {
    const bundle = (<nosto-bundle />) as Bundle
    const products = [
      { handle: "a", price: 10, price_currency_code: "USD" },
      { handle: "b", price: 5, price_currency_code: "USD" }
    ] as JSONProduct[]
    bundle.products = products

    const summary = document.createElement("span")
    summary.setAttribute("n-summary-price", "")
    bundle.appendChild(summary)

    document.body.appendChild(bundle) // triggers connectedCallback

    expect(bundle.selectedProducts).toHaveLength(2)
    expect(summary.textContent).toBe("Total: $15.00")
  })

  it("removes product from selection when checkbox with checked attribute is inputted", () => {
    addProductHandlers({
      a: { product: mockProduct }
    })
    const bundle = (<nosto-bundle />) as Bundle
    const products = [
      { handle: "a", price: 10, price_currency_code: "USD" },
      { handle: "b", price: 5, price_currency_code: "USD" }
    ] as JSONProduct[]

    bundle.products = products
    bundle.selectedProducts = [...products]

    const cardA = (<nosto-simple-card />) as SimpleCard
    cardA.setAttribute("handle", "a")
    bundle.appendChild(cardA)

    const summary = document.createElement("span")
    summary.setAttribute("n-summary-price", "")
    bundle.appendChild(summary)

    const input = document.createElement("input")
    input.type = "checkbox"
    input.value = "a"
    input.setAttribute("checked", "")
    bundle.appendChild(input)

    document.body.appendChild(bundle)

    // dispatch input event
    input.checked = false
    input.dispatchEvent(new Event("input", { bubbles: true }))

    expect(bundle.selectedProducts.find((p: JSONProduct) => p.handle === "a")).toBeUndefined()
    expect(summary.textContent).toBe("Total: $5.00")
  })

  it("adds product to selection when checkbox without checked attribute is inputted", () => {
    addProductHandlers({
      a: { product: mockProduct },
      b: { product: mockProduct }
    })
    const bundle = (<nosto-bundle />) as Bundle
    const products = [
      { handle: "a", price: 10, price_currency_code: "USD" },
      { handle: "b", price: 5, price_currency_code: "USD" }
    ] as JSONProduct[]

    bundle.products = products
    bundle.selectedProducts = [products[1]] // Only 'b' selected initially

    const cardA = (<nosto-simple-card />) as SimpleCard
    cardA.setAttribute("handle", "a")
    bundle.appendChild(cardA)

    const summary = document.createElement("span")
    summary.setAttribute("n-summary-price", "")
    bundle.appendChild(summary)

    const input = document.createElement("input")
    input.type = "checkbox"
    input.value = "a"
    bundle.appendChild(input)

    document.body.appendChild(bundle)

    // dispatch input event to add product
    input.checked = true
    input.dispatchEvent(new Event("input", { bubbles: true }))

    expect(bundle.selectedProducts.find((p: JSONProduct) => p.handle === "a")).toBeTruthy()
    expect(input.checked).toBe(true)
    expect(summary.textContent).toBe("Total: $15.00")
  })

  it("calculates correct total for multiple selected products", () => {
    const bundle = (<nosto-bundle />) as Bundle
    const products = [
      { handle: "a", price: 10.5, price_currency_code: "USD" },
      { handle: "b", price: 5.25, price_currency_code: "USD" },
      { handle: "c", price: 15.75, price_currency_code: "USD" }
    ] as JSONProduct[]

    bundle.products = products

    const summary = document.createElement("span")
    summary.setAttribute("n-summary-price", "")
    bundle.appendChild(summary)

    document.body.appendChild(bundle)

    expect(summary.textContent).toBe("Total: $31.50")
  })

  it("does not add duplicate product when already selected", () => {
    const bundle = (<nosto-bundle />) as Bundle
    const products = [
      { handle: "a", price: 10, price_currency_code: "USD" },
      { handle: "b", price: 5, price_currency_code: "USD" }
    ] as JSONProduct[]

    bundle.products = products
    bundle.selectedProducts = [...products] // Both already selected

    const summary = document.createElement("span")
    summary.setAttribute("n-summary-price", "")
    bundle.appendChild(summary)

    const input = document.createElement("input")
    input.type = "checkbox"
    input.value = "a"
    bundle.appendChild(input)

    document.body.appendChild(bundle)

    // Try to add already selected product
    input.checked = true
    input.dispatchEvent(new Event("input", { bubbles: true }))

    expect(bundle.selectedProducts).toHaveLength(2)
    expect(summary.textContent).toBe("Total: $15.00")
  })
})
