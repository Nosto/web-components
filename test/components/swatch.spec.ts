import { describe, it, expect } from "vitest"
import { NostoProduct } from "@/components/NostoProduct"
import "@/components/NostoSkuOptions"

describe("swatch integration", () => {
  it("should prune selections", () => {
    const nostoProduct = new NostoProduct()
    nostoProduct.setAttribute("product-id", "123")
    nostoProduct.setAttribute("reco-id", "789")

    nostoProduct.innerHTML = `
      <nosto-sku-options colors>
        <span black n-option n-skus="123,145">Black</span>
        <span white n-option n-skus="223,234,245">White</span>
        <span blue n-option n-skus="334,345">Blue</span>
      </nosto-sku-options>
      <nosto-sku-options sizes>
        <span l n-option n-skus="123,223">L</span>
        <span m n-option n-skus="234,334">M</span>
        <span s n-option n-skus="145,245,345">S</span>
      </nosto-sku-options>
        `
    document.body.appendChild(nostoProduct)

    const element = (selector: string) => document.querySelector<HTMLElement>(selector)!

    // click on option should select it
    element("[black]").click()
    expect(element("[black]").hasAttribute("selected")).toBeTruthy()

    // no sku should be selected on NostoProduct level yet, since only one dimension has been chosen
    expect(nostoProduct.selectedSkuId).toBeUndefined()

    // click on other option should select it and deselect the first one
    element("[white]").click()
    expect(element("[white]").hasAttribute("selected")).toBeTruthy()
    expect(element("[black]").hasAttribute("selected")).toBeFalsy()

    // click on option in another group shouldn't have an effect on the first group
    element("[l]").click()
    expect(element("[l]").hasAttribute("selected")).toBeTruthy()
    expect(element("[white]").hasAttribute("selected")).toBeTruthy()

    // selected SKU should be 223
    expect(nostoProduct.selectedSkuId).toBe("223")

    // click on s option should change selected SKU on NostoProduct level
    element("[m]").click()
    expect(nostoProduct.selectedSkuId).toBe("234")
  })
})
