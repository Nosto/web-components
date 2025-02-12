import { describe, it, beforeEach, expect, vi } from "vitest"
import "@/components/NostoProduct"
import "@/components/NostoSkuOptions"
import { NostoProduct } from "@/components/NostoProduct"

const values = ["black", "white", "blue", "l", "m", "s", "cotton", "silk", "wool"] as const
type SkuOptionValue = (typeof values)[number]
type Verification = "selected" | "unselected" | "enabled" | "disabled"
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

function verify({ enabled, disabled, selected, unselected }: Options) {
  expectMatches(el => !el.hasAttribute("disabled"), enabled)
  expectMatches(el => el.hasAttribute("disabled"), disabled)
  expectMatches(el => el.hasAttribute("selected"), selected)
  expectMatches(el => !el.hasAttribute("selected"), unselected)
}

describe("NostoSkuOptions side effects", () => {
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
      document.body.innerHTML = `
      <nosto-product product-id="${PROD_ID}" reco-id="${RECO_ID}">
        <nosto-sku-options name="colors">
          <span black n-option n-skus="123,145">Black</span>
          <span white n-option n-skus="223,234,245">White</span>
          <span blue n-option n-skus="334,345">Blue</span>
        </nosto-sku-options>
        <nosto-sku-options name="sizes">
          <span l n-option n-skus="123,223">L</span>
          <span m n-option n-skus="234,334">M</span>
          <span s n-option n-skus="145,245,345">S</span>
        </nosto-sku-options>
        <span n-atc>Add to cart</span>
      </nosto-product>
    `
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
  })

  describe("Sku options with 3 dimensions", () => {
    beforeEach(() => {
      loadContent()
      nostoProduct = document.querySelector<NostoProduct>("nosto-product")!
      window.Nosto = { addSkuToCart: vi.fn() }
    })

    function loadContent() {
      document.body.innerHTML = `
      <nosto-product product-id="${PROD_ID}" reco-id="${RECO_ID}">
        <nosto-sku-options name="colors">
          <span black n-option n-skus="123,145">Black</span>
          <span white n-option n-skus="223,234,245">White</span>
          <span blue n-option n-skus="334,345">Blue</span>
        </nosto-sku-options>
        <nosto-sku-options name="sizes">
          <span l n-option n-skus="123,223">L</span>
          <span m n-option n-skus="234,334">M</span>
          <span s n-option n-skus="145,245,345">S</span>
        </nosto-sku-options>
        <nosto-sku-options name="materials">
          <span cotton n-option n-skus="123,234,345">Cotton</span>
          <span silk n-option n-skus="145,223,334">Silk</span>
          <span wool n-option n-skus="245">Wool</span>
        </nosto-sku-options>  
        <span n-atc>Add to cart</span>
      </nosto-product>`
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
})
