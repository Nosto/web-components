/** @jsx createElement */
import { describe, beforeEach, afterEach, it, expect, vi, beforeAll } from "vitest"
import { Popup } from "@/components/Popup/Popup"
import { mockNostojs } from "@nosto/nosto-js/testing"
import { createElement } from "../../utils/jsx"

describe("Popup", () => {
  beforeAll(() => {
    if (!customElements.get("nosto-popup")) {
      customElements.define("nosto-popup", Popup)
    }
  })

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
      const popup = (
        <nosto-popup name="test-popup">
          <div slot="default">Dialog content</div>
          <div slot="ribbon">Ribbon content</div>
        </nosto-popup>
      ) as Popup

      document.body.appendChild(popup)
      await popup.connectedCallback()

      expect(popup.shadowRoot).toBeTruthy()
      expect(popup.shadowRoot?.querySelector("dialog")).toBeTruthy()
      expect(popup.shadowRoot?.querySelector(".ribbon")).toBeTruthy()
      expect(popup.shadowRoot?.querySelector('slot[name="default"]')).toBeTruthy()
      expect(popup.shadowRoot?.querySelector('slot[name="ribbon"]')).toBeTruthy()
    })

    it("should be visible by default", async () => {
      const popup = (
        <nosto-popup name="test-popup">
          <div slot="default">Content</div>
        </nosto-popup>
      ) as Popup

      document.body.appendChild(popup)
      await popup.connectedCallback()

      expect(popup.style.display).not.toBe("none")
    })
  })

  describe("Named popups and persistence", () => {
    it("should hide popup if it was previously closed and name is set", async () => {
      const popupName = "test-popup"
      localStorage.setItem(`nosto:web-components:popup:${popupName}`, "closed")

      const popup = (
        <nosto-popup name={popupName}>
          <div slot="default">Content</div>
        </nosto-popup>
      ) as Popup

      document.body.appendChild(popup)
      await popup.connectedCallback()

      expect(popup.style.display).toBe("none")
    })

    it("should show popup if name is set but not previously closed", async () => {
      const popup = (
        <nosto-popup name="new-popup">
          <div slot="default">Content</div>
        </nosto-popup>
      ) as Popup

      document.body.appendChild(popup)
      await popup.connectedCallback()

      expect(popup.style.display).not.toBe("none")
    })

    it("should throw error when name attribute is missing", async () => {
      const popup = (
        <nosto-popup>
          <div slot="default">Content</div>
        </nosto-popup>
      ) as Popup

      document.body.appendChild(popup)

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

      const popup = (
        <nosto-popup name="test-popup" segment="target-segment">
          <div slot="default">Content</div>
        </nosto-popup>
      ) as Popup

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

      const popup = (
        <nosto-popup name="test-popup" segment="non-matching-segment">
          <div slot="default">Content</div>
        </nosto-popup>
      ) as Popup

      document.body.appendChild(popup)
      await popup.connectedCallback()

      expect(popup.style.display).toBe("none")
    })

    it("should show popup when no segment attribute is specified", async () => {
      const popup = (
        <nosto-popup name="test-popup">
          <div slot="default">Content</div>
        </nosto-popup>
      ) as Popup

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

      const popup = (
        <nosto-popup name="test-popup" segment="any-segment">
          <div slot="default">Content</div>
        </nosto-popup>
      ) as Popup

      document.body.appendChild(popup)

      await expect(popup.connectedCallback()).rejects.toThrow("API Error")
    })
  })

  describe("Click handling and closing", () => {
    it("should close popup when element with n-close attribute is clicked", async () => {
      const popup = (
        <nosto-popup name="closeable-popup">
          <div slot="default">
            <button n-close>Close</button>
          </div>
        </nosto-popup>
      ) as Popup

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
      const popup = (
        <nosto-popup name={popupName}>
          <div slot="default">
            <button n-close>Close</button>
          </div>
        </nosto-popup>
      ) as Popup

      document.body.appendChild(popup)
      await popup.connectedCallback()

      const closeButton = popup.querySelector("[n-close]") as HTMLButtonElement
      closeButton.click()

      expect(localStorage.getItem(`nosto:web-components:popup:${popupName}`)).toBe("closed")
    })

    it("should always store closed state in localStorage since name is required", async () => {
      const popup = (
        <nosto-popup name="always-stores-popup">
          <div slot="default">
            <button n-close>Close</button>
          </div>
        </nosto-popup>
      ) as Popup

      document.body.appendChild(popup)
      await popup.connectedCallback()

      const closeButton = popup.querySelector("[n-close]") as HTMLButtonElement
      closeButton.click()

      expect(localStorage.getItem("nosto:web-components:popup:always-stores-popup")).toBe("closed")
    })

    it("should handle click events on ribbon content with n-close", async () => {
      const popup = (
        <nosto-popup name="ribbon-popup">
          <div slot="default">Dialog content</div>
          <div slot="ribbon">
            <span>Limited time!</span>
            <button n-close>×</button>
          </div>
        </nosto-popup>
      ) as Popup

      document.body.appendChild(popup)
      await popup.connectedCallback()

      const ribbonCloseButton = popup.querySelector('[slot="ribbon"] [n-close]') as HTMLButtonElement
      expect(ribbonCloseButton).toBeTruthy()

      ribbonCloseButton.click()

      expect(popup.style.display).toBe("none")
      expect(localStorage.getItem("nosto:web-components:popup:ribbon-popup")).toBe("closed")
    })

    it("should not close popup when clicking elements without n-close attribute", async () => {
      const popup = (
        <nosto-popup name="test-popup">
          <div slot="default">
            <p>Some content</p>
            <button>Regular button</button>
          </div>
        </nosto-popup>
      ) as Popup

      document.body.appendChild(popup)
      await popup.connectedCallback()

      const regularButton = popup.querySelector("button:not([n-close])") as HTMLButtonElement
      expect(regularButton).toBeTruthy()

      regularButton.click()

      expect(popup.style.display).not.toBe("none")
    })

    it("should prevent default and stop propagation on n-close click", async () => {
      const popup = (
        <nosto-popup name="test-popup">
          <div slot="default">
            <a href="http://example.com" n-close>
              Close link
            </a>
          </div>
        </nosto-popup>
      ) as Popup

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
      const popup = (
        <nosto-popup name="test-popup">
          <div slot="default">
            <div n-close>
              <span>Click anywhere inside this div</span>
              <button>Inner button</button>
            </div>
          </div>
        </nosto-popup>
      ) as Popup

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
      localStorage.setItem(`nosto:web-components:popup:${popupName}`, "closed")

      // Set up segments that would normally show the popup
      mockNostojs({
        internal: {
          getSegments: () => Promise.resolve(["matching-segment"])
        }
      })

      const popup = (
        <nosto-popup name={popupName} segment="matching-segment">
          <div slot="default">Content</div>
        </nosto-popup>
      ) as Popup

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

      const popup = (
        <nosto-popup name="new-segment-popup" segment="required-segment">
          <div slot="default">Content</div>
        </nosto-popup>
      ) as Popup

      document.body.appendChild(popup)
      await popup.connectedCallback()

      expect(popup.style.display).toBe("none")
    })
  })
})
