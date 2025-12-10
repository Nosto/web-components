import { describe, it, expect } from "vitest"
import { Product } from "@/components/Product/Product"
import "@/components/SkuOptions/SkuOptions"
import { h } from "@/utils/jsx-runtime"

describe("sku options integration", () => {
  const element = (selector: string) => document.querySelector<HTMLElement>(selector)!

  it("should prune selections", () => {
    const nostoProduct = new Product()
    nostoProduct.setAttribute("product-id", "123")
    nostoProduct.setAttribute("reco-id", "789")

    nostoProduct.append(
      <nosto-sku-options name="colors">
        <span black n-option n-skus="123,145"></span>
        <span white n-option n-skus="223,234,245"></span>
        <span blue n-option n-skus="334,345"></span>
      </nosto-sku-options>,
      <nosto-sku-options name="sizes">
        <span l n-option n-skus="123,223"></span>
        <span m n-option n-skus="234,334"></span>
        <span s n-option n-skus="145,245,345"></span>
      </nosto-sku-options>
    )
    document.body.replaceChildren(nostoProduct)

    // click on option should select it
    element("[black]").click()
    expect(element("[black]").hasAttribute("selected")).toBeTruthy()

    // validate size availability
    expect(element("[l]").hasAttribute("disabled")).toBeFalsy()
    expect(element("[m]").hasAttribute("disabled")).toBeTruthy()
    expect(element("[s]").hasAttribute("disabled")).toBeFalsy()

    // no sku should be selected on Product level yet, since only one dimension has been chosen
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

    // click on s option should change selected SKU on Product level
    element("[m]").click()
    expect(nostoProduct.selectedSkuId).toBe("234")
  })

  it("should consider preselection (1 option)", () => {
    const nostoProduct = new Product()
    nostoProduct.setAttribute("product-id", "123")
    nostoProduct.setAttribute("reco-id", "789")

    nostoProduct.append(
      <nosto-sku-options name="colors">
        <span black n-option n-skus="123,145" selected></span>
        <span white n-option n-skus="223,234,245"></span>
        <span blue n-option n-skus="334,345"></span>
      </nosto-sku-options>,
      <nosto-sku-options name="sizes">
        <span l n-option n-skus="123,223"></span>
        <span m n-option n-skus="234,334"></span>
        <span s n-option n-skus="145,245,345"></span>
      </nosto-sku-options>
    )
    document.body.replaceChildren(nostoProduct)

    // m size should be disabled
    expect(element("[l]").hasAttribute("disabled")).toBeFalsy()
    expect(element("[m]").hasAttribute("disabled")).toBeTruthy()
    expect(element("[s]").hasAttribute("disabled")).toBeFalsy()
    expect(nostoProduct.selectedSkuId).toBeUndefined()

    element("[s]").click()

    expect(nostoProduct.selectedSkuId).toBe("145")
  })

  it("should consider preselection (2 options)", () => {
    const nostoProduct = new Product()
    nostoProduct.setAttribute("product-id", "123")
    nostoProduct.setAttribute("reco-id", "789")

    nostoProduct.append(
      <nosto-sku-options name="colors">
        <span black n-option n-skus="123,145" selected></span>
        <span white n-option n-skus="223,234,245"></span>
        <span blue n-option n-skus="334,345"></span>
      </nosto-sku-options>,
      <nosto-sku-options name="sizes">
        <span l n-option n-skus="123,223"></span>
        <span m n-option n-skus="234,334"></span>
        <span s n-option n-skus="145,245,345" selected></span>
      </nosto-sku-options>
    )
    document.body.replaceChildren(nostoProduct)

    // m size should be disabled
    expect(element("[l]").hasAttribute("disabled")).toBeFalsy()
    expect(element("[m]").hasAttribute("disabled")).toBeTruthy()
    expect(element("[s]").hasAttribute("disabled")).toBeFalsy()

    expect(nostoProduct.selectedSkuId).toBe("145")
  })
})
