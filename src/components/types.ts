export type SkuEventProps = {
  optionValue: string
  skuId: string
}

export type SkuEventDetailProps = {
  skuId?: string
  skuProps: Record<number, SkuEventProps[]>
  skuCount: number
  selectionIndex: number
}
