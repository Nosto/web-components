/** @jsx createElement */
import type { ShopifyProduct } from "./types"
import { createElement } from "@/utils/jsx"
import { formatPrice } from "./formatPrice"

interface PriceSectionProps {
  simpleCard: {
    discount?: boolean
  }
  product: ShopifyProduct
}

export function PriceSection({ simpleCard, product }: PriceSectionProps): HTMLElement {
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