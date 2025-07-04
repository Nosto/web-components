import { expect, it } from "vitest"
import { createElement } from "../utils/jsx"
import type { NostoProductCard } from "@/components/NostoProductCard"
import type { NostoProduct } from "@/components/NostoProduct"
import type { NostoSkuOptions } from "@/components/NostoSkuOptions"

export async function validateLibrary(importPath: string) {
  const exports = await import(importPath)

  it("inits NostoProductCard", async () => {
    expect(exports.NostoProductCard).toBeDefined()
    document.body.append(
      <script id="product-card-template" type="text/x-liquid-template">
        <h1>{"{{ product.name }} {{ data.title}}"}</h1>
      </script>
    )

    const card = new exports.NostoProductCard() as NostoProductCard
    card.append(
      <script type="application/json" product-data>
        {JSON.stringify({ name: "Test" })}
      </script>
    )
    card.template = "product-card-template"
    card.dataset.title = "Product"
    await card.connectedCallback()
    expect(card.children[1].outerHTML).toBe("<h1>Test Product</h1>")
  })

  it("inits NostoProduct", async () => {
    expect(exports.NostoProduct).toBeDefined()

    const product = new exports.NostoProduct() as NostoProduct
    product.productId = "123456"
    product.recoId = "654321"
    await product.connectedCallback()
    // TODO add assertions
  })

  it("inits NostoSkuOptions", async () => {
    expect(exports.NostoSkuOptions).toBeDefined()

    const skuOptions = new exports.NostoSkuOptions() as NostoSkuOptions
    skuOptions.name = "color"
    await skuOptions.connectedCallback()
    // TODO add assertions
  })
}
