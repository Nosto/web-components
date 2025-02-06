import { describe, it, expect, beforeEach } from "vitest"
import { NostoProduct } from "@/components/NostoProduct"
import "@/components/NostoSkuOptions"

describe("sku options integration", () => {
  const element = (selector: string) => document.querySelector<HTMLElement>(selector)!

  beforeEach(() => {
    document.body.innerHTML = ""
  })

  it("should prune selections", () => {
    const nostoProduct = new NostoProduct()
    nostoProduct.setAttribute("product-id", "123")
    nostoProduct.setAttribute("reco-id", "789")

    nostoProduct.innerHTML = `
      <nosto-sku-options name="colors">
        <span black n-option n-skus="123,145">Black</span>
        <span white n-option n-skus="223,234,245 disabled">White</span>
        <span blue n-option n-skus="334,345">Blue</span>
      </nosto-sku-options>
      <nosto-sku-options name="sizes">
        <span l n-option n-skus="123,223">L</span>
        <span m n-option n-skus="234,334">M</span>
        <span s n-option n-skus="145,245,345">S</span>
      </nosto-sku-options>
        `
    document.body.appendChild(nostoProduct)

    // click on option should select it
    element("[black]").click()
    expect(element("[black]").hasAttribute("selected")).toBeTruthy()

    expect(element("[white]").hasAttribute("disabled")).toBeTruthy()

    // validate size availability
    expect(element("[l]").hasAttribute("disabled")).toBeFalsy()
    expect(element("[m]").hasAttribute("disabled")).toBeTruthy()
    expect(element("[s]").hasAttribute("disabled")).toBeFalsy()

    // no sku should be selected on NostoProduct level yet, since only one dimension has been chosen
    expect(nostoProduct.selectedSkuId).toBeUndefined()

    // click on other option should select it and deselect the first one
    element("[white]").click()
    expect(element("[white]").hasAttribute("selected")).toBeTruthy()
    expect(element("[black]").hasAttribute("selected")).toBeFalsy()

    // validate size availability
    expect(element("[l]").hasAttribute("disabled")).toBeFalsy()
    expect(element("[m]").hasAttribute("disabled")).toBeFalsy()
    expect(element("[s]").hasAttribute("disabled")).toBeFalsy()

    // click on option in another group shouldn't have an effect on the first group
    element("[l]").click()
    expect(element("[l]").hasAttribute("selected")).toBeTruthy()
    expect(element("[white]").hasAttribute("selected")).toBeTruthy()

    // validate color availability
    expect(element("[black]").hasAttribute("disabled")).toBeFalsy()
    expect(element("[white]").hasAttribute("disabled")).toBeFalsy()
    expect(element("[blue]").hasAttribute("disabled")).toBeTruthy()

    // validate size availability
    expect(element("[l]").hasAttribute("disabled")).toBeFalsy()
    expect(element("[m]").hasAttribute("disabled")).toBeFalsy()
    expect(element("[s]").hasAttribute("disabled")).toBeFalsy()

    // selected SKU should be 223
    expect(nostoProduct.selectedSkuId).toBe("223")

    // click on s option should change selected SKU on NostoProduct level
    element("[m]").click()
    expect(nostoProduct.selectedSkuId).toBe("234")
  })

  it("should consider preselection (1 option)", () => {
    const nostoProduct = new NostoProduct()
    nostoProduct.setAttribute("product-id", "123")
    nostoProduct.setAttribute("reco-id", "789")

    nostoProduct.innerHTML = `
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
        `
    document.body.appendChild(nostoProduct)

    // m size should be disabled
    expect(element("[l]").hasAttribute("disabled")).toBeFalsy()
    expect(element("[m]").hasAttribute("disabled")).toBeTruthy()
    expect(element("[s]").hasAttribute("disabled")).toBeFalsy()
    expect(nostoProduct.selectedSkuId).toBeUndefined()

    element("[s]").click()

    expect(nostoProduct.selectedSkuId).toBe("145")
  })

  it("should consider preselection (2 options)", () => {
    const nostoProduct = new NostoProduct()
    nostoProduct.setAttribute("product-id", "123")
    nostoProduct.setAttribute("reco-id", "789")

    nostoProduct.innerHTML = `
      <nosto-sku-options name="colors">
        <span black n-option n-skus="123,145" selected>Black</span>
        <span white n-option n-skus="223,234,245">White</span>
        <span blue n-option n-skus="334,345">Blue</span>
      </nosto-sku-options>
      <nosto-sku-options name="sizes">
        <span l n-option n-skus="123,223">L</span>
        <span m n-option n-skus="234,334">M</span>
        <span s n-option n-skus="145,245,345" selected>S</span>
      </nosto-sku-options>
        `
    document.body.appendChild(nostoProduct)

    // m should be disabled
    expect(element("[l]").hasAttribute("disabled")).toBeFalsy()
    expect(element("[m]").hasAttribute("disabled")).toBeTruthy()
    expect(element("[s]").hasAttribute("disabled")).toBeFalsy()

    expect(nostoProduct.selectedSkuId).toBe("145")
  })
})
