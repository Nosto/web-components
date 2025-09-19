import type { ShopifyProduct } from "./types"
import { element } from "./element"
import { formatPrice } from "./formatPrice"

export interface SimpleCardInterface {
  discount?: boolean
}

export function createPriceSection(simpleCard: SimpleCardInterface, product: ShopifyProduct): HTMLElement {
  const priceDiv = element("div", { className: "price" })

  const currentPrice = element("span", { 
    className: "price-item price-item--regular" 
  }, formatPrice(product.price))
  priceDiv.appendChild(currentPrice)

  // Compare at price (original price when on sale)
  if (simpleCard.discount && product.compare_at_price && product.compare_at_price > product.price) {
    const comparePrice = element("span", { 
      className: "price-item price-item--sale" 
    }, formatPrice(product.compare_at_price))
    priceDiv.appendChild(comparePrice)
  }

  return priceDiv
}