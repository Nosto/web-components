/** @jsx createElement */
import type { ShopifyProduct } from "./types"
import { createElement } from "@/utils/jsx"
import { formatPrice } from "./formatPrice"

export interface SimpleCardInterface {
  discount?: boolean
}

export function createPriceSection(simpleCard: SimpleCardInterface, product: ShopifyProduct): HTMLElement {
  return (
    <div className="price">
      <span className="price-item price-item--regular">
        {formatPrice(product.price)}
      </span>
      {simpleCard.discount && product.compare_at_price && product.compare_at_price > product.price && (
        <span className="price-item price-item--sale">
          {formatPrice(product.compare_at_price)}
        </span>
      )}
    </div>
  )
}