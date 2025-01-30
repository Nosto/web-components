import { describe, it, beforeEach, vi } from "vitest"
import { NostoProduct } from "@/components/NostoProduct"

describe.skip("Product SKU selection", () => {
  let productComponent: NostoProduct

  beforeEach(() => {
    productComponent = new NostoProduct()
    document.body.innerHTML = ""
  })

  it("should provide selection side effects on swatch structure", () => {
    productComponent.setAttribute("product-id", "123")
    productComponent.setAttribute("reco-id", "789")

    const mockAddSkuToCart = vi.fn()
    window.Nosto = { addSkuToCart: mockAddSkuToCart }

    productComponent.innerHTML = `      
        <other-elements>...</other-elements>
        <nosto-sku depth="2">
            <div n-sku-items="color" n-next-layer-option="size" class="sku-color">
                <span n-sku-item n-sku-item-id="13">Red</span>
                <span n-sku-item n-sku-item-id="21" selected>Blue</span>
            </div>
            <div n-sku-items="red-size" n-option-type="size" class="sku-size" style="display: none;">
                <span n-sku-item-id="13" n-sku-item>S</span>
                <span n-sku-item-id="12" n-sku-item>M</span>
                <span n-sku-item-id="11" n-sku-item>L</span>
                <span n-sku-item-id="14" n-sku-item>XL</span>
            </div>
            <div n-sku-items="blue-size" n-option-type="size" class="sku-size">
                <span n-sku-item n-sku-item-id="21" selected>M</span>
                <span n-sku-item n-sku-item-id="22">L</span>
            </div>
        </nosto-sku>
        <span n-atc>Add to cart</span>
        <other-elements></other-elements>
      `
    productComponent.connectedCallback()

    // TODO handle NostoProduct and NostoSku integration
  })
})
