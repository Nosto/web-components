type MaybeArray<T> = T | T[]

/**
 * Base type for element attributes with flexible JSX typing.
 * Provides special handling for style, className, and an index signature for flexibility.
 */
type BaseAttributes = {
  style?: string | Partial<CSSStyleDeclaration>
  class?: string
  className?: string
  [key: string]: unknown
}

type ElementProps<T extends HTMLElement> = Partial<{
  [K in keyof T as K extends "style" ? never : K]: T[K]
}> &
  BaseAttributes

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    type Element = HTMLElement
    type IntrinsicElements = {
      [K in keyof HTMLElementTagNameMap]: ElementProps<HTMLElementTagNameMap[K]>
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
