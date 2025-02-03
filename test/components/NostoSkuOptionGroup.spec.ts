import { describe, it, beforeEach, expect } from "vitest"
import { NostoProduct } from "@/components/NostoProduct"
import { NostoSkuOptionGroup } from "@/components/NostoSkuOptionGroup"

describe("swatch side effects", () => {
  let nostoProduct: NostoProduct
  let firstNostoSkuOptionGroup: NostoSkuOptionGroup
  let secondNostoSkuOptionGroup: NostoSkuOptionGroup

  beforeEach(() => {
    nostoProduct = new NostoProduct()
    firstNostoSkuOptionGroup = new NostoSkuOptionGroup()
    secondNostoSkuOptionGroup = new NostoSkuOptionGroup()
    document.body.innerHTML = ""
    loadSkuContent()
  })

  // TODO handle ATC
  function loadSkuContent() {
    nostoProduct.setAttribute("product-id", "123")
    nostoProduct.setAttribute("reco-id", "789")

    firstNostoSkuOptionGroup.innerHTML = `
        <span n-option n-skus="123,145" selected>Black</span>
        <span n-option n-skus="223,234,245">White</span>
        <span n-option n-skus="334,345">Blue</span>
        `

    secondNostoSkuOptionGroup.innerHTML = `
        <span n-option n-skus="123,223" selected>L</span>
        <span n-option n-skus="234,334">M</span>
        <span n-option n-skus="145,245,345">S</span>
    `

    nostoProduct.appendChild(firstNostoSkuOptionGroup)
    nostoProduct.appendChild(secondNostoSkuOptionGroup)

    secondNostoSkuOptionGroup.connectedCallback()
    firstNostoSkuOptionGroup.connectedCallback()
    nostoProduct.connectedCallback()
  }

  function testClickedSku(sourceElement: HTMLElement, skuItemIndex: number) {
    const skuOption = sourceElement.querySelector<HTMLElement>(`[n-option]:nth-child(${skuItemIndex})`)
    expect(skuOption).toBeTruthy()
    skuOption!.click()
    expect(skuOption!.hasAttribute("selected")).toBeTruthy()

    const otherSkuOptions = sourceElement.querySelectorAll(`[n-option]:not(:nth-child(${skuItemIndex}))`)
    expect(otherSkuOptions.length).toBeGreaterThan(0)
    const selectedOtherOptions = Array.from(otherSkuOptions).some(option => option.hasAttribute("selected"))
    expect(selectedOtherOptions).toBeFalsy()
  }

  function testOtherSkusAfterClick(otherElement: HTMLElement) {
    const skuOption = otherElement.querySelector("[n-option]:nth-child(1)")
    expect(skuOption).toBeTruthy()
    expect(skuOption!.hasAttribute("selected")).toBeTruthy()

    const otherSkuOptions = otherElement.querySelectorAll("[n-option]:not(:nth-child(1))")
    expect(otherSkuOptions.length).toBeGreaterThan(0)
    const selectedOtherSecondSkuOptions = Array.from(otherSkuOptions).some(option => option.hasAttribute("selected"))
    expect(selectedOtherSecondSkuOptions).toBeFalsy()
  }

  it("should provide selection side effects on SKU selection", () => {
    testClickedSku(firstNostoSkuOptionGroup, 2) // 223,234,245
    testOtherSkusAfterClick(secondNostoSkuOptionGroup) // 123,223 & 234,334 & 145,245,345

    expect(nostoProduct.selectedSkuId).toBe("223") // first matching SkuId is selected by default
  })

  it("should provide selection side effects on reverse SKU selection", () => {
    testClickedSku(secondNostoSkuOptionGroup, 2) // 234,334
    testOtherSkusAfterClick(firstNostoSkuOptionGroup) // 223,234,245

    expect(nostoProduct.selectedSkuId).toBe("234") // first matching SkuId is selected by default
  })
})
