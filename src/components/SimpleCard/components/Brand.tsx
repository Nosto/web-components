/** @jsx createElement */
import type { ShopifyProduct } from "../types"
import { createElement } from "@/utils/jsx"

interface BrandProps {
  product: ShopifyProduct
}

export function Brand({ product }: BrandProps): HTMLElement {
  return <div className="caption-with-letter-spacing light">{product.vendor}</div>
}
