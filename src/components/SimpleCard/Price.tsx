/** @jsx createElement */
import type { ShopifyProduct } from "./types"
import { createElement } from "@/utils/jsx"
import { formatPrice } from "./formatPrice"

interface PriceProps {
  discount?: boolean
  product: ShopifyProduct
}

export function Price({ discount, product }: PriceProps): HTMLElement {
  return (
    <div className="price">
      <span className="price-item price-item--regular">{formatPrice(product.price)}</span>
      {discount && product.compare_at_price && product.compare_at_price > product.price && (
        <span className="price-item price-item--sale">{formatPrice(product.compare_at_price)}</span>
      )}
    </div>
  )
}
