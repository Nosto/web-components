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

type MaybeArray<T> = T | T[]

/**
 * Extracts all non-method properties from a custom element type `T`, excluding any properties inherited from the base `HTMLElement`.
 * This utility type is useful for defining prop types for custom elements without including standard HTMLElement properties or methods.
 */
type ElementProps<T extends HTMLElement> = {
  [K in keyof T as T[K] extends (...args: never[]) => unknown ? never : K extends keyof HTMLElement ? never : K]?: T[K]
}

/**
 * Extracts HTML attributes from an element type, allowing flexible attribute values for JSX.
 * This supports both strict typing and common JSX patterns (e.g., string styles, numeric string attributes).
 */
type HTMLAttributes<T extends HTMLElement> = Partial<{
  [K in keyof T as K extends "style" ? never : K]: T[K] | string
}> & {
  style?: string | Record<string, string>
  className?: string
  [key: string]: unknown
}

/**
 * Maps all native HTML element tag names to their corresponding attribute types.
 * This provides proper type safety for standard HTML elements in JSX while maintaining flexibility.
 */
type HTMLElementAttributes = {
  [K in keyof HTMLElementTagNameMap]: HTMLAttributes<HTMLElementTagNameMap[K]>
}

type DummyProps = Record<string, unknown>

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    type Element = HTMLElement
    interface IntrinsicElements extends HTMLElementAttributes {
      "nosto-bundle": ElementProps<Bundle>
      "nosto-campaign": ElementProps<Campaign>
      "nosto-control": ElementProps<Control>
      "nosto-dynamic-card": ElementProps<DynamicCard>
      "nosto-image": ElementProps<Image>
      "nosto-product": ElementProps<Product>
      "nosto-section-campaign": ElementProps<SectionCampaign>
      "nosto-simple-card": ElementProps<SimpleCard>
      "nosto-sku-options": ElementProps<SkuOptions>
      "nosto-variant-selector": ElementProps<VariantSelector>
      "test-element": DummyProps
    }
  }
}

type Props = Record<string, unknown>
type Type = string | ((props: Props) => HTMLElement)
type Child = unknown
type Children = Array<Child>

const aliases: Record<string, string> = {
  className: "class",
  htmlFor: "for"
}

/**
 * Create an HTML element based on the given JSX type, props and children
 */
export function createElement(type: Type, props: Props, ...children: Children): HTMLElement {
  if (typeof type === "function") {
    return children?.length ? type({ ...props, children }) : type(props)
  }

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

function toKebabCase(str: string) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
}

function shouldSetAsProperty(element: HTMLElement, key: string, value: unknown): boolean {
  // Objects/arrays should always be properties (can't be serialized to attributes)
  if (typeof value === "object" && value !== null) return true

  // For aliased keys, use attribute; otherwise check if property exists
  return !aliases[key] && key in element
}

function applyProperties(element: HTMLElement, props: Props) {
  Object.entries(props).forEach(([key, value]) => {
    if (isEventListener(key, value)) {
      element.addEventListener(key.slice(2).toLowerCase(), value)
    } else if (key === "style") {
      if (typeof value === "string") {
        element.setAttribute("style", value)
      } else {
        Object.assign(element.style, value)
      }
    } else if (shouldSetAsProperty(element, key, value)) {
      const propName = aliases[key] ?? key
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(element as any)[propName] = value
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

/**
 * Create a template element with raw HTML content
 * This is useful for Vue-like template syntax that needs to be processed at runtime
 */
export function Template(props: { children?: Children }): HTMLTemplateElement {
  const template = document.createElement("template")
  const children = props.children ?? []
  const childArray = Array.isArray(children) ? children : [children]
  const htmlContent = childArray.map(child => String(child)).join("")
  template.innerHTML = htmlContent
  return template
}
