import type { NostoCampaign } from "@/components/NostoCampaign/NostoCampaign"
import type { NostoControl } from "@/components/NostoControl/NostoControl"
import type { NostoDynamicCard } from "@/components/NostoDynamicCard/NostoDynamicCard"
import type { NostoImage } from "@/components/NostoImage/NostoImage"
import type { NostoProduct } from "@/components/NostoProduct/NostoProduct"
import type { NostoProductCard } from "@/components/NostoProductCard/NostoProductCard"
import type { NostoSection } from "@/components/NostoSection/NostoSection"
import type { NostoSkuOptions } from "@/components/NostoSkuOptions/NostoSkuOptions"

type MaybeArray<T> = T | T[]

// remaps entries in GlobalEventHandlersEventMap to their respective React style event handlers
type GlobalEventHandlersMapping = {
  [K in keyof GlobalEventHandlersEventMap as `on${Capitalize<K>}`]?: (event: GlobalEventHandlersEventMap[K]) => void
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    type Element = HTMLElement
    type IntrinsicElements = {
      "nosto-campaign": Partial<{
        placement: string
        productId: string
        variantId: string
        template: string
        init: string
        lazy: string
        id: string
      }> & GlobalEventHandlersMapping
      "nosto-control": Record<string, unknown> & GlobalEventHandlersMapping
      "nosto-dynamic-card": Partial<{
        handle: string
        section: string
        template: string
        variantId: string
        placeholder: string
        lazy: string
      }> & GlobalEventHandlersMapping
      "nosto-image": Partial<{
        src: string
        width: string
        height: string
        aspectRatio: string
        layout: string
        crop: string
      }> & GlobalEventHandlersMapping
      "nosto-product": Partial<{
        productId: string
        recoId: string
        skuSelected: string
      }> & GlobalEventHandlersMapping
      "nosto-product-card": Partial<{
        template: string
      }> & GlobalEventHandlersMapping
      "nosto-section": Partial<{
        placement: string
        section: string
      }> & GlobalEventHandlersMapping
      "nosto-sku-options": Partial<{
        name: string
      }> & GlobalEventHandlersMapping
      // Keep generic fallback for other HTML elements
      [key: string]: Record<string, unknown> & GlobalEventHandlersMapping
    }
  }
}

type Props = Record<string, unknown>
type Type = string | ((props: Props) => HTMLElement)
type Child = unknown
type Children = Array<Child>

// Map custom element tag names to their class types
type CustomElementTypeMap = {
  "nosto-campaign": NostoCampaign
  "nosto-control": NostoControl
  "nosto-dynamic-card": NostoDynamicCard
  "nosto-image": NostoImage
  "nosto-product": NostoProduct
  "nosto-product-card": NostoProductCard
  "nosto-section": NostoSection
  "nosto-sku-options": NostoSkuOptions
}

const aliases: Record<string, string> = {
  className: "class",
  htmlFor: "for"
}

/**
 * Create an HTML element based on the given JSX type, props and children
 */
export function createElement<T extends keyof CustomElementTypeMap>(
  type: T,
  props: Props,
  ...children: Children
): CustomElementTypeMap[T]
export function createElement(type: string, props: Props, ...children: Children): HTMLElement
export function createElement(type: Type, props: Props, ...children: Children): HTMLElement
export function createElement(type: Type, props: Props, ...children: Children): HTMLElement {
  if (typeof type === "function") {
    return children?.length ? type({ ...props, children }) : type(props)
  }

  // For custom elements, use document.createElement to get the proper class instance
  const element = document.createElement(type)
  applyProperties(element, props ?? {})
  children?.forEach(child => appendChild(element, child))
  return element
}

/**
 * Create a HTML fragment based on the given JSX children
 */
export function createFragment(arg: { children: Children } | null): DocumentFragment {
  const { children, ...props } = arg ?? { children: [] }
  const fragment = document.createDocumentFragment()
  Object.assign(fragment, props)
  children?.forEach(child => appendChild(fragment, child))
  return fragment
}

function isEventListener(key: string, value: unknown): value is EventListener {
  return key.startsWith("on") && typeof value === "function"
}

function applyProperties(element: HTMLElement, props: Props) {
  Object.entries(props).forEach(([key, value]) => {
    if (isEventListener(key, value)) {
      element.addEventListener(key.slice(2).toLowerCase(), value)
    } else if (key === "style") {
      Object.assign(element.style, value)
    } else {
      const normKey = aliases[key] ?? key
      element.setAttribute(normKey, String(value))
    }
  })
}

function appendChild(element: ParentNode, child: MaybeArray<Child>) {
  if (Array.isArray(child)) {
    child.forEach(c => appendChild(element, c))
  } else if (child instanceof DocumentFragment) {
    Array.from(child.children).forEach(c => element.appendChild(c))
  } else if (element instanceof HTMLTemplateElement) {
    appendChild(element.content, child)
  } else if (child instanceof HTMLElement) {
    element.appendChild(child)
  } else if (child !== undefined && child !== null && child !== false) {
    element.appendChild(document.createTextNode(String(child)))
  }
}
