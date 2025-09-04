/** @jsx createElement */
import { describe, it, expect, vi, afterEach } from "vitest"
import { DynamicCard } from "@/components/DynamicCard/DynamicCard"
import { addHandlers } from "../msw.setup"
import { http, HttpResponse } from "msw"
import { createElement } from "../utils/jsx"
import { createShopifyUrl } from "@/utils"

describe("DynamicCard", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  function addProductHandlers(responses: Record<string, { markup?: string; status?: number }>) {
    // Use createShopifyUrl to get the correct path with Shopify root handling
    const productUrl = createShopifyUrl("products/:handle")
    const productPath = productUrl.pathname

    addHandlers(
      http.get(productPath, ({ params }) => {
        const handle = params.handle as string
        const response = responses[handle]
        if (!response) {
          return HttpResponse.text("", { status: 404 })
        }
        return HttpResponse.text(response.markup || "", { status: response.status || 200 })
      })
    )
  }

  it("fetches product data and sets innerHTML when markup is valid", async () => {
    const validMarkup = "<div>Product Info</div>"
    addProductHandlers({
      "test-handle": {
        markup: validMarkup
      }
    })

    const card = (<nosto-dynamic-card handle="test-handle" template="default" />) as DynamicCard

    // Call connectedCallback manually since it's not automatically triggered in tests.
    await card.connectedCallback()

    expect(card.innerHTML).toBe(validMarkup)
  })

  it("supports section rendering", async () => {
    const validMarkup = "<section><div>Product Info</div></section>"
    addProductHandlers({
      "test-handle": {
        markup: `<section>${validMarkup}</section>`
      }
    })

    const card = (<nosto-dynamic-card handle="test-handle" section="product-card" />) as DynamicCard

    // Call connectedCallback manually since it's not automatically triggered in tests.
    await card.connectedCallback()

    expect(card.innerHTML).toBe(validMarkup)
  })

  it("rerenders when attributes change", async () => {
    const validMarkup = "<div>Updated Product Info</div>"
    addProductHandlers({
      "test-handle": {
        markup: "<div>Initial Product Info</div>"
      },
      "updated-handle": {
        markup: validMarkup
      }
    })

    const card = (<nosto-dynamic-card handle="test-handle" template="default" />) as DynamicCard
    document.body.appendChild(card)

    card.handle = "updated-handle"
    await new Promise(resolve => setTimeout(resolve, 10)) // Wait for async fetch to complete

    expect(card.innerHTML).toBe(validMarkup)
  })

  it("uses placeholder content when placeholder attribute is set and template matches", async () => {
    const validMarkup = "<div>Product Info</div>"
    addProductHandlers({
      "test-handle": {
        markup: validMarkup
      },
      "test-handle2": {
        markup: validMarkup
      },
      "test-handle3": {
        markup: "<div>Custom Product Info</div>"
      }
    })
    // @ts-expect-error partial mock assignment
    global.IntersectionObserver = vi.fn(() => ({
      observe: vi.fn(),
      disconnect: vi.fn()
    }))

    const card = (<nosto-dynamic-card handle="test-handle" template="default" />) as DynamicCard
    await card.connectedCallback()

    // placeholder is used, since template is the same
    const card2 = (
      <nosto-dynamic-card handle="test-handle2" template="default" placeholder={true} lazy={true} />
    ) as DynamicCard
    await card2.connectedCallback()
    expect(card2.innerHTML).toBe(validMarkup)

    // placeholder is not used, since template is different
    const card3 = (
      <nosto-dynamic-card handle="test-handle3" template="custom" placeholder={true} lazy={true} />
    ) as DynamicCard
    await card3.connectedCallback()
    expect(card3.innerHTML).toBe("")
  })

  it("fetches product lazily when lazy attribute is set", async () => {
    const validMarkup = "<div>Lazy Loaded Product Info</div>"
    addProductHandlers({
      "lazy-handle": {
        markup: validMarkup
      }
    })

    const card = (<nosto-dynamic-card handle="lazy-handle" template="default" lazy={true} />) as DynamicCard

    // Mock IntersectionObserver
    const mockObserver = {
      observe: vi.fn(),
      disconnect: vi.fn()
    }
    // @ts-expect-error partial mock assignment
    global.IntersectionObserver = vi.fn(() => mockObserver)

    // Call connectedCallback manually
    await card.connectedCallback()
    expect(mockObserver.observe).toHaveBeenCalledWith(card)

    // Simulate intersection
    // @ts-expect-error IntersectionObserver is not typed as a mock
    global.IntersectionObserver.mock.calls[0][0]([{ isIntersecting: true }])

    await new Promise(resolve => setTimeout(resolve, 10)) // Wait for async fetch to complete
    expect(card.innerHTML).toBe(validMarkup)
  })

  it("throws error when fetch response is not ok", async () => {
    addProductHandlers({
      "handle-error": {
        markup: "Error",
        status: 500
      }
    })

    const card = (<nosto-dynamic-card handle="handle-error" template="default" />) as DynamicCard

    await expect(card.connectedCallback()).rejects.toThrow(
      "Failed to fetch http://localhost:3000/products/handle-error"
    )
  })

  it("throws error when markup is invalid", async () => {
    const invalidMarkup = "<html>Not allowed</html>"
    addProductHandlers({
      "handle-invalid": {
        markup: invalidMarkup
      }
    })

    const card = (<nosto-dynamic-card handle="handle-invalid" template="default" />) as DynamicCard

    await expect(card.connectedCallback()).rejects.toThrow("Invalid markup for template default")
  })

  it("uses Shopify routes root when available", async () => {
    // Set up window.Shopify.routes.root
    vi.stubGlobal("Shopify", { routes: { root: "/en-us/" } })

    const validMarkup = "<div>Product Info</div>"

    // Use addProductHandlers which now supports Shopify root paths
    addProductHandlers({
      "test-handle": {
        markup: validMarkup
      }
    })

    const card = (<nosto-dynamic-card handle="test-handle" template="default" />) as DynamicCard

    await card.connectedCallback()

    expect(card.innerHTML).toBe(validMarkup)

    // Restore original globals
    vi.unstubAllGlobals()
  })

  it("emits DynamicCard/loaded event when content is loaded", async () => {
    const validMarkup = "<div>Product Info</div>"
    addProductHandlers({
      "event-test-handle": {
        markup: validMarkup
      }
    })

    const card = (<nosto-dynamic-card handle="event-test-handle" template="default" />) as DynamicCard

    // Set up event listener to capture the event
    let eventEmitted = false
    card.addEventListener("@nosto/DynamicCard/loaded", () => {
      eventEmitted = true
    })

    // Call connectedCallback manually since it's not automatically triggered in tests
    await card.connectedCallback()

    expect(card.innerHTML).toBe(validMarkup)
    expect(eventEmitted).toBe(true)
  })

  it("falls back to default root when Shopify routes not available", async () => {
    // Ensure window.Shopify is undefined
    vi.stubGlobal("Shopify", undefined)

    const validMarkup = "<div>Product Info</div>"
    addProductHandlers({
      "test-handle": {
        markup: validMarkup
      }
    })

    const card = (<nosto-dynamic-card handle="test-handle" template="default" />) as DynamicCard

    await card.connectedCallback()

    expect(card.innerHTML).toBe(validMarkup)

    // Restore original globals
    vi.unstubAllGlobals()
  })
})
