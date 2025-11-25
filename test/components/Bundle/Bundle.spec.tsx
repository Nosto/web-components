import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { Bundle } from "@/components/Bundle/Bundle"
import { SimpleCard } from "@/components/SimpleCard/SimpleCard"
import { createElement } from "../../utils/jsx"
import { getApiUrl } from "@/shopify/graphql/getApiUrl"
import { addHandlers } from "../../msw.setup"
import { http, HttpResponse } from "msw"
import { mockSimpleCardProduct } from "@/mock/products"
import type { JSONProduct } from "@nosto/nosto-js/client"
import type { ShopifyProduct } from "@/shopify/graphql/types"

beforeEach(() => {
  // clean DOM before each test
  document.body.innerHTML = ""
})

afterEach(() => {
  vi.restoreAllMocks()
  document.body.innerHTML = ""
})

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
    cardA.style.display = "block"
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
    input.dispatchEvent(new Event("input", { bubbles: true }))

    expect(bundle.selectedProducts.find((p: JSONProduct) => p.handle === "a")).toBeUndefined()
    expect(cardA.style.display).toBe("none")
    expect(summary.textContent).toBe("Total: $5.00")
  })
})
