import { VariantChangeDetail } from "@/shopify/graphql/types"

export const EVENT_NAME_VARIANT_CHANGE = "@nosto/variantchange"

export type VariantChangeEvent = CustomEvent<VariantChangeDetail>
