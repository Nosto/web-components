import { describe, it, beforeEach, vi, expect, afterEach, beforeAll } from "vitest"
import { QuickView } from "@/components/QuickView/QuickView"
import { addHandlers } from "../msw.setup"
import { http, HttpResponse } from "msw"

describe("QuickView", () => {
  let quickView: QuickView

  beforeAll(() => {
    // for some reason JSDOM does not implement attachShadow on dialog elements
    HTMLDialogElement.prototype.attachShadow = () => new DocumentFragment() as ShadowRoot
    HTMLDialogElement.prototype.showModal = vi.fn()
  })

  beforeEach(() => {
    quickView = document.createElement("nosto-quick-view") as QuickView
    quickView.handle = "test-handle"
    quickView.recoId = "test-reco"
  })

  afterEach(() => {
    document.body.innerHTML = ""
    vi.restoreAllMocks()
  })

  it("throws if handle is missing on connectedCallback", async () => {
    const el = document.createElement("nosto-quick-view") as QuickView
    expect(() => el.connectedCallback()).toThrow("handle attribute is required for QuickView")
  })

  it("adds click event listener on connectedCallback", async () => {
    const addEventListenerSpy = vi.spyOn(quickView, "addEventListener")
    await quickView.connectedCallback()
    expect(addEventListenerSpy).toHaveBeenCalledWith("click", quickView)
  })

  it("fetches product data and shows dialog on click", async () => {
    const fakeProduct = { id: 1, title: "Test", handle: "test-handle", options: [] }
    // Use MSW to mock the fetch call for product data
    addHandlers(
      http.get("/products/test-handle.js", () => {
        return HttpResponse.json(fakeProduct)
      })
    )

    await quickView.connectedCallback()
    const event = new MouseEvent("click", { bubbles: true })
    await quickView.handleEvent(event)
    expect(quickView.querySelector("dialog")).toBeTruthy()
    expect((quickView.querySelector("dialog") as HTMLDialogElement).showModal).toBeCalled()
  })
})
