import { describe, it, beforeEach, vi } from "vitest"
import { NostoProduct } from "../../src/components/NostoProduct"

describe("swatch side effects", () => {
  let element: NostoProduct

  beforeEach(() => {
    element = new NostoProduct()
    document.body.innerHTML = ""
  })

  it("should provide selection side effects on swatch structure", () => {
    element.setAttribute("product-id", "123")
    element.setAttribute("reco-id", "789")

    const mockAddSkuToCart = vi.fn()
    window.Nosto = { addSkuToCart: mockAddSkuToCart }

    element.innerHTML = `      
      <div class="colors" n-swatch>
        <!-- sku ids: 1** -->
        <span n-option n-skus="123,134,145">Black</span>
        <!-- sku ids: 2** -->
        <span n-option n-skus="223,234,245">White</span>
        <!-- sku ids: 3** -->
        <span n-option n-skus="323,334,345">Blue</span>
      </div>
      <div class="sizes" n-swatch>
        <!-- sku ids: **3 -->
        <span n-option n-skus="123,223,323">L</span>
        <!-- sku ids: **4 -->
        <span n-option n-skus="134,234,334">M</span>
        <!-- sku ids: **5 -->
        <span n-option n-skus="145,245,345">S</span>
      </div>
      <div n-atc>ATC</div>
    `
    element.connectedCallback()

    // TODO assertions

    // click on first color option should mark 123,134,145 as selected
    // atc not available, since multiple SKUs are selected

    // click on second size option should mark 134 as selected
    // atc available, since single SKU is selected

    // click on third size option should mark 145 as selected
    // atc available, since single SKU is selected
  })
})
