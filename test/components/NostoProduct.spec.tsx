import { describe, it, expect, beforeEach, vi } from "vitest"
import { NostoProduct } from "../../src/components/NostoProduct"
import { EventName } from "@/components/NostoProduct/events"
import { createElement } from "../utils/jsx"

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

    it("should throw an error if no attribute is provided", () => {
      expect(() => element.connectedCallback()).toThrow("Property productId is required.")
    })

    it("should throw an error if product-id is not provided", () => {
      element.setAttribute("reco-id", RECO_ID)
      expect(() => element.connectedCallback()).toThrow("Property productId is required.")
    })

    it("should throw an error if reco-id is not provided", () => {
      element.setAttribute("product-id", PROD_ID)
      expect(() => element.connectedCallback()).toThrow("Property recoId is required.")
    })
  })

  describe("verify Add to cart", () => {
    beforeEach(() => {
      element.setAttribute("product-id", PROD_ID)
      element.setAttribute("reco-id", RECO_ID)
      window.Nosto = { addSkuToCart: vi.fn(() => Promise.resolve()) }
    })

    function checkSkuAddToCart(skuId: string) {
      const atc = element.querySelector<HTMLElement>(`[n-sku-id="${skuId}"] > [n-atc]`)
      checkAddToCart(atc!)
    }

    function checkProductAddToCart() {
      const atc = element.querySelector<HTMLElement>("[n-atc]")
      checkAddToCart(atc!)
    }

    function checkAddToCart(atcElement: HTMLElement) {
      atcElement.click()
      expect(window.Nosto!.addSkuToCart).toHaveBeenCalledWith(
        { productId: PROD_ID, skuId: element.selectedSkuId },
        RECO_ID,
        1
      )
    }

    async function waitForPlacementEvent(eventType: EventName) {
      return new Promise(resolve => {
        const placement = document.querySelector<HTMLElement>(`[id="${DIV_ID}"]`)
        placement!.addEventListener(`nosto:${eventType}`, (event: Event) => resolve((event as CustomEvent).detail))
      })
    }

    async function checkProductAddToCartCompleteEvent() {
      const atc = element.querySelector<HTMLElement>("[n-atc]")
      await checkAddToCartCompleteEvent(atc!)
    }

    async function checkSkuAddToCartCompleteEvent(skuId: string) {
      const atc = element.querySelector<HTMLElement>(`[n-sku-id="${skuId}"] > [n-atc]`)
      await checkAddToCartCompleteEvent(atc!)
    }

    async function checkAddToCartCompleteEvent(atcElement: HTMLElement) {
      atcElement!.click()
      const detail = await waitForPlacementEvent("atc:complete")

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
      element.appendChild(
        <div n-sku-id="456">
          <div n-atc>Add to Cart</div>
        </div>
      )
      element.connectedCallback()

      checkSkuAddToCart("456")
    })

    it("should emit nosto:atc:no-sku event when no sku is selected", async () => {
      element.appendChild(<div n-atc>Add to Cart</div>)

      const placementElement = document.createElement("div")
      placementElement.classList.add("nosto_element")
      placementElement.setAttribute("id", DIV_ID)
      placementElement.appendChild(element)
      document.body.replaceChildren(placementElement)

      const detail = waitForPlacementEvent("atc:no-sku-selected")
      element.querySelector<HTMLElement>("[n-atc]")!.click()
      expect(await detail).toEqual({ productId: PROD_ID })
    })

    it("should toggle sku-selected attribute when selectedSkuId changes", () => {
      element.appendChild(
        <div n-sku-id="456">
          <div n-atc>Add to Cart</div>
        </div>
      )
      element.connectedCallback()

      expect(element.hasAttribute("sku-selected")).toBe(false)
      element.querySelector<HTMLElement>("[n-atc]")!.click()
      expect(element.hasAttribute("sku-selected")).toBe(true)
    })

    it("should handle [n-atc] on every individual sku option", () => {
      element.append(
        <div n-sku-id="456">
          <span n-atc>Blue</span>
        </div>,
        <div n-sku-id="101">
          <span n-atc>Black</span>
        </div>
      )
      element.connectedCallback()

      checkSkuAddToCart("456")
      checkSkuAddToCart("101")
    })

    it("should pick n-sku-selector change events", () => {
      element.append(
        <select n-sku-selector>
          <option value="456">SKU 1</option>
          <option value="457" selected>
            SKU 2
          </option>
        </select>,
        <div n-atc>Add to cart</div>
      )
      element.connectedCallback()

      element.querySelector("[n-sku-selector]")!.dispatchEvent(new InputEvent("change", { bubbles: true }))
      checkProductAddToCart()
    })

    it("should pick up [n-sku-id] clicks", () => {
      element.append(<div n-sku-id="234">1st sku</div>, <div n-sku-id="345">end sku</div>, <div n-atc>Add to cart</div>)
      element.connectedCallback()

      element.querySelector<HTMLElement>("[n-sku-id='345']")!.click()
      checkProductAddToCart()
    })

    it("should update images on [n-sku-id] clicks", () => {
      element.append(
        <div n-sku-id="234" n-img="blue.jpg" n-alt-img="green.jpg">
          1st sku
        </div>,
        <div n-sku-id="345">end sku</div>,
        <div n-atc>Add to cart</div>
      )
      element.connectedCallback()

      element.querySelector<HTMLElement>("[n-sku-id='345']")!.click()
      expect(element.style.getPropertyValue("--n-img")).toBe("")
      expect(element.style.getPropertyValue("--n-alt-img")).toBe("")

      element.querySelector<HTMLElement>("[n-sku-id='234']")!.click()
      expect(element.style.getPropertyValue("--n-img")).toBe("url(blue.jpg)")
      expect(element.style.getPropertyValue("--n-alt-img")).toBe("url(green.jpg)")
    })

    it("should update images elements on [n-sku-id] clicks", () => {
      element.append(
        <div n-sku-id="234" n-img="blue.jpg" n-alt-img="green.jpg">
          1st sku
        </div>,
        <img n-img />,
        <img n-alt-img />,
        <div n-sku-id="345">end sku</div>,
        <div n-atc>Add to cart</div>
      )
      element.connectedCallback()

      element.querySelector<HTMLElement>("[n-sku-id='345']")!.click()
      expect(element.querySelector<HTMLImageElement>("img[n-img]")?.src).toBe("")
      expect(element.querySelector<HTMLImageElement>("img[n-alt-img]")?.src).toBe("")

      element.querySelector<HTMLElement>("[n-sku-id='234']")!.click()
      expect(element.querySelector<HTMLImageElement>("img[n-img]")?.src).toBe("http://localhost:3000/blue.jpg")
      expect(element.querySelector<HTMLImageElement>("img[n-alt-img]")?.src).toBe("http://localhost:3000/green.jpg")
    })

    it("should trigger nosto:atc:complete after product add to cart", async () => {
      const placementElement = document.createElement("div")
      placementElement.classList.add("nosto_element")
      placementElement.setAttribute("id", DIV_ID)

      element.append(<div n-sku-id="234">1st sku</div>, <div n-sku-id="345">end sku</div>, <div n-atc>Add to cart</div>)
      placementElement.appendChild(element)
      document.body.replaceChildren(placementElement)

      element.querySelector<HTMLElement>("[n-sku-id='345']")!.click()
      await checkProductAddToCartCompleteEvent()
    })

    it("should trigger nosto:atc:complete after sku add to cart", async () => {
      const placementElement = document.createElement("div")
      placementElement.classList.add("nosto_element")
      placementElement.setAttribute("id", DIV_ID)

      element.append(
        <div n-sku-id="456">
          <span n-atc>Blue</span>
        </div>,
        <div n-sku-id="101">
          <span n-atc>Black</span>
        </div>
      )
      placementElement.appendChild(element)
      document.body.replaceChildren(placementElement)

      await checkSkuAddToCartCompleteEvent("456")
      await checkSkuAddToCartCompleteEvent("101")
    })
  })
})
