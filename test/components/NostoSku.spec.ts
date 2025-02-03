import { describe, it, beforeEach, vi, expect } from "vitest"
import { NostoProduct } from "@/components/NostoProduct"
import { NostoSku } from "@/components/NostoSku"

describe("swatch side effects", () => {
  let nostoProduct: NostoProduct
  let nostoSkuFirst: NostoSku
  let nostoSkuSecond: NostoSku

  beforeEach(() => {
    nostoProduct = new NostoProduct()
    nostoSkuFirst = new NostoSku()
    nostoSkuSecond = new NostoSku()
    document.body.innerHTML = ""
    loadSkuContent()
  })

  // TODO handle ATC
  function loadSkuContent() {
    nostoProduct.setAttribute("product-id", "123")
    nostoProduct.setAttribute("reco-id", "789")

    nostoSkuFirst.innerHTML = `
        <span n-option n-skus="123,145" selected>Black</span>
        <span n-option n-skus="223,234,245">White</span>
        <span n-option n-skus="334,345">Blue</span>
        `

    nostoSkuSecond.innerHTML = `
        <span n-option n-skus="123,223" selected>L</span>
        <span n-option n-skus="234,334">M</span>
        <span n-option n-skus="145,245,345">S</span>
    `

    nostoProduct.appendChild(nostoSkuFirst)
    nostoProduct.appendChild(nostoSkuSecond)

    nostoSkuSecond.connectedCallback()
    nostoSkuFirst.connectedCallback()
    nostoProduct.connectedCallback()
  }

  function testClickedSku(sourceElement: HTMLElement, optionIndex: number) {
    const option = sourceElement.querySelector<HTMLElement>(`[n-option]:nth-child(${optionIndex})`)
    expect(option).toBeTruthy()
    option!.click()
    expect(option!.hasAttribute("selected")).toBeTruthy()

    const otherOptions = sourceElement.querySelectorAll(`[n-option]:not(:nth-child(${optionIndex}))`)
    expect(otherOptions.length).toBeGreaterThan(0)
    const selectedOtherOptions = Array.from(otherOptions).some(option => option.hasAttribute("selected"))
    expect(selectedOtherOptions).toBeFalsy()
  }

  function testOtherSkusAfterClick(otherElement: HTMLElement) {
    const option = otherElement.querySelector("[n-option]:nth-child(1)")
    expect(option).toBeTruthy()
    expect(option!.hasAttribute("selected")).toBeTruthy()

    const otherOptions = otherElement.querySelectorAll("[n-option]:not(:nth-child(1))")
    expect(otherOptions.length).toBeGreaterThan(0)
    const selectedOtherSecondSkuOptions = Array.from(otherOptions).some(option => option.hasAttribute("selected"))
    expect(selectedOtherSecondSkuOptions).toBeFalsy()
  }

  it("should provide selection side effects on SKU selection", () => {
    testClickedSku(nostoSkuFirst, 2) // 223,234,245
    testOtherSkusAfterClick(nostoSkuSecond) // 123,223 & 234,334 & 145,245,345

    expect(nostoProduct.selectedSkuId).toBe("223") // first matching SkuId is selected by default
  })

  it("should provide selection side effects on reverse SKU selection", () => {
    testClickedSku(nostoSkuSecond, 2) // 234,334
    testOtherSkusAfterClick(nostoSkuFirst) // 223,234,245

    expect(nostoProduct.selectedSkuId).toBe("234") // first matching SkuId is selected by default
  })
})
