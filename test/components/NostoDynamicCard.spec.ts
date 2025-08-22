import { describe, it, expect, vi, afterEach } from "vitest"
import { NostoDynamicCard } from "@/components/NostoDynamicCard/NostoDynamicCard"
import { addHandlers } from "../msw.setup"
import { http, HttpResponse } from "msw"

describe("NostoDynamicCard", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  // Helper function to create product handlers with configurable responses
  const createProductHandler = (
    responses: Record<string, { markup?: string; status?: number; params?: Record<string, string> }>
  ) => {
    return http.get("/products/:handle", ({ request, params }) => {
      const url = new URL(request.url)
      const handle = params.handle as string
      const response = responses[handle]

      if (!response) {
        return new HttpResponse(null, { status: 404 })
      }

      // Check if specific parameters are required
      if (response.params) {
        for (const [key, value] of Object.entries(response.params)) {
          if (url.searchParams.get(key) !== value) {
            return new HttpResponse(null, { status: 404 })
          }
        }
      }

      if (response.status && response.status !== 200) {
        return HttpResponse.text(response.markup || "Error", { status: response.status })
      }

      return HttpResponse.text(response.markup || "")
    })
  }

  it("fetches product data and sets innerHTML when markup is valid", async () => {
    const validMarkup = "<div>Product Info</div>"
    addHandlers(
      createProductHandler({
        "test-handle": {
          markup: validMarkup,
          params: { view: "default", layout: "none" }
        }
      })
    )

    const card = new NostoDynamicCard()
    card.handle = "test-handle"
    card.template = "default"

    // Call connectedCallback manually since it's not automatically triggered in tests.
    await card.connectedCallback()

    expect(card.innerHTML).toBe(validMarkup)
  })

  it("supports section rendering", async () => {
    const validMarkup = "<section><div>Product Info</div></section>"
    addHandlers(
      createProductHandler({
        "test-handle": {
          markup: `<section>${validMarkup}</section>`,
          params: { section_id: "product-card" }
        }
      })
    )

    const card = new NostoDynamicCard()
    card.handle = "test-handle"
    card.section = "product-card"

    // Call connectedCallback manually since it's not automatically triggered in tests.
    await card.connectedCallback()

    expect(card.innerHTML).toBe(validMarkup)
  })

  it("rerenders when attributes change", async () => {
    const validMarkup = "<div>Updated Product Info</div>"
    addHandlers(
      createProductHandler({
        "test-handle": {
          markup: "<div>Initial Product Info</div>",
          params: { view: "default", layout: "none" }
        },
        "updated-handle": {
          markup: validMarkup,
          params: { view: "default", layout: "none" }
        }
      })
    )

    const card = new NostoDynamicCard()
    card.handle = "test-handle"
    card.template = "default"
    document.body.appendChild(card)

    card.handle = "updated-handle"
    await new Promise(resolve => setTimeout(resolve, 10)) // Wait for async fetch to complete

    expect(card.innerHTML).toBe(validMarkup)
  })

  it("uses placeholder content when placeholder attribute is set and template matches", async () => {
    const validMarkup = "<div>Product Info</div>"
    addHandlers(
      createProductHandler({
        "test-handle": {
          markup: validMarkup,
          params: { view: "default", layout: "none" }
        },
        "test-handle2": {
          markup: validMarkup,
          params: { view: "default", layout: "none" }
        },
        "test-handle3": {
          markup: "<div>Custom Product Info</div>",
          params: { view: "custom", layout: "none" }
        }
      })
    )
    // @ts-expect-error partial mock assignment
    global.IntersectionObserver = vi.fn(() => ({
      observe: vi.fn(),
      disconnect: vi.fn()
    }))

    const card = new NostoDynamicCard()
    card.handle = "test-handle"
    card.template = "default"
    await card.connectedCallback()

    // placeholder is used, since template is the same
    const card2 = new NostoDynamicCard()
    card2.handle = "test-handle2"
    card2.template = "default"
    card2.placeholder = true
    card2.lazy = true
    await card2.connectedCallback()
    expect(card2.innerHTML).toBe(validMarkup)

    // placeholder is not used, since template is different
    const card3 = new NostoDynamicCard()
    card3.handle = "test-handle3"
    card3.template = "custom"
    card3.placeholder = true
    card3.lazy = true
    await card3.connectedCallback()
    expect(card3.innerHTML).toBe("")
  })

  it("fetches product lazily when lazy attribute is set", async () => {
    const validMarkup = "<div>Lazy Loaded Product Info</div>"
    addHandlers(
      createProductHandler({
        "lazy-handle": {
          markup: validMarkup,
          params: { view: "default", layout: "none" }
        }
      })
    )

    const card = new NostoDynamicCard()
    card.handle = "lazy-handle"
    card.template = "default"
    card.lazy = true

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
    addHandlers(
      createProductHandler({
        "handle-error": {
          markup: "Error",
          status: 500
        }
      })
    )

    const card = new NostoDynamicCard()
    card.handle = "handle-error"
    card.template = "default"

    await expect(card.connectedCallback()).rejects.toThrow("Failed to fetch product data")
  })

  it("throws error when markup is invalid", async () => {
    const invalidMarkup = "<html>Not allowed</html>"
    addHandlers(
      createProductHandler({
        "handle-invalid": {
          markup: invalidMarkup,
          params: { view: "default", layout: "none" }
        }
      })
    )

    const card = new NostoDynamicCard()
    card.handle = "handle-invalid"
    card.template = "default"

    await expect(card.connectedCallback()).rejects.toThrow("Invalid markup for template default")
  })
})
