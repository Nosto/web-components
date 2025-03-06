import { describe, it, expect, beforeEach, vi } from "vitest"
import { NostoProduct } from "../../src/components/NostoProduct"
import { ATC_COMPLETE, EventDetail } from "@/placement-events"

describe("NostoProduct", () => {
  let element: NostoProduct
  const PROD_ID = "123"
  const RECO_ID = "789"
  const DIV_ID = "testpage-nosto-1"

  beforeEach(() => {
    element = new NostoProduct()
    document.body.innerHTML = ""
  })

  describe("verify setup & validation", () => {
    it("should be defined as a custom element", () => {
      expect(customElements.get("nosto-product")).toBe(NostoProduct)
    })

    it("should have observed attributes", () => {
      expect(NostoProduct.observedAttributes).toEqual(["product-id", "reco-id"])
    })

    it("should throw an error if no attribute is provided", () => {
      expect(() => element.connectedCallback()).toThrow("Product ID is required.")
    })

    it("should throw an error if product-id is not provided", () => {
      element.setAttribute("reco-id", RECO_ID)
      expect(() => element.connectedCallback()).toThrow("Product ID is required.")
    })

    it("should throw an error if reco-id is not provided", () => {
      element.setAttribute("product-id", PROD_ID)
      expect(() => element.connectedCallback()).toThrow("Slot ID is required.")
    })
  })

  describe("verify ATC", () => {
    beforeEach(() => {
      element.setAttribute("product-id", PROD_ID)
      element.setAttribute("reco-id", RECO_ID)
      window.Nosto = { addSkuToCart: vi.fn(() => Promise.resolve()) }
    })

    function checkSkuAtc(skuId: string) {
      const atc = element.querySelector<HTMLElement>(`[n-sku-id="${skuId}"] > [n-atc]`)
      checkAtc(atc!)
    }

    function checkProductAtc() {
      const atc = element.querySelector<HTMLElement>("[n-atc]")
      checkAtc(atc!)
    }

    function checkAtc(atcElement: HTMLElement) {
      atcElement.click()
      expect(window.Nosto!.addSkuToCart).toHaveBeenCalledWith(
        { productId: PROD_ID, skuId: element.selectedSkuId },
        RECO_ID,
        1
      )
    }

    async function waitForPlacementEvent(eventType: string) {
      return new Promise<EventDetail>(done => {
        const placement = document.querySelector<HTMLElement>(`[id="${DIV_ID}"]`)
        placement!.addEventListener(eventType, (event: Event) => done((event as CustomEvent).detail))
      })
    }

    async function checkProductAtcCompleteEvent() {
      const atc = element.querySelector<HTMLElement>("[n-atc]")
      checkAtcCompleteEvent(atc!)
    }

    function checkSkuAtcCompleteEvent(skuId: string) {
      const atc = element.querySelector<HTMLElement>(`[n-sku-id="${skuId}"] > [n-atc]`)
      checkAtcCompleteEvent(atc!)
    }

    async function checkAtcCompleteEvent(atcElement: HTMLElement) {
      atcElement!.click()
      const detail = await waitForPlacementEvent(ATC_COMPLETE)

      expect(window.Nosto!.addSkuToCart).toHaveBeenCalledWith(
        { productId: PROD_ID, skuId: element.selectedSkuId },
        RECO_ID,
        1
      )
      expect(detail).toEqual({
        productId: PROD_ID,
        skuId: element.selectedSkuId
      })
    }

    it("should not throw an error if all required attributes are provided", () => {
      expect(() => element.connectedCallback()).not.toThrow()
    })

    it("should call addSkuToCart when clicked on an element with [n-atc]", () => {
      element.innerHTML = `
      <div n-sku-id="456">
        <div n-atc>ATC</div>
      </div>
    `
      element.connectedCallback()

      checkSkuAtc("456")
    })

    it("should handle [n-atc] on every individual sku option", () => {
      element.innerHTML = `
      <div n-sku-id="456">
        <span n-atc>Blue</span>
      </div>
      <div n-sku-id="101">
        <span n-atc>Black</span>
      </div>
    `
      element.connectedCallback()

      checkSkuAtc("456")
      checkSkuAtc("101")
    })

    it("should pick n-sku-selector change events", () => {
      element.innerHTML = `
      <select n-sku-selector>
        <option value="456">SKU 1</option>
        <option value="457" selected>SKU 2</option>
      </select>
      <div n-atc>ATC</div>
      `
      element.connectedCallback()

      element.querySelector("[n-sku-selector]")!.dispatchEvent(new InputEvent("change", { bubbles: true }))
      checkProductAtc()
    })

    it("should pick up [n-sku-id] clicks", () => {
      element.innerHTML = `
      <div n-sku-id="234">1st sku</div>
      <div n-sku-id="345">end sku</div>
      <div n-atc>ATC</div>
    `
      element.connectedCallback()

      element.querySelector<HTMLElement>("[n-sku-id='345']")!.click()
      checkProductAtc()
    })

    it("should trigger nosto:atc:complete after product add to cart", async () => {
      const placementElement = document.createElement("div")
      placementElement.classList.add("nosto_element")
      placementElement.setAttribute("id", DIV_ID)

      element.innerHTML = `
      <div n-sku-id="234">1st sku</div>
      <div n-sku-id="345">end sku</div>
      <div n-atc>ATC</div>
    `
      placementElement.appendChild(element)
      document.body.appendChild(placementElement)

      element.querySelector<HTMLElement>("[n-sku-id='345']")!.click()
      await checkProductAtcCompleteEvent()
    })

    it("should trigger nosto:atc:complete after sku add to cart", () => {
      const placementElement = document.createElement("div")
      placementElement.classList.add("nosto_element")
      placementElement.setAttribute("id", DIV_ID)

      element.innerHTML = `
    <div n-sku-id="456">
      <span n-atc>Blue</span>
    </div>
    <div n-sku-id="101">
      <span n-atc>Black</span>
    </div>
  `
      placementElement.appendChild(element)
      document.body.appendChild(placementElement)

      checkSkuAtcCompleteEvent("456")
      checkSkuAtcCompleteEvent("101")
    })
  })
})
