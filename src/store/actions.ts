type AddSkuToCart = {
  productId: string
  skuId?: string
  recoId: string
}

export function addSkuToCart({ productId, skuId, recoId }: AddSkuToCart) {
  if (!skuId) {
    return
  }
  if (window.Nosto && typeof window.Nosto.addSkuToCart === "function") {
    window.Nosto.addSkuToCart({ productId, skuId }, recoId, 1)
  } else {
    console.warn("Nosto.addSkuToCart is not available")
  }
  // TODO should we also emit an additional event to trigger visual side effects, e.g cart drawer opening?
}
