import { describe, it, expect } from "vitest"
import { Product } from "@/components/Product/Product"
import "@/components/SkuOptions/SkuOptions"
import { elements } from "../../utils/element"

describe("sku options integration", () => {
  const getElement = (selector: string) => document.querySelector<HTMLElement>(selector)!

  it("should prune selections", () => {
    const nostoProduct = new Product()
    nostoProduct.setAttribute("product-id", "123")
    nostoProduct.setAttribute("reco-id", "789")

    nostoProduct.append(
      ...elements`<nosto-sku-options name="colors">
          <span black="" n-option="" n-skus="123,145"></span>
          <span white="" n-option="" n-skus="223,234,245"></span>
          <span blue="" n-option="" n-skus="334,345"></span>
        </nosto-sku-options><nosto-sku-options name="sizes">
          <span l="" n-option="" n-skus="123,223"></span>
          <span m="" n-option="" n-skus="234,334"></span>
          <span s="" n-option="" n-skus="145,245,345"></span>
        </nosto-sku-options>`
    )
    document.body.replaceChildren(nostoProduct)

    // click on option should select it
    getElement("[black]").click()
    expect(getElement("[black]").hasAttribute("selected")).toBeTruthy()

    // validate size availability
    expect(getElement("[l]").hasAttribute("disabled")).toBeFalsy()
    expect(getElement("[m]").hasAttribute("disabled")).toBeTruthy()
    expect(getElement("[s]").hasAttribute("disabled")).toBeFalsy()

    // no sku should be selected on Product level yet, since only one dimension has been chosen
    expect(nostoProduct.selectedSkuId).toBeUndefined()

    // click on other option should select it and deselect the first one
    getElement("[white]").click()
    expect(getElement("[white]").hasAttribute("selected")).toBeTruthy()
    expect(getElement("[black]").hasAttribute("selected")).toBeFalsy()

    // validate size availability
    expect(getElement("[l]").hasAttribute("disabled")).toBeFalsy()
    expect(getElement("[m]").hasAttribute("disabled")).toBeFalsy()
    expect(getElement("[s]").hasAttribute("disabled")).toBeFalsy()

    // click on option in another group shouldn't have an effect on the first group
    getElement("[l]").click()
    expect(getElement("[l]").hasAttribute("selected")).toBeTruthy()
    expect(getElement("[white]").hasAttribute("selected")).toBeTruthy()

    // validate color availability
    expect(getElement("[black]").hasAttribute("disabled")).toBeFalsy()
    expect(getElement("[white]").hasAttribute("disabled")).toBeFalsy()
    expect(getElement("[blue]").hasAttribute("disabled")).toBeTruthy()

    // validate size availability
    expect(getElement("[l]").hasAttribute("disabled")).toBeFalsy()
    expect(getElement("[m]").hasAttribute("disabled")).toBeFalsy()
    expect(getElement("[s]").hasAttribute("disabled")).toBeFalsy()

    // selected SKU should be 223
    expect(nostoProduct.selectedSkuId).toBe("223")

    // click on s option should change selected SKU on Product level
    getElement("[m]").click()
    expect(nostoProduct.selectedSkuId).toBe("234")
  })

  it("should consider preselection (1 option)", () => {
    const nostoProduct = new Product()
    nostoProduct.setAttribute("product-id", "123")
    nostoProduct.setAttribute("reco-id", "789")

    nostoProduct.append(
      ...elements`<nosto-sku-options name="colors">
          <span black="" n-option="" n-skus="123,145" selected=""></span>
          <span white="" n-option="" n-skus="223,234,245"></span>
          <span blue="" n-option="" n-skus="334,345"></span>
        </nosto-sku-options><nosto-sku-options name="sizes">
          <span l="" n-option="" n-skus="123,223"></span>
          <span m="" n-option="" n-skus="234,334"></span>
          <span s="" n-option="" n-skus="145,245,345"></span>
        </nosto-sku-options>`
    )
    document.body.replaceChildren(nostoProduct)

    // m size should be disabled
    expect(getElement("[l]").hasAttribute("disabled")).toBeFalsy()
    expect(getElement("[m]").hasAttribute("disabled")).toBeTruthy()
    expect(getElement("[s]").hasAttribute("disabled")).toBeFalsy()
    expect(nostoProduct.selectedSkuId).toBeUndefined()

    getElement("[s]").click()

    expect(nostoProduct.selectedSkuId).toBe("145")
  })

  it("should consider preselection (2 options)", () => {
    const nostoProduct = new Product()
    nostoProduct.setAttribute("product-id", "123")
    nostoProduct.setAttribute("reco-id", "789")

    nostoProduct.append(
      ...elements`<nosto-sku-options name="colors">
          <span black="" n-option="" n-skus="123,145" selected=""></span>
          <span white="" n-option="" n-skus="223,234,245"></span>
          <span blue="" n-option="" n-skus="334,345"></span>
        </nosto-sku-options><nosto-sku-options name="sizes">
          <span l="" n-option="" n-skus="123,223"></span>
          <span m="" n-option="" n-skus="234,334"></span>
          <span s="" n-option="" n-skus="145,245,345" selected=""></span>
        </nosto-sku-options>`
    )
    document.body.replaceChildren(nostoProduct)

    // m size should be disabled
    expect(getElement("[l]").hasAttribute("disabled")).toBeFalsy()
    expect(getElement("[m]").hasAttribute("disabled")).toBeTruthy()
    expect(getElement("[s]").hasAttribute("disabled")).toBeFalsy()

    expect(nostoProduct.selectedSkuId).toBe("145")
  })
})
