/** @jsx createElement */
import { describe, it, expect, vi, afterEach } from "vitest"
import { DynamicCard } from "@/components/DynamicCard/DynamicCard"
import { addHandlers } from "../../msw.setup"
import { http, HttpResponse } from "msw"
import { createElement } from "../../utils/jsx"
import { createShopifyUrl } from "@/utils/createShopifyUrl"

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

  it("removes loading attribute even when error occurs", async () => {
    addProductHandlers({
      "error-handle": {
        markup: "Error",
        status: 500
      }
    })

    const card = (<nosto-dynamic-card handle="error-handle" template="default" />) as DynamicCard

    // The component should throw on error, but loading state should be cleaned up
    await expect(card.connectedCallback()).rejects.toThrow()
    expect(card.hasAttribute("loading")).toBe(false)
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
    expect(card.hasAttribute("loading")).toBe(false)
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

  it("throws error when markup contains body or html tags", async () => {
    const invalidMarkup = "<body><div>Invalid markup</div></body>"
    addProductHandlers({
      "invalid-handle": {
        markup: invalidMarkup
      }
    })

    const card = (<nosto-dynamic-card handle="invalid-handle" template="invalid" />) as DynamicCard

    await expect(card.connectedCallback()).rejects.toThrow(
      "Invalid markup for template invalid, make sure that no <body> or <html> tags are included."
    )
    expect(card.hasAttribute("loading")).toBe(false)
  })

  it("supports lazy loading with intersection observer", async () => {
    const validMarkup = "<div>Lazy loaded content</div>"
    addProductHandlers({
      "lazy-handle": {
        markup: validMarkup
      }
    })

    // Mock IntersectionObserver
    const mockObserve = vi.fn()
    const mockDisconnect = vi.fn()
    const mockIntersectionObserver = vi.fn().mockImplementation(callback => ({
      observe: mockObserve,
      disconnect: mockDisconnect,
      callback
    }))
    vi.stubGlobal("IntersectionObserver", mockIntersectionObserver)

    const card = (<nosto-dynamic-card handle="lazy-handle" template="lazy-template" lazy />) as DynamicCard

    await card.connectedCallback()

    // Should have set up intersection observer
    expect(mockIntersectionObserver).toHaveBeenCalled()
    expect(mockObserve).toHaveBeenCalledWith(card)

    // Simulate intersection
    const observerCallback = mockIntersectionObserver.mock.calls[0][0]
    await observerCallback([{ isIntersecting: true }])

    expect(mockDisconnect).toHaveBeenCalled()
    expect(card.innerHTML).toBe(validMarkup)

    vi.unstubAllGlobals()
  })

  it("includes variant parameter when variantId is provided", async () => {
    const validMarkup = "<div>Variant content</div>"

    // Mock the fetch to capture the URL
    let capturedUrl = ""
    addHandlers(
      http.get("/products/:handle", ({ request }) => {
        capturedUrl = request.url
        return HttpResponse.text(validMarkup)
      })
    )

    const card = (
      <nosto-dynamic-card handle="variant-handle" template="variant-template" variant-id="12345" />
    ) as DynamicCard

    await card.connectedCallback()

    expect(card.innerHTML).toBe(validMarkup)
    expect(capturedUrl).toContain("variant=12345")
  })

  it("processes section markup correctly when using section instead of template", async () => {
    const sectionMarkup = "<section><div>Section content</div></section>"

    addHandlers(
      http.get("/products/:handle", () => {
        return HttpResponse.text(sectionMarkup)
      })
    )

    const card = (<nosto-dynamic-card handle="section-handle" section="test-section" />) as DynamicCard

    await card.connectedCallback()

    // Should extract content from the section element
    expect(card.innerHTML).toBe("<div>Section content</div>")
  })
})
