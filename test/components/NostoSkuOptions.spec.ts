import { describe, it, beforeEach, expect } from "vitest"
import "@/components/NostoProduct"
import "@/components/NostoSkuOptions"
import { NostoProduct } from "@/components/NostoProduct"

type SkuOptionValue = "black" | "white" | "blue" | "l" | "m" | "s"

function element(value: SkuOptionValue) {
  return document.querySelector<HTMLElement>(`[${value}]`)!
}

function verifyEnabled(enabled: SkuOptionValue[], disabled: SkuOptionValue[]) {
  enabled.map(element).every(el => expect(el.hasAttribute("disabled")).toBeFalsy())
  disabled.map(element).every(el => expect(el.hasAttribute("disabled")).toBeTruthy())
}

function verifySelected(selected: SkuOptionValue[], unselected: SkuOptionValue[]) {
  selected.map(element).every(el => expect(el.hasAttribute("selected")).toBeTruthy())
  unselected.map(element).every(el => expect(el.hasAttribute("selected")).toBeFalsy())
}

describe("Sku options side effects", () => {
  let nostoProduct: NostoProduct

  beforeEach(() => {
    loadSkuContent()
    nostoProduct = document.querySelector<NostoProduct>("nosto-product")!
  })

  function loadSkuContent() {
    document.body.innerHTML = `
      <nosto-product product-id="123" reco-id="789">
        <nosto-sku-options name="colors">
          <span black n-option n-skus="123,145" selected>Black</span>
          <span white n-option n-skus="223,234,245">White</span>
          <span blue n-option n-skus="334,345">Blue</span>
        </nosto-sku-options>
        <nosto-sku-options name="sizes">
          <span l n-option n-skus="123,223">L</span>
          <span m n-option n-skus="234,334">M</span>
          <span s n-option n-skus="145,245,345">S</span>
        </nosto-sku-options>
      </nosto-product>
    `
  }

  it("selected skuId should be undefined when all SKU options are not selected", () => {
    element("white").click() // 223,234,245
    verifySelected(["white"], ["black", "blue"])
    verifyEnabled(["l", "m", "s"], [])

    expect(nostoProduct.selectedSkuId).toBeUndefined()
  })

  it("should provide selection side effects on SKU selection", () => {
    element("white").click() // 223,234,245
    verifySelected(["white"], ["black", "blue"])
    verifyEnabled(["l", "m", "s"], [])

    element("m").click() // 234,334
    verifySelected(["m"], ["l", "s"])
    verifyEnabled(["white", "blue"], ["black"])

    expect(nostoProduct.selectedSkuId).toBe("234")

    element("blue").click() //334,345
    verifySelected(["blue"], ["black", "white"])
    verifyEnabled(["m", "s"], ["l"])

    expect(nostoProduct.selectedSkuId).toBe("334")
  })
})
