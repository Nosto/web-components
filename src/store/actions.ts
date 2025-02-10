export function migrateToShopifyMarket(campaignId: string) {
  if (window.Nosto?.migrateToShopifyMarket) {
    window.Nosto.migrateToShopifyMarket({
      productSectionElement: `#${campaignId} nosto-product`,
      productUrlElement: `[n-url]`,
      productTitleElement: `[n-title]`,
      productHandleAttribute: "[n-handle]",
      priceElement: `[n-price]`,
      listPriceElement: `[n-list-price]`,
      defaultVariantIdAttribute: "[n-variant-id]",
      descriptionElement: `[n-description]`
      // TODO totalVariantOptions
      // TODO variantSelector
    })
  }
}
