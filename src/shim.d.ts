interface Window {
  Nosto?: {
    addSkuToCart?: (product: { productId: string; skuId: string }, element: string, quantity: number) => void
  }
}
