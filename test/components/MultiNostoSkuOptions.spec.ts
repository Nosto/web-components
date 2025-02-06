import { describe, it, beforeEach, expect } from "vitest"
import "@/components/NostoProduct"
import "@/components/NostoSkuOptions"
import { NostoProduct } from "@/components/NostoProduct"

type SkuOptionValue = "black" | "white" | "blue" | "l" | "m" | "s" | "ma" | "fe"
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
        <nosto-sku-options name="gender">
          <span ma n-option n-skus="123,145,234,245,345">M</span>
          <span fe n-option n-skus="223,234,334,345">F</span>
        </nosto-sku-options>
      </nosto-product>
    `
  }

  it("selected skuId should be undefined when all SKU options are not selected", () => {
    element("black").click() // 123,145
    verify({
      selected: ["black"],
      unselected: ["white", "blue"]
    })
    verify({ enabled: ["l", "s", "ma"], disabled: ["m", "fe"] })

    expect(nostoProduct.selectedSkuId).toBeUndefined()
  })

  it("should provide selection side effects on SKU selection", () => {
    // select color
    element("blue").click() // 334,345
    verify({
      selected: ["blue"],
      unselected: ["black", "white"]
    })
    verify({ enabled: ["m", "s", "ma", "fe"], disabled: ["l"] })

    expect(nostoProduct.selectedSkuId).toBeUndefined()

    // select size
    element("s").click() // 145,245,345
    verify({ selected: ["s"], unselected: ["l", "m"] })
    verify({ enabled: ["black", "white", "blue", "ma", "fe"] })

    expect(nostoProduct.selectedSkuId).toBeUndefined()

    // select gender
    element("fe").click() // 223,234,334,345
    verify({ selected: ["fe"], unselected: ["ma"] })
    // verify({ enabled: ["white", "blue", "l", "m", "s"], disabled: ["black"] })

    // expect(nostoProduct.selectedSkuId).toBe("345")

    // select size
    element("m").click() // 234,334
    verify({ selected: ["m"], unselected: ["l", "s"] })
    // verify({ enabled: ["white", "blue", "ma", "fe"], disabled: ["black"] })

    element("blue").click() // 334,345
    verify({
      selected: ["blue"],
      unselected: ["black", "white"]
    })
    verify({ enabled: ["m", "s", "ma", "fe"], disabled: ["l"] })
  })
})
