// Generated using typescript-generator
export interface DiscountVM {
  amount: number
  percent: number
  rawPercentage: number
}
export interface ImageVM {
  hash?: string
  url?: string
}
export interface ProductScores {
  score1: Score
  score168: Score
  score24: Score
  score720: Score
  score_1?: Score
  score_168?: Score
  score_24?: Score
  score_720?: Score
}
export interface ProductVM {
  ageInDays: number
  alternateImageUrls: string[]
  alternateImages: ImageVM[]
  attributionKey: string
  availability: string
  brand: string
  categories: string[]
  currencyCode: string
  currencySymbol: string
  customFields: { [index: string]: string }[]
  datePublished: number
  description: string
  discount: DiscountVM
  discountAmount: number
  discountPercent: number
  discounted: boolean
  imageHash?: string
  imageUrl?: string
  inventoryLevel: number
  listPrice: number
  maxPrice: number
  minPrice: number
  mock: boolean
  mostBought: boolean
  mostViewed: boolean
  name: string
  price: number
  primaryImageHash?: string
  primaryImageUrl?: string
  productId: string
  ratingValue: number
  reviewCount: number
  scores: ProductScores
  skuCustomFields: { [index: string]: string[] }
  skus: SkuVM[]
  tags1: string[]
  tags2: string[]
  tags3: string[]
  thumbUrl: string
  /**
   * @deprecated
   */
  thumbVariantId?: string
  ugcImageHash?: string
  ugcImageSource?: string
  ugcImageUrl?: string
  ugcImages: ImageVM[]
  unitPricingBaseMeasure: number
  unitPricingMeasure: number
  unitPricingUnit: string
  url: string
  useUgcImage: boolean
  variationId: string
}
export interface Score {
  buys: number
  carts: number
  cartsRatio: number
  clicks: number
  conversion: number
  conversionPerView: number
  impressions: number
  inventoryTurnover: number
  orders: number
  profitPerClick: number
  profitPerImpression: number
  profitPerView: number
  returnRate: number
  returns: number
  revenuePerClick: number
  revenuePerImpression: number
  revenuePerView: number
  totalRevenue: number
  views: number
}
export interface SkuVM {
  available: boolean
  customFields: { [index: string]: string }[]
  discount?: DiscountVM
  discounted: boolean
  id: string
  imageUrl: string
  inventoryLevel?: number
  listPrice?: number
  name: string
  price: number
  productId: string
  url: string
}

type ProductIdentifier = {
  productId: string
  skuId: string
}

type SlotReference = string | HTMLElement

export type AddSkuToCart = (
  productIdentifier: ProductIdentifier,
  element: SlotReference,
  quantity: number
) => Promise<unknown | undefined>
