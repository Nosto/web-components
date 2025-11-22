import { escapeHtml } from "@/utils/escapeHtml"
import type { Campaign } from "@/components/Campaign/Campaign"
import type { Control } from "@/components/Control/Control"
import type { DynamicCard } from "@/components/DynamicCard/DynamicCard"
import type { Image } from "@/components/Image/Image"
import type { Popup } from "@/components/Popup/Popup"
import type { Product } from "@/components/Product/Product"
import type { SectionCampaign } from "@/components/SectionCampaign/SectionCampaign"
import type { SimpleCard } from "@/components/SimpleCard/SimpleCard"
import type { SkuOptions } from "@/components/SkuOptions/SkuOptions"

/**
 * TemplateExpression interface for HTML string results
 */
export interface TemplateExpression {
  html: string
}

/**
 * Valid types that can be rendered in JSX
 */
type JSXChild = string | number | boolean | undefined | null | TemplateExpression | JSXChild[]

type Props = Record<string, unknown> & { children?: JSXChild }

/**
 * Function component type for HTML string generation
 */
type FunctionComponent = (props: Props | null) => TemplateExpression

// =============================================================================
// JSX Runtime for HTML String Generation (used in component files)
// =============================================================================

/**
 * Processes a JSX child value into an HTML string
 */
function processChild(child: JSXChild): string {
  if (Array.isArray(child)) {
    return child.map(processChild).join("")
  }

  if (child && typeof child === "object" && "html" in child) {
    return (child as TemplateExpression).html
  }

  if (child === undefined || child === null || child === false) {
    return ""
  }

  if (child === true) {
    return "true"
  }

  return escapeHtml(String(child))
}

/**
 * Processes JSX props into HTML attribute strings
 */
function processProps(props: Props | null): string {
  if (!props) return ""

  return Object.entries(props)
    .filter(([key]) => key !== "children")
    .map(([key, value]) => {
      // Handle boolean attributes
      if (typeof value === "boolean") {
        return value ? key : ""
      }

      // Skip null/undefined attributes
      if (value === null || value === undefined) {
        return ""
      }

      // Handle style object
      if (key === "style" && typeof value === "object") {
        const styleString = Object.entries(value as Record<string, string>)
          .map(([k, v]) => `${escapeHtml(k)}: ${escapeHtml(v)}`)
          .join("; ")
        return `style="${styleString}"`
      }

      // Regular attributes
      return `${key}="${escapeHtml(String(value))}"`
    })
    .filter(Boolean)
    .join(" ")
}

/**
 * Self-closing HTML tags
 */
const SELF_CLOSING_TAGS = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]

/**
 * JSX factory function that creates HTML strings
 * This is called by the TypeScript compiler for JSX elements
 * When using jsx: "react", children are passed as rest parameters
 */
export function createElement(
  tag: string | FunctionComponent,
  props: Props | null,
  ...children: JSXChild[]
): TemplateExpression {
  // Handle function components
  if (typeof tag === "function") {
    return (tag as FunctionComponent)(children?.length ? { ...props, children } : props)
  }

  const attributes = processProps(props)
  const attributeString = attributes ? ` ${attributes}` : ""

  // Self-closing tags
  if (SELF_CLOSING_TAGS.includes(tag)) {
    return { html: `<${tag}${attributeString} />` }
  }

  // Regular tags with children
  const childrenString = children?.length ? children.map(processChild).join("") : ""
  return { html: `<${tag}${attributeString}>${childrenString}</${tag}>` }
}

/**
 * JSX function for elements with static children
 * With jsx: "react" mode, this is used for elements with multiple static children
 */
export function jsxs(
  tag: string | FunctionComponent,
  props: Props | null,
  ...children: JSXChild[]
): TemplateExpression {
  return createElement(tag, props, ...children)
}

/**
 * Fragment component for JSX fragments (<>...</>)
 */
export function Fragment(_props: Props | null, ...children: JSXChild[]): TemplateExpression {
  return { html: children?.length ? children.map(processChild).join("") : "" }
}

// Export for development mode
export { createElement as jsx, createElement as jsxDEV }

// =============================================================================
// createElement for DOM Element Generation (used in test files)
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
    type Element = TemplateExpression
    type IntrinsicElements = {
      "nosto-campaign": ElementMapping<Campaign> & Props
      "nosto-control": ElementMapping<Control> & Props
      "nosto-dynamic-card": ElementMapping<DynamicCard> & Props
      "nosto-image": ElementMapping<Image> & Props
      "nosto-popup": ElementMapping<Popup> & Props
      "nosto-product": ElementMapping<Product> & Props
      "nosto-section-campaign": ElementMapping<SectionCampaign> & Props
      "nosto-simple-card": ElementMapping<SimpleCard> & Props
      "nosto-sku-options": ElementMapping<SkuOptions> & Props
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
 * Create a DOM element based on the given JSX type, props and children
 * This is used in test files with the @jsx createDOMElement pragma
 */
export function createDOMElement(type: ElementType, props: ElementProps, ...children: Children): HTMLElement {
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
