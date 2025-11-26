import { describe, beforeEach, afterEach, it, expect, vi } from "vitest"
import { Popup } from "@/components/Popup/Popup"
import { mockNostojs } from "@nosto/nosto-js/testing"
import { element } from "../../utils/element"

describe("Popup", () => {
  const popupKey = "nosto:web-components:popup"

  function getPopupData() {
    return JSON.parse(localStorage.getItem(popupKey)!)
  }

  function setPopupData(data: { name: string; state: "open" | "ribbon" | "closed" }) {
    localStorage.setItem(popupKey, JSON.stringify(data))
  }

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()

    // Mock default successful segment check
    mockNostojs({
      internal: {
        getSegments: () => Promise.resolve(["matching-segment"])
      }
    })
  })

  afterEach(() => {
    // Clean up any popups created during tests
    document.querySelectorAll("nosto-popup").forEach(el => el.remove())
  })

  describe("Basic functionality", () => {
    it("should render shadow content with dialog and ribbon slots", async () => {
      const popup = element<Popup>`<nosto-popup name="test-popup"
          ><div slot="default">Dialog content</div>
          <div slot="ribbon">Ribbon content</div></nosto-popup
        >`

      document.body.appendChild(popup)
      await popup.connectedCallback()

      expect(popup.shadowRoot).toBeTruthy()
      expect(popup.shadowRoot?.querySelector("dialog")).toBeTruthy()
      expect(popup.shadowRoot?.querySelector(".ribbon")).toBeTruthy()
      expect(popup.shadowRoot?.querySelector('slot[name="default"]')).toBeTruthy()
      expect(popup.shadowRoot?.querySelector('slot[name="ribbon"]')).toBeTruthy()
    })

    it("should be visible by default", async () => {
      const popup = element<Popup>`<nosto-popup name="test-popup"><div slot="default">Content</div></nosto-popup>`

      document.body.appendChild(popup)
      await popup.connectedCallback()

      expect(popup.style.display).not.toBe("none")
    })
  })

  describe("Named popups and persistence", () => {
    it("should hide popup if it was previously closed and name is set", async () => {
      const popupName = "test-popup"
      setPopupData({ name: popupName, state: "closed" })

      const popup = element<Popup>`<nosto-popup name="${popupName}"><div slot="default">Content</div></nosto-popup>`

      document.body.appendChild(popup)
      await popup.connectedCallback()

      expect(popup.style.display).toBe("none")
    })

    it("should show popup if name is set but not previously closed", async () => {
      const popup = element<Popup>`<nosto-popup name="new-popup"><div slot="default">Content</div></nosto-popup>`

      document.body.appendChild(popup)
      await popup.connectedCallback()

      expect(popup.style.display).not.toBe("none")
    })

    it("should throw error when name attribute is missing", async () => {
      const popup = element<Popup>`<nosto-popup><div slot="default">Content</div></nosto-popup>`

      // Don't append to DOM to avoid automatic connectedCallback call
      // that would cause unhandled error
      await expect(popup.connectedCallback()).rejects.toThrow("Property name is required.")
    })
  })

  describe("Segment-based activation", () => {
    it("should show popup when user has matching segment", async () => {
      mockNostojs({
        internal: {
          getSegments: () => Promise.resolve(["segment1", "target-segment", "segment3"])
        }
      })

      const popup = element<Popup>`<nosto-popup name="test-popup" segment="target-segment"><div slot="default">Content</div></nosto-popup>`

      document.body.appendChild(popup)
      await popup.connectedCallback()

      expect(popup.style.display).not.toBe("none")
    })

    it("should hide popup when user does not have matching segment", async () => {
      mockNostojs({
        internal: {
          getSegments: () => Promise.resolve(["segment1", "segment2", "segment3"])
        }
      })

      const popup = element<Popup>`<nosto-popup name="test-popup" segment="non-matching-segment"
          ><div slot="default">Content</div></nosto-popup
        >`

      document.body.appendChild(popup)
      await popup.connectedCallback()

      expect(popup.style.display).toBe("none")
    })

    it("should show popup when no segment attribute is specified", async () => {
      const popup = element<Popup>`<nosto-popup name="test-popup"><div slot="default">Content</div></nosto-popup>`

      document.body.appendChild(popup)
      await popup.connectedCallback()

      expect(popup.style.display).not.toBe("none")
    })

    it("should propagate segment API errors", async () => {
      mockNostojs({
        internal: {
          getSegments: () => Promise.reject(new Error("API Error"))
        }
      })

      const popup = element<Popup>`<nosto-popup name="test-popup" segment="any-segment"><div slot="default">Content</div></nosto-popup>`

      // Don't append to DOM to avoid automatic connectedCallback call
      // that would cause unhandled error
      await expect(popup.connectedCallback()).rejects.toThrow("API Error")
    })
  })

  describe("Click handling and closing", () => {
    it("should close popup when element with n-close attribute is clicked", async () => {
      const popup = element<Popup>`<nosto-popup name="closeable-popup"
          ><div slot="default">
            <button n-close>Close</button>
          </div></nosto-popup
        >`

      document.body.appendChild(popup)
      await popup.connectedCallback()

      expect(popup.style.display).not.toBe("none")

      const closeButton = popup.querySelector("[n-close]") as HTMLButtonElement
      expect(closeButton).toBeTruthy()

      closeButton.click()

      expect(popup.style.display).toBe("none")
    })

    it("should store closed state in localStorage when popup has name", async () => {
      const popupName = "persistent-popup"
      const popup = element<Popup>`<nosto-popup name="${popupName}"
          ><div slot="default">
            <button n-close>Close</button>
          </div></nosto-popup
        >`

      document.body.appendChild(popup)
      await popup.connectedCallback()

      const closeButton = popup.querySelector("[n-close]") as HTMLButtonElement
      closeButton.click()

      expect(getPopupData()).toEqual({ name: popupName, state: "closed" })
    })

    it("should always store closed state in localStorage since name is required", async () => {
      const popup = element<Popup>`<nosto-popup name="always-stores-popup"
          ><div slot="default">
            <button n-close>Close</button>
          </div></nosto-popup
        >`

      document.body.appendChild(popup)
      await popup.connectedCallback()

      const closeButton = popup.querySelector("[n-close]") as HTMLButtonElement
      closeButton.click()

      expect(getPopupData()).toEqual({ name: "always-stores-popup", state: "closed" })
    })

    it("should handle click events on ribbon content with n-close", async () => {
      const popup = element<Popup>`<nosto-popup name="ribbon-popup"
          ><div slot="default">Dialog content</div>
          <div slot="ribbon">
            <span>Limited time!</span>
            <button n-close>×</button>
          </div></nosto-popup
        >`

      document.body.appendChild(popup)
      await popup.connectedCallback()

      const ribbonCloseButton = popup.querySelector('[slot="ribbon"] [n-close]') as HTMLButtonElement
      expect(ribbonCloseButton).toBeTruthy()

      ribbonCloseButton.click()

      expect(popup.style.display).toBe("none")
      expect(getPopupData()).toEqual({ name: "ribbon-popup", state: "closed" })
    })

    it("should not close popup when clicking elements without n-close attribute", async () => {
      const popup = element<Popup>`<nosto-popup name="test-popup"
          ><div slot="default">
            <p>Some content</p>
            <button>Regular button</button>
          </div></nosto-popup
        >`

      document.body.appendChild(popup)
      await popup.connectedCallback()

      const regularButton = popup.querySelector("button:not([n-close])") as HTMLButtonElement
      expect(regularButton).toBeTruthy()

      regularButton.click()

      expect(popup.style.display).not.toBe("none")
    })

    it("should prevent default and stop propagation on n-close click", async () => {
      const popup = element<Popup>`<nosto-popup name="test-popup"
          ><div slot="default">
            <a href="http://example.com" n-close> Close link </a>
          </div></nosto-popup
        >`

      document.body.appendChild(popup)
      await popup.connectedCallback()

      const closeLink = popup.querySelector("[n-close]") as HTMLAnchorElement

      const clickEvent = new Event("click", { bubbles: true, cancelable: true })
      const preventDefaultSpy = vi.spyOn(clickEvent, "preventDefault")
      const stopPropagationSpy = vi.spyOn(clickEvent, "stopPropagation")

      closeLink.dispatchEvent(clickEvent)

      expect(preventDefaultSpy).toHaveBeenCalled()
      expect(stopPropagationSpy).toHaveBeenCalled()
      expect(popup.style.display).toBe("none")
    })

    it("should close popup when clicking inside element with n-close attribute (ancestor support)", async () => {
      const popup = element<Popup>`<nosto-popup name="test-popup"
          ><div slot="default">
            <div n-close>
              <span>Click anywhere inside this div</span>
              <button>Inner button</button>
            </div>
          </div></nosto-popup
        >`

      document.body.appendChild(popup)
      await popup.connectedCallback()

      expect(popup.style.display).not.toBe("none")

      // Click on the inner button (child of element with n-close)
      const innerButton = popup.querySelector("button") as HTMLButtonElement
      expect(innerButton).toBeTruthy()

      innerButton.click()

      expect(popup.style.display).toBe("none")
    })
  })

  describe("Combined scenarios", () => {
    it("should respect both segment and closed state conditions", async () => {
      const popupName = "segment-popup"

      // First, close the popup
      setPopupData({ name: popupName, state: "closed" })

      // Set up segments that would normally show the popup
      mockNostojs({
        internal: {
          getSegments: () => Promise.resolve(["matching-segment"])
        }
      })

      const popup = element<Popup>`<nosto-popup name="${popupName}" segment="matching-segment"
          ><div slot="default">Content</div></nosto-popup
        >`

      document.body.appendChild(popup)
      await popup.connectedCallback()

      // Should be hidden because it was closed, despite matching segment
      expect(popup.style.display).toBe("none")
    })

    it("should hide popup when segment doesn't match, even without closed state", async () => {
      mockNostojs({
        internal: {
          getSegments: () => Promise.resolve(["other-segment"])
        }
      })

      const popup = element<Popup>`<nosto-popup name="new-segment-popup" segment="required-segment"
          ><div slot="default">Content</div></nosto-popup
        >`

      document.body.appendChild(popup)
      await popup.connectedCallback()

      expect(popup.style.display).toBe("none")
    })
  })

  describe("Ribbon mode functionality", () => {
    it("should switch to ribbon mode when n-ribbon element is clicked", async () => {
      const popup = element<Popup>`<nosto-popup name="ribbon-test-popup"
          ><div slot="default">
            <button n-ribbon>Switch to Ribbon</button>
          </div>
          <div slot="ribbon">
            <span>Ribbon content</span>
          </div></nosto-popup
        >`

      document.body.appendChild(popup)
      await popup.connectedCallback()

      const ribbonButton = popup.querySelector("[n-ribbon]") as HTMLButtonElement
      expect(ribbonButton).toBeTruthy()

      ribbonButton.click()

      // Check that ribbon state is stored
      expect(getPopupData()).toEqual({ name: "ribbon-test-popup", state: "ribbon" })

      // Check DOM structure after switch
      const dialog = popup.shadowRoot?.querySelector('[part="dialog"]')
      const ribbon = popup.shadowRoot?.querySelector('[part="ribbon"]')
      expect(dialog?.hasAttribute("open")).toBe(false)
      expect(ribbon?.classList.contains("hidden")).toBe(false)
    })

    it("should render in ribbon mode when localStorage state is 'ribbon'", async () => {
      const popupName = "persistent-ribbon-popup"
      setPopupData({ name: popupName, state: "ribbon" })

      const popup = element<Popup>`<nosto-popup name="${popupName}"
          ><div slot="default">Dialog content</div>
          <div slot="ribbon">Ribbon content</div></nosto-popup
        >`

      document.body.appendChild(popup)
      await popup.connectedCallback()

      const dialog = popup.shadowRoot?.querySelector('[part="dialog"]')
      const ribbon = popup.shadowRoot?.querySelector('[part="ribbon"]')
      expect(dialog?.hasAttribute("open")).toBe(false)
      expect(ribbon?.classList.contains("hidden")).toBe(false)
    })

    it("should prevent default and stop propagation on n-ribbon click", async () => {
      const popup = element<Popup>`<nosto-popup name="ribbon-events-popup"
          ><div slot="default">
            <a href="#" n-ribbon> Switch to Ribbon </a>
          </div></nosto-popup
        >`

      document.body.appendChild(popup)
      await popup.connectedCallback()

      const ribbonLink = popup.querySelector("[n-ribbon]") as HTMLAnchorElement

      const clickEvent = new Event("click", { bubbles: true, cancelable: true })
      const preventDefaultSpy = vi.spyOn(clickEvent, "preventDefault")
      const stopPropagationSpy = vi.spyOn(clickEvent, "stopPropagation")

      ribbonLink.dispatchEvent(clickEvent)

      expect(preventDefaultSpy).toHaveBeenCalled()
      expect(stopPropagationSpy).toHaveBeenCalled()
    })
  })
})
