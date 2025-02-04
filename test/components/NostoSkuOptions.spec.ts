import { describe, it, beforeEach, expect, vi } from "vitest"
import "@/components/NostoProduct"
import "@/components/NostoSkuOptions"
import { NostoProduct } from "@/components/NostoProduct"

type SkuOption = "colors" | "sizes"
type SkuOptionValue = "black" | "white" | "blue" | "l" | "m" | "s"

type OtherSkuOptions = {
  skuOption: SkuOption
  visibleSkus?: string[]
  hiddenSkus?: string[]
  preSelected?: string[]
}

describe("Sku options side effects", () => {
  let nostoProduct: NostoProduct

  beforeEach(() => {
    loadSkuContent()
    nostoProduct = document.querySelector<NostoProduct>("nosto-product")!
    window.Nosto = { addSkuToCart: vi.fn() }
  })

  function loadSkuContent() {
    document.body.innerHTML = `
      <nosto-product product-id="123" reco-id="789">
        <nosto-sku-options colors>
          <span black n-option n-skus="123,145" selected>Black</span>
          <span white n-option n-skus="223,234,245">White</span>
          <span blue n-option n-skus="334,345">Blue</span>
        </nosto-sku-options>
        <nosto-sku-options sizes>
          <span l n-option n-skus="123,223">L</span>
          <span m n-option n-skus="234,334">M</span>
          <span s n-option n-skus="145,245,345">S</span>
        </nosto-sku-options>
        <span n-atc>Add to cart</span>
      </nosto-product>
    `
  }

  function element(value: SkuOptionValue) {
    return nostoProduct.querySelector<HTMLElement>(`[${value}]`)!
  }

  function clickSkuOption(value: SkuOptionValue) {
    element(value).click()
  }

  function verifySkuSelection(value: SkuOptionValue) {
    const el = element(value)
    expect(el.hasAttribute("selected")).toBeTruthy()
    const otherSkuOptions = Array.from(element(value).parentNode!.children).filter(c => c !== el)
    const selectedOtherOptions = Array.from(otherSkuOptions).some(option => option.hasAttribute("selected"))
    expect(selectedOtherOptions).toBeFalsy()
  }

  function verifyOtherSkus({ skuOption, visibleSkus = [], hiddenSkus = [], preSelected = [] }: OtherSkuOptions) {
    const otherSkuElement = nostoProduct.querySelector(`nosto-sku-options[${skuOption}]`)
    testElementSkus(otherSkuElement!, visibleSkus, (element: HTMLElement) => element.style.display !== "none")
    testElementSkus(otherSkuElement!, hiddenSkus, (element: HTMLElement) => element.style.display === "none")
    testElementSkus(otherSkuElement!, preSelected, (element: HTMLElement) => element.hasAttribute("selected"))
  }

  function testElementSkus(element: Element, skus: string[], test: (optionElement: HTMLElement) => boolean) {
    skus
      .map(skus => element!.querySelector<HTMLElement>(`[n-skus="${skus}"]`))
      .filter(it => !!it)
      .every(optionElement => test(optionElement!))
  }

  function verifyATC() {
    const atc = nostoProduct.querySelector<HTMLElement>("[n-atc]")
    atc!.click()
    expect(window.Nosto?.addSkuToCart).toBeCalled()
    expect(window.Nosto?.addSkuToCart).toBeCalledWith({ productId: "123", skuId: nostoProduct.selectedSkuId }, "789", 1)
  }

  it("selected skuId should be undefined when all SKU options are not selected", () => {
    clickSkuOption("white") // 223,234,245
    verifySkuSelection("white")
    verifyOtherSkus({
      skuOption: "sizes",
      visibleSkus: ["123,223", "234,334", "145,245,345"]
    })

    expect(nostoProduct.selectedSkuId).toBeUndefined()
  })

  it("should provide selection side effects on SKU selection", () => {
    clickSkuOption("white") // 223,234,245
    verifySkuSelection("white")
    verifyOtherSkus({
      skuOption: "sizes",
      visibleSkus: ["123,223", "234,334", "145,245,345"]
    })

    clickSkuOption("m")
    verifySkuSelection("m")
    verifyOtherSkus({
      skuOption: "colors",
      visibleSkus: ["223,234,245", "334,345"],
      hiddenSkus: ["123,145"],
      preSelected: ["223,234,245"]
    })

    expect(nostoProduct.selectedSkuId).toBe("234")
    verifyATC()

    clickSkuOption("blue") //334,345
    verifySkuSelection("blue")
    verifyOtherSkus({
      skuOption: "sizes",
      visibleSkus: ["234,334", "145,245,345"],
      hiddenSkus: ["123,223"],
      preSelected: ["234,334"]
    })

    expect(nostoProduct.selectedSkuId).toBe("334")
    verifyATC()
  })
})
