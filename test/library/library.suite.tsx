import { expect, it } from "vitest"
import { createElement } from "../utils/jsx"
import type { NostoProductCard } from "@/components/NostoProductCard"
import type { NostoProduct } from "@/components/NostoProduct"
import type { NostoSkuOptions } from "@/components/NostoSkuOptions"
import type { NostoShopify } from "@/components/NostoShopify"
import type { NostoSwiper } from "@/components/NostoSwiper"

export async function validateLibrary(importPath: string) {
  const exports = await import(importPath)

  it("inits NostoProductCard", async () => {
    expect(exports.NostoProductCard).toBeDefined()
    document.body.append(
      <template id="product-card-template" type="text/liquid">
        <h1>{"{{ product.name }} {{ data.title}}"}</h1>
      </template>
    )

    const card = new exports.NostoProductCard() as NostoProductCard
    card.append(
      <script type="application/json" product-data>
        {JSON.stringify({ name: "Test" })}
      </script>
    )
    card.recoId = "123456"
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

  it("inits NostoShopify", async () => {
    expect(exports.NostoShopify).toBeDefined()

    const wrapper = <div class="nosto_element" id="test-campaign"></div>
    const shopify = new exports.NostoShopify() as NostoShopify
    wrapper.append(shopify)
    await shopify.connectedCallback()
    // TODO add assertions
  })

  it("inits NostoSwiper", async () => {
    expect(exports.NostoSwiper).toBeDefined()

    const swiper = new exports.NostoSwiper() as NostoSwiper
    swiper.append(
      <div class="swiper-wrapper">
        <div className="swiper-slide">Slide 1</div>
        <div className="swiper-slide">Slide 2</div>
        <div className="swiper-slide">Slide 3</div>
      </div>
    )
    await swiper.connectedCallback()
    expect(swiper.classList).toContain("swiper-initialized")
  })
}
