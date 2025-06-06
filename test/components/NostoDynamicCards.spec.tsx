import { describe, it, expect, vi } from "vitest"
import { mockNostojs } from "@nosto/nosto-js/testing"
import { NostoDynamicCards } from "../../src/components/NostoDynamicCards"
import { RequestBuilder } from "@nosto/nosto-js/client"
import { createElement } from "../utils/jsx"

// @ts-expect-error type mismatch for testing purposes
global.fetch = vi.fn(url =>
  Promise.resolve({
    ok: true,
    text: () => Promise.resolve(`<div>Mocked ${url}</div>`)
  })
)

describe("NostoDynamicCards", () => {
  const exampleResponse = {
    recommendations: {
      frontpage: {
        result_id: "12345",
        title: "Recommended Products",
        products: [{ url: "/products/product-1" }, { url: "/products/product-2" }, { url: "/products/product-3" }]
      }
    }
  }

  const mockBuilder = {
    disableCampaignInjection: () => mockBuilder,
    setElements: () => mockBuilder,
    setResponseMode: () => mockBuilder,
    load: () => Promise.resolve(exampleResponse)
  } as unknown as RequestBuilder

  mockNostojs({
    createRecommendationRequest: () => mockBuilder
  })

  it("should throw error if required attributes are missing", () => {
    const element = new NostoDynamicCards()
    expect(() => element.connectedCallback()).rejects.toThrow("Property placement is required.")
  })

  it("should render products in template", async () => {
    const element = new NostoDynamicCards()
    element.appendChild(
      <template>
        <div>
          <slot name="heading"></slot>
        </div>
        <div class="products">
          <slot name="products"></slot>
        </div>
      </template>
    )
    element.placement = "frontpage"
    element.template = "product-card"
    await element.connectedCallback()

    const expected = (
      <div>
        <div>Recommended Products</div>
        <div class="products">
          <div>Mocked /products/product-1?view=product-card&amp;layout=none</div>
          <div>Mocked /products/product-2?view=product-card&amp;layout=none</div>
          <div>Mocked /products/product-3?view=product-card&amp;layout=none</div>
        </div>
      </div>
    )

    expect(element.innerHTML).toEqual(expected.innerHTML)
  })

  it("should fetch recommendations and render products", async () => {
    const element = new NostoDynamicCards()
    element.placement = "frontpage"
    element.template = "product-card"
    await element.connectedCallback()

    const expected = (
      <div>
        <div>Mocked /products/product-1?view=product-card&amp;layout=none</div>
        <div>Mocked /products/product-2?view=product-card&amp;layout=none</div>
        <div>Mocked /products/product-3?view=product-card&amp;layout=none</div>
      </div>
    )

    expect(element.innerHTML).toEqual(expected.innerHTML)
  })
})
