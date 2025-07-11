import { describe, it, beforeEach, expect, vi } from "vitest"
import "@/components/NostoProduct/NostoProduct"
import "@/components/NostoSkuOptions/NostoSkuOptions"
import { NostoProduct } from "@/components/NostoProduct/NostoProduct"
import { createElement } from "../utils/jsx"

const values = ["black", "white", "blue", "l", "m", "s", "cotton", "silk", "wool"] as const
type SkuOptionValue = (typeof values)[number]
type Verification = "selected" | "unselected" | "enabled" | "disabled" | "unavailable"
type Options = Partial<Record<Verification, SkuOptionValue[]>>

const PROD_ID = "987"
const RECO_ID = "789"

function element(value: SkuOptionValue) {
  return document.querySelector<HTMLElement>(`[${value}]`)!
}

function expectMatches(predicate: (el: HTMLElement) => boolean, expected: SkuOptionValue[] | undefined) {
  if (expected) {
    expect(values.filter(v => element(v) && predicate(element(v))).sort()).toEqual(expected.sort())
  }
}

function verify({ enabled, disabled, selected, unselected, unavailable }: Options) {
  expectMatches(el => !el.hasAttribute("disabled"), enabled)
  expectMatches(el => el.hasAttribute("disabled"), disabled)
  expectMatches(el => el.hasAttribute("selected"), selected)
  expectMatches(el => !el.hasAttribute("selected"), unselected)
  expectMatches(el => el.hasAttribute("unavailable"), unavailable)
}

