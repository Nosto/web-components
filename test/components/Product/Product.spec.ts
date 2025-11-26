import { describe, it, expect, beforeEach, vi } from "vitest"
import { Product } from "@/components/Product/Product"
import { EventName } from "@/components/Product/events"
import { element, elements } from "../../utils/createElement"

describe("Product", () => {
  let testElement: Product
  const PROD_ID = "123"
  const RECO_ID = "789"
  const DIV_ID = "testpage-nosto-1"

  beforeEach(() => {
    testElement = new Product()
  })

  describe("verify setup & validation", () => {
    it("should be defined as a custom element", () => {
      expect(customElements.get("nosto-product")).toBe(Product)
    })

    it("should throw an error if no attribute is provided", () => {
      expect(() => testElement.connectedCallback()).toThrow("Property productId is required.")
    })

    it("should throw an error if product-id is not provided", () => {
      testElement.setAttribute("reco-id", RECO_ID)
      expect(() => testElement.connectedCallback()).toThrow("Property productId is required.")
    })

    it("should throw an error if reco-id is not provided", () => {
      testElement.setAttribute("product-id", PROD_ID)
      expect(() => testElement.connectedCallback()).toThrow("Property recoId is required.")
    })
  })

  describe("verify Add to cart", () => {
    beforeEach(() => {
      testElement.setAttribute("product-id", PROD_ID)
      testElement.setAttribute("reco-id", RECO_ID)
      window.Nosto = { addSkuToCart: vi.fn(() => Promise.resolve()) }
    })

    function checkSkuAddToCart(skuId: string) {
      const atc = testElement.querySelector<HTMLElement>(`[n-sku-id="${skuId}"] > [n-atc]`)
      checkAddToCart(atc!)
    }

    function checkProductAddToCart() {
      const atc = testElement.querySelector<HTMLElement>("[n-atc]")
      checkAddToCart(atc!)
    }

    function checkAddToCart(atcElement: HTMLElement) {
      atcElement.click()
      expect(window.Nosto!.addSkuToCart).toHaveBeenCalledWith(
        { productId: PROD_ID, skuId: testElement.selectedSkuId },
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
      const atc = testElement.querySelector<HTMLElement>("[n-atc]")
      await checkAddToCartCompleteEvent(atc!)
    }

    async function checkSkuAddToCartCompleteEvent(skuId: string) {
      const atc = testElement.querySelector<HTMLElement>(`[n-sku-id="${skuId}"] > [n-atc]`)
      await checkAddToCartCompleteEvent(atc!)
    }

    async function checkAddToCartCompleteEvent(atcElement: HTMLElement) {
      atcElement!.click()
      const detail = await waitForPlacementEvent("atc:complete")

      expect(window.Nosto!.addSkuToCart).toHaveBeenCalledWith(
        { productId: PROD_ID, skuId: testElement.selectedSkuId },
        RECO_ID,
        1
      )
      expect(detail).toEqual({
        productId: PROD_ID,
        skuId: testElement.selectedSkuId
      })
    }

    it("should not throw an error if all required attributes are provided", () => {
      expect(() => testElement.connectedCallback()).not.toThrow()
    })

    it("should call addSkuToCart when clicked on an element with [n-atc]", () => {
      testElement.appendChild(
        element`<div n-sku-id="456">
            <div n-atc="">Add to Cart</div>
          </div>`
      )
      testElement.connectedCallback()

      checkSkuAddToCart("456")
    })

    it("should emit nosto:atc:no-sku event when no sku is selected", async () => {
      testElement.appendChild(element`<div n-atc="">Add to Cart</div>`)

      const placementElement = document.createElement("div")
      placementElement.classList.add("nosto_element")
      placementElement.setAttribute("id", DIV_ID)
      placementElement.appendChild(testElement)
      document.body.replaceChildren(placementElement)

      const detail = waitForPlacementEvent("atc:no-sku-selected")
      testElement.querySelector<HTMLElement>("[n-atc]")!.click()
      expect(await detail).toEqual({ productId: PROD_ID })
    })

    it("should toggle sku-selected attribute when selectedSkuId changes", () => {
      testElement.appendChild(
        element`<div n-sku-id="456">
            <div n-atc="">Add to Cart</div>
          </div>`
      )
      testElement.connectedCallback()

      expect(testElement.hasAttribute("sku-selected")).toBe(false)
      testElement.querySelector<HTMLElement>("[n-atc]")!.click()
      expect(testElement.hasAttribute("sku-selected")).toBe(true)
    })

    it("should handle [n-atc] on every individual sku option", () => {
      testElement.append(
        ...elements`<div n-sku-id="456">
            <span n-atc="">Blue</span>
          </div><div n-sku-id="101">
            <span n-atc="">Black</span>
          </div>`
      )
      testElement.connectedCallback()

      checkSkuAddToCart("456")
      checkSkuAddToCart("101")
    })

    it("should pick n-sku-selector change events", () => {
      testElement.append(
        ...elements`<select n-sku-selector>
            <option value="456">SKU 1</option>
            <option value="457" selected>SKU 2</option>
          </select><div n-atc="">Add to cart</div>`
      )
      testElement.connectedCallback()

      testElement.querySelector("[n-sku-selector]")!.dispatchEvent(new InputEvent("change", { bubbles: true }))
      checkProductAddToCart()
    })

    it("should pick up [n-sku-id] clicks", () => {
      testElement.append(
        ...elements`<div n-sku-id="234">1st sku</div><div n-sku-id="345">end sku</div><div n-atc="">Add to cart</div>`
      )
      testElement.connectedCallback()

      testElement.querySelector<HTMLElement>("[n-sku-id='345']")!.click()
      checkProductAddToCart()
    })

    it("should update images on [n-sku-id] clicks", () => {
      testElement.append(
        ...elements`<div n-sku-id="234" n-img="blue.jpg" n-alt-img="green.jpg">1st sku</div><div n-sku-id="345">end sku</div><div n-atc="">Add to cart</div>`
      )
      testElement.connectedCallback()

      testElement.querySelector<HTMLElement>("[n-sku-id='345']")!.click()
      expect(testElement.style.getPropertyValue("--n-img")).toBe("")
      expect(testElement.style.getPropertyValue("--n-alt-img")).toBe("")

      testElement.querySelector<HTMLElement>("[n-sku-id='234']")!.click()
      expect(testElement.style.getPropertyValue("--n-img")).toBe("url(blue.jpg)")
      expect(testElement.style.getPropertyValue("--n-alt-img")).toBe("url(green.jpg)")
    })

    it("should update images based on sku data", () => {
      const skuData = JSON.stringify([{ id: "234", image: "blue.jpg", altImage: "green.jpg" }, { id: "345" }])
      const scriptEl = document.createElement("script")
      scriptEl.type = "application/json"
      scriptEl.setAttribute("n-sku-data", "")
      scriptEl.textContent = skuData
      testElement.append(
        ...elements`<div n-sku-id="234">1st sku</div><div n-sku-id="345">end sku</div>`,
        scriptEl,
        ...elements`<div n-atc="">Add to cart</div>`
      )
      testElement.connectedCallback()

      testElement.querySelector<HTMLElement>("[n-sku-id='345']")!.click()
      expect(testElement.style.getPropertyValue("--n-img")).toBe("")
      expect(testElement.style.getPropertyValue("--n-alt-img")).toBe("")

      testElement.querySelector<HTMLElement>("[n-sku-id='234']")!.click()
      expect(testElement.style.getPropertyValue("--n-img")).toBe("url(blue.jpg)")
      expect(testElement.style.getPropertyValue("--n-alt-img")).toBe("url(green.jpg)")
    })

    it("should update prices based on sku data", () => {
      const skuData = JSON.stringify([{ id: "234", price: "10€", listPrice: "15€" }, { id: "345" }])
      const scriptEl = document.createElement("script")
      scriptEl.type = "application/json"
      scriptEl.setAttribute("n-sku-data", "")
      scriptEl.textContent = skuData
      testElement.append(
        ...elements`<div n-sku-id="234">1st sku</div><span n-price="">20€</span><span n-list-price="">30€</span>`,
        scriptEl,
        ...elements`<div n-atc="">Add to cart</div>`
      )
      testElement.connectedCallback()

      testElement.querySelector<HTMLElement>("[n-sku-id='234']")!.click()
      expect(testElement.querySelector("[n-price]")?.innerHTML).toBe("10€")
      expect(testElement.querySelector("[n-list-price]")?.innerHTML).toBe("15€")
    })

    it("should update images elements on [n-sku-id] clicks", () => {
      testElement.append(
        ...elements`<div n-sku-id="234" n-img="blue.jpg" n-alt-img="green.jpg">1st sku</div><img n-img="" /><img n-alt-img="" /><div n-sku-id="345">end sku</div><div n-atc="">Add to cart</div>`
      )
      testElement.connectedCallback()

      testElement.querySelector<HTMLElement>("[n-sku-id='345']")!.click()
      expect(testElement.querySelector<HTMLImageElement>("img[n-img]")?.src).toBe("")
      expect(testElement.querySelector<HTMLImageElement>("img[n-alt-img]")?.src).toBe("")

      testElement.querySelector<HTMLElement>("[n-sku-id='234']")!.click()
      expect(testElement.querySelector<HTMLImageElement>("img[n-img]")?.src).toBe("http://localhost:3000/blue.jpg")
      expect(testElement.querySelector<HTMLImageElement>("img[n-alt-img]")?.src).toBe("http://localhost:3000/green.jpg")
    })

    it("should update prices on [n-sku-id] clicks", () => {
      testElement.append(
        ...elements`<div n-sku-id="234" n-price="10€" n-list-price="15€">1st sku</div><span n-price="">20€</span><span n-list-price="">30€</span><div n-sku-id="345" n-price="12€" n-list-price="17€">2nd sku</div><div n-atc="">Add to cart</div>`
      )
      testElement.connectedCallback()

      testElement.querySelector<HTMLElement>("[n-sku-id='345']")!.click()
      expect(testElement.querySelector<HTMLImageElement>("span[n-price]")?.innerHTML).toBe("12€")
      expect(testElement.querySelector<HTMLImageElement>("span[n-list-price]")?.innerHTML).toBe("17€")

      // assert that SKU element contents are not affected
      expect(testElement.querySelector<HTMLElement>("[n-sku-id='234']")?.innerHTML).toBe("1st sku")
      expect(testElement.querySelector<HTMLElement>("[n-sku-id='345']")?.innerHTML).toBe("2nd sku")

      testElement.querySelector<HTMLElement>("[n-sku-id='234']")!.click()
      expect(testElement.querySelector<HTMLImageElement>("span[n-price]")?.innerHTML).toBe("10€")
      expect(testElement.querySelector<HTMLImageElement>("span[n-list-price]")?.innerHTML).toBe("15€")
    })

    it("should trigger nosto:atc:complete after product add to cart", async () => {
      const placementElement = document.createElement("div")
      placementElement.classList.add("nosto_element")
      placementElement.setAttribute("id", DIV_ID)

      testElement.append(
        ...elements`<div n-sku-id="234">1st sku</div><div n-sku-id="345">end sku</div><div n-atc="">Add to cart</div>`
      )
      placementElement.appendChild(testElement)
      document.body.replaceChildren(placementElement)

      testElement.querySelector<HTMLElement>("[n-sku-id='345']")!.click()
      await checkProductAddToCartCompleteEvent()
    })

    it("should trigger nosto:atc:complete after sku add to cart", async () => {
      const placementElement = document.createElement("div")
      placementElement.classList.add("nosto_element")
      placementElement.setAttribute("id", DIV_ID)

      testElement.append(
        ...elements`<div n-sku-id="456">
            <span n-atc="">Blue</span>
          </div><div n-sku-id="101">
            <span n-atc="">Black</span>
          </div>`
      )
      placementElement.appendChild(testElement)
      document.body.replaceChildren(placementElement)

      await checkSkuAddToCartCompleteEvent("456")
      await checkSkuAddToCartCompleteEvent("101")
    })
  })
})
