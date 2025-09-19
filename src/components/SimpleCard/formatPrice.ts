export function formatPrice(price: number): string {
  // Simple price formatting - in a real implementation, this should respect locale and currency
  return `$${(price / 100).toFixed(2)}`
}