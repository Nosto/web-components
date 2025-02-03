import { describe, it, beforeEach, expect } from "vitest"
import "@/components/NostoProduct"
import "@/components/NostoSkuOptions"
import { NostoProduct } from "@/components/NostoProduct"

type SkuOption = "colors" | "sizes"

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
  })

  function testClickedSku(skuOption: SkuOption, skuItemIndex: number) {
    const sourceElement = nostoProduct.querySelector(`nosto-sku-options[${skuOption}]`)
    expect(sourceElement).toBeTruthy()
    const skuOptionElement = sourceElement!.querySelector<HTMLElement>(`[n-option]:nth-child(${skuItemIndex})`)
    expect(skuOptionElement).toBeTruthy()
    skuOptionElement!.click()
    expect(skuOptionElement!.hasAttribute("selected")).toBeTruthy()

    const otherSkuOptions = sourceElement!.querySelectorAll(`[n-option]:not(:nth-child(${skuItemIndex}))`)
    expect(otherSkuOptions.length).toBeGreaterThan(0)
    const selectedOtherOptions = Array.from(otherSkuOptions).some(option => option.hasAttribute("selected"))
    expect(selectedOtherOptions).toBeFalsy()
  }

  function testOtherSkusAfterClick({
    skuOption,
    visibleSkus = [],
    hiddenSkus = [],
    preSelected = []
  }: OtherSkuOptions) {
    const otherSkuElement = nostoProduct.querySelector(`nosto-sku-options[${skuOption}]`)
    expect(otherSkuElement).toBeTruthy()

    testElementSkus(otherSkuElement!, visibleSkus, (element: HTMLElement) => element.style.display !== "none")

    testElementSkus(otherSkuElement!, hiddenSkus, (element: HTMLElement) => element.style.display === "none")

    testElementSkus(otherSkuElement!, preSelected, (element: HTMLElement) => element.hasAttribute("selected"))
  }

  function testElementSkus(element: Element, skus: string[], test: (optionElement: HTMLElement) => boolean) {
    skus
      .map(skus => element!.querySelector<HTMLElement>(`[n-skus="${skus}"]`))
      .filter(it => it !== undefined)
      .every(optionElement => test(optionElement!))
  }

  // TODO handle ATC
  function loadSkuContent() {
    document.body.innerHTML = `
      <nosto-product product-id="123" reco-id="789">
        <nosto-sku-options colors>
          <span n-option n-skus="123,145" selected>Black</span>
          <span n-option n-skus="223,234,245">White</span>
          <span n-option n-skus="334,345">Blue</span>
        </nosto-sku-options>
        <nosto-sku-options sizes>
          <span n-option n-skus="123,223">L</span>
          <span n-option n-skus="234,334">M</span>
          <span n-option n-skus="145,245,345">S</span>
        </nosto-sku-options>
      </nosto-product>
    `
  }

  it("selected skuId should be undefined when all SKU options are not selected", () => {
    testClickedSku("colors", 2) // 223,234,245
    testOtherSkusAfterClick({
      skuOption: "sizes",
      visibleSkus: ["123,223", "234,334", "145,245,345"]
    })

    expect(nostoProduct.selectedSkuId).toBeUndefined()
  })

  it("should provide selection side effects on SKU selection", () => {
    testClickedSku("colors", 2) // 223,234,245
    testOtherSkusAfterClick({
      skuOption: "sizes",
      visibleSkus: ["123,223", "234,334", "145,245,345"]
    })

    testClickedSku("sizes", 2)
    testOtherSkusAfterClick({
      skuOption: "colors",
      visibleSkus: ["223,234,245", "334,345"],
      hiddenSkus: ["123,145"],
      preSelected: ["223,234,245"]
    })

    expect(nostoProduct.selectedSkuId).toBe("234")

    testClickedSku("colors", 3) //334,345
    testOtherSkusAfterClick({
      skuOption: "sizes",
      visibleSkus: ["234,334", "145,245,345"],
      hiddenSkus: ["123,223"],
      preSelected: ["234,334"]
    })

    expect(nostoProduct.selectedSkuId).toBe("334")
  })
})
