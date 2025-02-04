import { describe, it, beforeEach, expect } from "vitest"
import "@/components/NostoProduct"
import "@/components/NostoSkuOptions"
import { NostoProduct } from "@/components/NostoProduct"

type SkuOptionValue = "black" | "white" | "blue" | "l" | "m" | "s"
type Verification = "selected" | "unselected" | "enabled" | "disabled"
type Options = Partial<Record<Verification, SkuOptionValue[]>>

function element(value: SkuOptionValue) {
  return document.querySelector<HTMLElement>(`[${value}]`)!
}

function verify({ enabled = [], disabled = [], selected = [], unselected = [] }: Options) {
  enabled.map(element).every(el => expect(el.hasAttribute("disabled")).toBeFalsy())
  disabled.map(element).every(el => expect(el.hasAttribute("disabled")).toBeTruthy())
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
          <span black n-option n-skus="123,145">Black</span>
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
    verify({
      selected: ["white"],
      unselected: ["black", "blue"]
    })
    verify({ enabled: ["l", "m", "s"] })

    expect(nostoProduct.selectedSkuId).toBeUndefined()
  })

  it("should provide selection side effects on SKU selection", () => {
    element("white").click() // 223,234,245
    verify({
      selected: ["white"],
      unselected: ["black", "blue"]
    })
    verify({ enabled: ["l", "m", "s"] })

    element("m").click() // 234,334
    verify({ selected: ["m"], unselected: ["l", "s"] })
    verify({ enabled: ["white", "blue"], disabled: ["black"] })

    expect(nostoProduct.selectedSkuId).toBe("234")

    element("blue").click() //334,345
    verify({ selected: ["blue"], unselected: ["black", "white"] })
    verify({ enabled: ["m", "s"], disabled: ["l"] })

    expect(nostoProduct.selectedSkuId).toBe("334")
  })
})