describe("NostoSkuOptions", () => {
  const colors = ["black", "white", "blue"] as const
  const sizes = ["l", "m", "s"] as const
  const materials = ["cotton", "silk", "wool"] as const
  let nostoProduct: NostoProduct

  function verifyATCInvocation() {
    const atc = nostoProduct.querySelector<HTMLElement>("[n-atc]")
    atc!.click()
    expect(window.Nosto!.addSkuToCart).toBeCalledWith(
      { productId: PROD_ID, skuId: nostoProduct.selectedSkuId },
      RECO_ID,
      1
    )
  }

  function verifyATCSkipped() {
    const atc = nostoProduct.querySelector<HTMLElement>("[n-atc]")
    atc!.click()
    expect(window.Nosto!.addSkuToCart).not.toHaveBeenCalled()
  }

  describe("Two sku option groups", () => {
    beforeEach(() => {
      loadContent()
      nostoProduct = document.querySelector<NostoProduct>("nosto-product")!
      window.Nosto = { addSkuToCart: vi.fn() }
    })

    function loadContent() {
      document.body.replaceChildren(
        <nosto-product product-id={PROD_ID} reco-id={RECO_ID}>
          <nosto-sku-options name="colors">
            <span black n-option n-skus="123,145"></span>
            <span white n-option n-skus="223,234,245"></span>
            <span blue n-option n-skus="334,345"></span>
          </nosto-sku-options>
          <nosto-sku-options name="sizes">
            <span l n-option n-skus="123,223"></span>
            <span m n-option n-skus="234,334"></span>
            <span s n-option n-skus="145,245,345"></span>
          </nosto-sku-options>
          <span n-atc>Add to cart</span>
        </nosto-product>
      )
    }

    it("selected skuId should be undefined when all SKU options are not selected", () => {
      element("white").click() // 223,234,245
      verify({
        selected: ["white"],
        unselected: ["black", "blue", ...sizes]
      })
      verify({ enabled: [...colors, ...sizes] })

      expect(nostoProduct.selectedSkuId).toBeUndefined()
    })

    it("should reflect sku selection in both property and attribute", () => {
      element("white").click()
      expect(nostoProduct.selectedSkuId).toBe(undefined)
      expect(nostoProduct.hasAttribute("sku-selected")).toBe(false)

      element("m").click()
      expect(nostoProduct.selectedSkuId).toBe("234")
      expect(nostoProduct.hasAttribute("sku-selected")).toBe(true)
    })

    it("should provide selection side effects on SKU selection", () => {
      element("white").click() // 223,234,245
      verify({
        selected: ["white"],
        unselected: ["black", "blue", ...sizes]
      })
      verify({ enabled: [...colors, ...sizes] })
      expect(nostoProduct.selectedSkuId).toBeUndefined()
      verifyATCSkipped()

      element("m").click() // 234,334
      verify({ selected: ["m", "white"], unselected: ["black", "blue", "l", "s"] })
      verify({ enabled: [...sizes, "white", "blue"], disabled: ["black"] })

      expect(nostoProduct.selectedSkuId).toBe("234")
      verifyATCInvocation()

      element("blue").click() //334,345
      verify({ selected: ["blue", "m"], unselected: ["black", "white", "l", "s"] })
      verify({ enabled: ["blue", "white", "m", "s"], disabled: ["black", "l"] })

      expect(nostoProduct.selectedSkuId).toBe("334")
      verifyATCInvocation()
    })

    it("should not change selection when disabled option is clicked", () => {
      element("white").click()
      element("m").click()
      element("blue").click()

      // click on disabled element
      element("l").click()
      expect(element("l").hasAttribute("selected")).toBeFalsy()
    })

    it("should directly add to cart when n-atc attribute is present on n-option", () => {
      element("l").toggleAttribute("n-atc")
      element("black").click()
      element("l").click()

      expect(nostoProduct.selectedSkuId).toBe("123")
      expect(window.Nosto!.addSkuToCart).toBeCalledWith(
        { productId: PROD_ID, skuId: nostoProduct.selectedSkuId },
        RECO_ID,
        1
      )
    })

    it("should not add to cart when n-atc attribute is not present on n-option", () => {
      element("black").click()
      element("l").click()

      expect(nostoProduct.selectedSkuId).toBe("123")
      expect(window.Nosto!.addSkuToCart).not.toHaveBeenCalled()
    })
  })

  describe("Two sku option groups in select", () => {
    beforeEach(() => {
      loadContent()
      nostoProduct = document.querySelector<NostoProduct>("nosto-product")!
      window.Nosto = { addSkuToCart: vi.fn() }
    })

    function loadContent() {
      document.body.replaceChildren(
        <nosto-product product-id={PROD_ID} reco-id={RECO_ID}>
          <nosto-sku-options name="colors">
            <select n-target>
              <option value="black" n-skus="123,145"></option>
              <option value="white" n-skus="223,234,245"></option>
              <option value="blue" n-skus="334,345"></option>
            </select>
          </nosto-sku-options>
          <nosto-sku-options name="sizes">
            <select n-target>
              <option>Unselected</option>
              <option value="l" n-skus="123,223"></option>
              <option value="m" n-skus="234,334"></option>
              <option value="s" n-skus="145,245,345"></option>
            </select>
          </nosto-sku-options>
          <span n-atc>Add to cart</span>
        </nosto-product>
      )
    }

    it("should handle preselection", () => {
      // black is preselected
      const sizes = document.querySelector<HTMLSelectElement>("nosto-sku-options[name='sizes'] select")!

      sizes.value = "l"
      sizes.dispatchEvent(new Event("change"))
      expect(nostoProduct.selectedSkuId).toBe("123")
      expect(nostoProduct.hasAttribute("sku-selected")).toBe(true)
    })

    it("should update selection when select is changed", () => {
      const colors = document.querySelector<HTMLSelectElement>("nosto-sku-options[name='colors'] select")!
      const sizes = document.querySelector<HTMLSelectElement>("nosto-sku-options[name='sizes'] select")!

      colors.value = "white"
      colors.dispatchEvent(new Event("change"))
      expect(nostoProduct.selectedSkuId).toBeUndefined()
      expect(nostoProduct.hasAttribute("sku-selected")).toBe(false)

      sizes.value = "m"
      sizes.dispatchEvent(new Event("change"))
      expect(nostoProduct.selectedSkuId).toBe("234")
      expect(nostoProduct.hasAttribute("sku-selected")).toBe(true)
    })
  })

  describe("Sku options with 3 dimensions", () => {
    beforeEach(() => {
      loadContent()
      nostoProduct = document.querySelector<NostoProduct>("nosto-product")!
      window.Nosto = { addSkuToCart: vi.fn() }
    })

    function loadContent() {
      document.body.replaceChildren(
        <nosto-product product-id={PROD_ID} reco-id={RECO_ID}>
          <nosto-sku-options name="colors">
            <span black n-option n-skus="123,145"></span>
            <span white n-option n-skus="223,234,245"></span>
            <span blue n-option n-skus="334,345"></span>
          </nosto-sku-options>
          <nosto-sku-options name="sizes">
            <span l n-option n-skus="123,223"></span>
            <span m n-option n-skus="234,334"></span>
            <span s n-option n-skus="145,245,345"></span>
          </nosto-sku-options>
          <nosto-sku-options name="materials">
            <span cotton n-option n-skus="123,234,345"></span>
            <span silk n-option n-skus="145,223,334"></span>
            <span wool n-option n-skus="245"></span>
          </nosto-sku-options>
          <span n-atc>Add to cart</span>
        </nosto-product>
      )
    }

    it("should prune selection", () => {
      // material chosen
      element("wool").click() // 245
      verify({
        selected: ["wool"],
        enabled: [...materials, "white", "s"],
        disabled: ["black", "blue", "l", "m"]
      })
      expect(nostoProduct.selectedSkuId).toBeUndefined()
      verifyATCSkipped()

      // different material chosen
      element("silk").click() // 145,223,334
      verify({
        selected: ["silk"],
        enabled: [...materials, ...colors, ...sizes]
      })
      expect(nostoProduct.selectedSkuId).toBeUndefined()
      verifyATCSkipped()

      // size chosen
      element("m").click() // 234,334
      verify({
        selected: ["silk", "m"],
        enabled: ["blue", "white", "l", "m", "s", "silk", "cotton"],
        disabled: ["black", "wool"]
      })
      expect(nostoProduct.selectedSkuId).toBeUndefined()
      verifyATCSkipped()

      // color chosen
      element("blue").click() // 334
      verify({
        selected: ["silk", "m", "blue"],
        enabled: ["white", "s", "cotton", "blue", "m", "silk"],
        disabled: ["black", "l", "wool"]
      })
      expect(nostoProduct.selectedSkuId).toBe("334")
      verifyATCInvocation()
    })

    it("should prune with different path", () => {
      // selection order shouldn't matter
      element("blue").click() // 334
      element("m").click() // 234,334
      element("silk").click() // 145,223,334

      verify({
        selected: ["silk", "m", "blue"],
        enabled: ["white", "s", "cotton", "blue", "m", "silk"],
        disabled: ["black", "l", "wool"]
      })
    })

    it("should prune with different path 2", () => {
      // selection order shouldn't matter
      element("blue").click() // 334
      element("silk").click() // 145,223,334
      element("m").click() // 234,334

      verify({
        selected: ["silk", "m", "blue"],
        enabled: ["white", "s", "cotton", "blue", "m", "silk"],
        disabled: ["black", "l", "wool"]
      })
    })
  })

  describe("Two sku option groups with OOS products", () => {
    beforeEach(() => {
      loadContent()
      nostoProduct = document.querySelector<NostoProduct>("nosto-product")!
      window.Nosto = { addSkuToCart: vi.fn() }
    })

    function loadContent() {
      // 123 and 223 are OOS
      document.body.replaceChildren(
        <nosto-product product-id={PROD_ID} reco-id={RECO_ID}>
          <nosto-sku-options name="colors">
            <span black n-option n-skus="145" n-skus-oos="123"></span>
            <span white n-option n-skus="234,245" n-skus-oos="223"></span>
            <span blue n-option n-skus="334,345"></span>
          </nosto-sku-options>
          <nosto-sku-options name="sizes">
            <span l n-option n-skus-oos="123,223"></span>
            <span m n-option n-skus="234,334"></span>
            <span s n-option n-skus="145,245,345"></span>
          </nosto-sku-options>
          <span n-atc>Add to cart</span>
        </nosto-product>
      )
    }

    it("should mark out-of-stock options as unavailable", () => {
      verify({
        selected: [],
        unavailable: ["l"],
        disabled: []
      })
    })

    it("should handle selection with out-of-stock options", () => {
      element("black").click() // 145,123
      verify({
        selected: ["black"],
        unavailable: ["l"],
        disabled: ["m"]
      })
    })

    it("should handle selection with out-of-stock options2", () => {
      element("blue").click() // 334,345
      verify({
        selected: ["blue"],
        unavailable: [],
        disabled: ["l"]
      })
    })
  })

  describe("SKU option image updates", () => {
    it("should update image when color option with image is selected", () => {
      document.body.replaceChildren(
        <nosto-product product-id={PROD_ID} reco-id={RECO_ID}>
          <nosto-sku-options name="colors">
            <span black n-option n-skus="sku123" n-img="image.jpg" />
          </nosto-sku-options>
          <nosto-sku-options name="sizes">
            <span n-option n-skus="sku123" />
          </nosto-sku-options>
        </nosto-product>
      )

      nostoProduct = document.querySelector("nosto-product")!
      element("black").click()
      expect(nostoProduct.style.getPropertyValue("--n-img")).toEqual("url(image.jpg)")
    })

    it("should update image, price and listPrice from SKU data", () => {
      document.body.replaceChildren(
        <nosto-product product-id={PROD_ID} reco-id={RECO_ID}>
          <span n-price></span>
          <span n-list-price></span>
          <nosto-sku-options name="colors">
            <span black n-option n-skus="sku123" />
          </nosto-sku-options>
          <script type="application/json" n-sku-data>
            {JSON.stringify([{ id: "sku123", image: "image.jpg", price: "10€", listPrice: "15€" }])}
          </script>
        </nosto-product>
      )

      nostoProduct = document.querySelector("nosto-product")!
      element("black").click()
      expect(nostoProduct.style.getPropertyValue("--n-img")).toEqual("url(image.jpg)")
      expect(nostoProduct.querySelector("span[n-price]")?.innerHTML).toEqual("10€")
      expect(nostoProduct.querySelector("span[n-list-price]")?.innerHTML).toEqual("15€")
    })

    it("should skip updates of non-unique SKU data", () => {
      document.body.replaceChildren(
        <nosto-product product-id={PROD_ID} reco-id={RECO_ID}>
          <span n-price></span>
          <span n-list-price></span>
          <nosto-sku-options name="colors">
            <span black n-option n-skus="sku123,sku234" />
          </nosto-sku-options>
          <script type="application/json" n-sku-data>
            {JSON.stringify([
              { id: "sku123", image: "image.jpg", price: "10€", listPrice: "15€" },
              { id: "sku123", image: "image.jpg", price: "12€", listPrice: "17€" }
            ])}
          </script>
        </nosto-product>
      )

      nostoProduct = document.querySelector("nosto-product")!
      element("black").click()
      expect(nostoProduct.style.getPropertyValue("--n-img")).toEqual("url(image.jpg)")
      expect(nostoProduct.querySelector("span[n-price]")?.innerHTML).toEqual("")
      expect(nostoProduct.querySelector("span[n-list-price]")?.innerHTML).toEqual("")
    })

    it("should not update SKU or image when no options are selected", () => {
      document.body.replaceChildren(
        <nosto-product product-id={PROD_ID} reco-id={RECO_ID}>
          <nosto-sku-options name="colors">
            <span black n-option n-skus="123,145" n-img="img-black.jpg" n-alt-img="alt-black.jpg"></span>
            <span white n-option n-skus="223,234,245" n-img="img-white.jpg" n-alt-img="alt-white.jpg"></span>
          </nosto-sku-options>
          <nosto-sku-options name="sizes">
            <span l n-option n-skus="123,223"></span>
            <span m n-option n-skus="234,334"></span>
          </nosto-sku-options>
          <span n-atc>Add to cart</span>
        </nosto-product>
      )

      nostoProduct = document.querySelector<NostoProduct>("nosto-product")!
      window.Nosto = { addSkuToCart: vi.fn() }

      expect(nostoProduct.selectedSkuId).toBeUndefined()
      expect(nostoProduct.hasAttribute("sku-selected")).toBe(false)

      expect(nostoProduct.style.getPropertyValue("--n-img")).toBe("")
      expect(nostoProduct.style.getPropertyValue("--n-alt-img")).toBe("")
    })
  })

  describe("SKU option price updates", () => {
    it("should update price when option with price is selected", () => {
      document.body.replaceChildren(
        <nosto-product product-id={PROD_ID} reco-id={RECO_ID}>
          <nosto-sku-options name="colors">
            <span black n-option n-skus="sku123" />
          </nosto-sku-options>
          <nosto-sku-options name="sizes">
            <span l n-option n-skus="sku123" n-price="10€" n-list-price="15€" />
          </nosto-sku-options>
          <div n-price>20€</div>
          <div n-list-price>30€</div>
        </nosto-product>
      )

      nostoProduct = document.querySelector("nosto-product")!
      element("l").click()
      expect(nostoProduct.querySelector("div[n-price]")?.innerHTML).toEqual("10€")
      expect(nostoProduct.querySelector("div[n-list-price]")?.innerHTML).toEqual("15€")

      // assert that n-option element contents are not affected
      expect(element("l").innerHTML).toBe("")
    })
  })
})
