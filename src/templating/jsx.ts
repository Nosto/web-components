import type { Campaign } from "@/components/Campaign/Campaign"
import type { Control } from "@/components/Control/Control"
import type { DynamicCard } from "@/components/DynamicCard/DynamicCard"
import type { Image } from "@/components/Image/Image"
import type { Popup } from "@/components/Popup/Popup"
import type { Product } from "@/components/Product/Product"
import type { SectionCampaign } from "@/components/SectionCampaign/SectionCampaign"
import type { SimpleCard } from "@/components/SimpleCard/SimpleCard"
import type { SkuOptions } from "@/components/SkuOptions/SkuOptions"

// =============================================================================
// JSX Factory for DOM Element Generation (used in src and test files)
// =============================================================================

type MaybeArray<T> = T | T[]
type ElementProps = Record<string, unknown>
type ElementType = string | ((props: ElementProps) => HTMLElement)
type Child = unknown
type Children = Array<Child>

// remaps entries in GlobalEventHandlersEventMap to their respective React style event handlers
type GlobalEventHandlersMapping = {
  [K in keyof GlobalEventHandlersEventMap as `on${Capitalize<K>}`]?: (event: GlobalEventHandlersEventMap[K]) => void
}

type ElementMapping<T extends HTMLElement> = Partial<T> & GlobalEventHandlersMapping

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    type Element = HTMLElement
    type IntrinsicElements = {
      "nosto-campaign": ElementMapping<Campaign>
      "nosto-control": ElementMapping<Control>
      "nosto-dynamic-card": ElementMapping<DynamicCard>
      "nosto-image": ElementMapping<Image>
      "nosto-popup": ElementMapping<Popup>
      "nosto-product": ElementMapping<Product>
      "nosto-section-campaign": ElementMapping<SectionCampaign>
      "nosto-simple-card": ElementMapping<SimpleCard>
      "nosto-sku-options": ElementMapping<SkuOptions>
      // Keep generic fallback for other HTML elements
      [key: string]: Record<string, unknown> & GlobalEventHandlersMapping
    }
  }
}

const aliases: Record<string, string> = {
  className: "class",
  htmlFor: "for"
}

/**
 * JSX factory function that creates DOM elements
 * This is called by the TypeScript compiler for JSX elements
 * Used in both src and test files
 */
export function createElement(type: ElementType, props: ElementProps | null, ...children: Children): HTMLElement {
  if (typeof type === "function") {
    const combinedProps = props ? { ...props, children } : { children }
    return children?.length ? type(combinedProps) : type(props || {})
  }

  const element = document.createElement(type)
  applyProperties(element, props ?? {})
  children?.forEach(child => appendChild(element, child))
  return element
}

// Export aliases for JSX transform compatibility
export { createElement as jsx, createElement as jsxs, createElement as jsxDEV }

/**
 * Fragment component for JSX fragments (<>...</>)
 * Creates a document fragment containing the children
 */
export function Fragment(arg: { children?: Children } | null, ...children: Children): DocumentFragment {
  const fragment = document.createDocumentFragment()
  const allChildren = arg?.children || children
  if (Array.isArray(allChildren)) {
    allChildren.forEach(child => appendChild(fragment, child))
  }
  return fragment
}

function isEventListener(key: string, value: unknown): value is EventListener {
  return key.startsWith("on") && typeof value === "function"
}

function toKebabCase(str: string) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
}

function applyProperties(element: HTMLElement, props: ElementProps) {
  Object.entries(props).forEach(([key, value]) => {
    if (isEventListener(key, value)) {
      element.addEventListener(key.slice(2).toLowerCase(), value)
    } else if (key === "style") {
      Object.assign(element.style, value)
    } else {
      const normKey = aliases[key] ?? toKebabCase(key)
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
