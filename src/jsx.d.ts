/**
 * JSX type augmentation for Nosto custom elements
 * Extends jsx-dom's IntrinsicElements interface
 */
import type { DetailedHTMLProps, HTMLAttributes } from "jsx-dom"
import type { VariantSelector } from "@/components/VariantSelector/VariantSelector"
import type { Bundle } from "@/components/Bundle/Bundle"
import type { Campaign } from "@/components/Campaign/Campaign"
import type { Control } from "@/components/Control/Control"
import type { DynamicCard } from "@/components/DynamicCard/DynamicCard"
import type { Image } from "@/components/Image/Image"
import type { Product } from "@/components/Product/Product"
import type { SectionCampaign } from "@/components/SectionCampaign/SectionCampaign"
import type { SimpleCard } from "@/components/SimpleCard/SimpleCard"
import type { SkuOptions } from "@/components/SkuOptions/SkuOptions"

declare module "jsx-dom" {
  export namespace JSX {
    interface IntrinsicElements {
      "nosto-bundle": DetailedHTMLProps<HTMLAttributes<Bundle>, Bundle>
      "nosto-campaign": DetailedHTMLProps<HTMLAttributes<Campaign>, Campaign>
      "nosto-control": DetailedHTMLProps<HTMLAttributes<Control>, Control>
      "nosto-dynamic-card": DetailedHTMLProps<HTMLAttributes<DynamicCard>, DynamicCard>
      "nosto-image": DetailedHTMLProps<HTMLAttributes<Image>, Image>
      "nosto-product": DetailedHTMLProps<HTMLAttributes<Product>, Product>
      "nosto-section-campaign": DetailedHTMLProps<HTMLAttributes<SectionCampaign>, SectionCampaign>
      "nosto-simple-card": DetailedHTMLProps<HTMLAttributes<SimpleCard>, SimpleCard>
      "nosto-sku-options": DetailedHTMLProps<HTMLAttributes<SkuOptions>, SkuOptions>
      "nosto-variant-selector": DetailedHTMLProps<HTMLAttributes<VariantSelector>, VariantSelector>
      "test-element": Record<string, unknown>
    }
  }
}
