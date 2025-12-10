/**
 * JSX type augmentation for Nosto custom elements
 * Extends jsx-dom's IntrinsicElements interface
 */
import "jsx-dom"
import type { DetailedHTMLProps, HTMLAttributes } from "jsx-dom"

declare module "jsx-dom" {
  export namespace JSX {
    interface IntrinsicElements {
      "nosto-bundle": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
      "nosto-campaign": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
      "nosto-control": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
      "nosto-dynamic-card": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
      "nosto-image": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
      "nosto-product": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
      "nosto-section-campaign": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
      "nosto-simple-card": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
      "nosto-sku-options": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
      "nosto-variant-selector": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
      "test-element": Record<string, unknown>
    }
  }
}
