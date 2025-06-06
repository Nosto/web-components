import { describe, it, expect, vi, afterEach } from "vitest"
import { NostoDynamicCards } from "../../src/components/NostoDynamicCards"

describe("NostoDynamicCards", () => {
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

    const card = new NostoDynamicCards()
    card.handles = "handle1,handle2"
    card.template = "default"

    // Call connectedCallback manually since it's not automatically triggered in tests.
    await card.connectedCallback()

    expect(global.fetch).toHaveBeenCalledWith("/products/handle1?view=default&layout=none")
    expect(global.fetch).toHaveBeenCalledWith("/products/handle2?view=default&layout=none")
    // Since we have two handles, it should concatenate the results
    expect(card.innerHTML).toBe(validMarkup + validMarkup)
  })

  it("should utilize inner template for rendering", async () => {
    const validMarkup = "<div>Product Info</div>"
    const fakeResponse = {
      ok: true,
      text: vi.fn().mockResolvedValue(validMarkup)
    }
    global.fetch = vi.fn().mockResolvedValue(fakeResponse)

    const card = new NostoDynamicCards()
    card.handles = "handle1,handle2"
    card.template = "default"
    card.innerHTML = `<template><div class="product"><slot></slot></div></template>`

    await card.connectedCallback()
    expect(card.innerHTML).toBe(`<div class="product">${validMarkup}</div><div class="product">${validMarkup}</div>`)
  })

  it("throws error when fetch response is not ok", async () => {
    const fakeResponse = {
      ok: false,
      text: vi.fn().mockResolvedValue("Error")
    }
    global.fetch = vi.fn().mockResolvedValue(fakeResponse)

    const card = new NostoDynamicCards()
    card.handles = "handle-error"
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

    const card = new NostoDynamicCards()
    card.handles = "handle-invalid"
    card.template = "default"

    await expect(card.connectedCallback()).rejects.toThrow("Invalid markup for template default")
  })
})
