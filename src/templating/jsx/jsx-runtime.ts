import { escapeHtml } from "@/utils/escapeHtml"

export interface TemplateExpression {
  html: string
}

/**
 * Valid types that can be rendered in JSX
 */
type JSXChild = string | number | boolean | undefined | null | TemplateExpression | JSXChild[]

type Props = Record<string, unknown> & { children?: JSXChild }

/**
 * Function component type
 */
type FunctionComponent = (props: Props | null) => TemplateExpression

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
 * JSX runtime function that creates HTML strings
 * This is called by the TypeScript compiler for JSX elements
 * When using jsx: "react", children are passed as rest parameters
 */
export function jsx(tag: string | FunctionComponent, props: Props | null, ...children: JSXChild[]): TemplateExpression {
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
  return jsx(tag, props, ...children)
}

/**
 * Fragment component for JSX fragments (<>...</>)
 */
export function Fragment(_props: Props | null, ...children: JSXChild[]): TemplateExpression {
  return { html: children?.length ? children.map(processChild).join("") : "" }
}

// Export for convenience
export { jsx as jsxDEV }
