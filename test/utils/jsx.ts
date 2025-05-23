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
      [key: string]: Record<string, unknown> & GlobalEventHandlersMapping
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
