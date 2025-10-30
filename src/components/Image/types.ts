import type { CoreImageAttributes, Operations, UnpicBaseImageProps } from "@unpic/core/base"
import type { ShopifyOperations } from "unpic/providers/shopify"

export type Crop = Exclude<ShopifyOperations["crop"], undefined>

export type BaseImageProps = UnpicBaseImageProps<Operations, unknown, CoreImageAttributes<CSSStyleDeclaration>>
