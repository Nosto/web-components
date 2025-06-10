import { describe, it, expect, vi, afterEach } from "vitest"
import { NostoDynamicCard } from "../../src/components/NostoDynamicCard"

describe("NostoDynamicCard", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("fetches product data and sets innerHTML when markup is valid", async () => {
    const validMarkup = "<div>Product Info</div>"
    const fakeResponse = {
      ok: true,
      text: vi.fn().mockResolvedValue(validMarkup)
    }
    global.fetch = vi.fn().mockResolvedValue(fakeResponse)

    const card = new NostoDynamicCard()
    card.handle = "test-handle"
    card.template = "default"

    // Call connectedCallback manually since it's not automatically triggered in tests.
    await card.connectedCallback()

    expect(global.fetch).toHaveBeenCalledWith("/products/test-handle?view=default&layout=none")
    expect(card.innerHTML).toBe(validMarkup)
  })

  it("uses placeholder content when placeholder attribute is set and template matches", async () => {
    const validMarkup = "<div>Product Info</div>"
    const fakeResponse = {
      ok: true,
      text: vi.fn().mockResolvedValue(validMarkup)
    }
    global.fetch = vi.fn().mockResolvedValue(fakeResponse)
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
    const fakeResponse = {
      ok: true,
      text: vi.fn().mockResolvedValue(validMarkup)
    }
    global.fetch = vi.fn().mockResolvedValue(fakeResponse)

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

    expect(global.fetch).toHaveBeenCalledWith("/products/lazy-handle?view=default&layout=none")
    await new Promise(resolve => setTimeout(resolve, 10)) // Wait for async fetch to complete
    expect(card.innerHTML).toBe(validMarkup)
  })

  it("throws error when fetch response is not ok", async () => {
    const fakeResponse = {
      ok: false,
      text: vi.fn().mockResolvedValue("Error")
    }
    global.fetch = vi.fn().mockResolvedValue(fakeResponse)

    const card = new NostoDynamicCard()
    card.handle = "handle-error"
    card.template = "default"

    await expect(card.connectedCallback()).rejects.toThrow("Failed to fetch product data")
  })

  it("throws error when markup is invalid", async () => {
    const invalidMarkup = "<html>Not allowed</html>"
    const fakeResponse = {
      ok: true,
      text: vi.fn().mockResolvedValue(invalidMarkup)
    }
    global.fetch = vi.fn().mockResolvedValue(fakeResponse)

    const card = new NostoDynamicCard()
    card.handle = "handle-invalid"
    card.template = "default"

    await expect(card.connectedCallback()).rejects.toThrow("Invalid markup for template default")
  })
})
