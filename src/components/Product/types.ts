/**
 * Props for the Product custom element
 */
export type ProductProps = {
  /** Required. The ID of the product */
  productId: string
  /** Required. The recommendation slot ID */
  recoId: string
  /** Indicates whether a SKU is currently selected */
  skuSelected?: boolean
}
