/**
 * JSX runtime using jsx-dom as the underlying implementation
 * This file re-exports jsx-dom's h function and provides type declarations for custom elements
 */
import { h as jsxDomH } from "jsx-dom"
import type { Bundle } from "@/components/Bundle/Bundle"
import type { Campaign } from "@/components/Campaign/Campaign"
import type { Control } from "@/components/Control/Control"
import type { DynamicCard } from "@/components/DynamicCard/DynamicCard"
import type { Image } from "@/components/Image/Image"
import type { Product } from "@/components/Product/Product"
import type { SectionCampaign } from "@/components/SectionCampaign/SectionCampaign"
import type { SimpleCard } from "@/components/SimpleCard/SimpleCard"
import type { SkuOptions } from "@/components/SkuOptions/SkuOptions"
import type { VariantSelector } from "@/components/VariantSelector/VariantSelector"

/**
 * Base type for element attributes with flexible JSX typing.
 * Provides special handling for style, className, and an index signature for flexibility.
 */
type BaseAttributes = {
  style?: string | Record<string, string>
  className?: string
  [key: string]: unknown
}

/**
 * Extracts properties from custom elements with strict typing.
 * Filters out methods and HTMLElement base properties.
 */
type CustomElementProps<T extends HTMLElement> = Partial<{
  [K in keyof T as T[K] extends (...args: never[]) => unknown ? never : K extends keyof HTMLElement ? never : K]: T[K]
}> &
  BaseAttributes

/**
 * Extracts attributes from native HTML elements with flexible typing.
 * Allows string coercion for numeric and other properties (e.g., width="300").
 */
type NativeElementProps<T extends HTMLElement> = Partial<{
  [K in keyof T as K extends "style" ? never : K]: T[K] | string
}> &
  BaseAttributes

/**
 * Maps all native HTML element tag names to their corresponding attribute types.
 * This provides proper type safety for standard HTML elements in JSX while maintaining flexibility.
 */
type HTMLElementAttributes = {
  [K in keyof HTMLElementTagNameMap]: NativeElementProps<HTMLElementTagNameMap[K]>
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    type Element = HTMLElement
    interface IntrinsicElements extends HTMLElementAttributes {
      "nosto-bundle": CustomElementProps<Bundle>
      "nosto-campaign": CustomElementProps<Campaign>
      "nosto-control": CustomElementProps<Control>
      "nosto-dynamic-card": CustomElementProps<DynamicCard>
      "nosto-image": CustomElementProps<Image>
      "nosto-product": CustomElementProps<Product>
      "nosto-section-campaign": CustomElementProps<SectionCampaign>
      "nosto-simple-card": CustomElementProps<SimpleCard>
      "nosto-sku-options": CustomElementProps<SkuOptions>
      "nosto-variant-selector": CustomElementProps<VariantSelector>
      "test-element": Record<string, unknown>
    }
  }
}

/**
 * JSX pragma function that uses jsx-dom as the underlying implementation
 * Provides proper return type of HTMLElement for type safety
 */
export function h(
  type: string | ((props: unknown) => HTMLElement),
  props: Record<string, unknown>,
  ...children: unknown[]
): HTMLElement {
  // Use jsx-dom for the actual implementation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return jsxDomH(type as any, props, ...(children as any)) as HTMLElement
}
