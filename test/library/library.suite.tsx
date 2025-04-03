import { expect, it } from "vitest"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createElement } from "../utils/jsx"
import type { NostoProductCard } from "../../src/components/NostoProductCard"
import type { NostoProduct } from "../../src/components/NostoProduct"
import type { NostoSkuOptions } from "../../src/components/NostoSkuOptions"
import type { NostoShopify } from "@/components/NostoShopify"
import type { NostoSwiper } from "@/components/NostoSwiper"

export async function validateLibrary(importPath: string) {
  const exports = await import(importPath)

  it("NostoProductCard", async () => {
    expect(exports.NostoProductCard).toBeDefined()
    document.body.append(<template id="product-card-template" type="text/liquid"></template>)

    const card = new exports.NostoProductCard() as NostoProductCard
    card.recoId = "123456"
    card.template = "product-card-template"
    await card.connectedCallback()
  })

  it("NostoProduct", async () => {
    expect(exports.NostoProduct).toBeDefined()

    const product = new exports.NostoProduct() as NostoProduct
    product.productId = "123456"
    product.recoId = "654321"
    await product.connectedCallback()
  })

  it("NostoSkuOptions", async () => {
    expect(exports.NostoSkuOptions).toBeDefined()

    const skuOptions = new exports.NostoSkuOptions() as NostoSkuOptions
    skuOptions.name = "color"
    await skuOptions.connectedCallback()
  })

  it("NostoShopify", async () => {
    expect(exports.NostoShopify).toBeDefined()

    const wrapper = <div class="nosto_element" id="test-campaign"></div>
    const shopify = new exports.NostoShopify() as NostoShopify
    wrapper.append(shopify)
    await shopify.connectedCallback()
  })

  it("NostoSwiper", async () => {
    expect(exports.NostoSwiper).toBeDefined()

    const swiper = new exports.NostoSwiper() as NostoSwiper
    swiper.containerSelector = ".nosto-swiper"
    swiper.append(
      <div class="nosto-swiper">
        <div class="swiper-wrapper">
          <div className="swiper-slide">Slide 1</div>
          <div className="swiper-slide">Slide 2</div>
          <div className="swiper-slide">Slide 3</div>
        </div>
      </div>
    )
    await swiper.connectedCallback()
  })
}
