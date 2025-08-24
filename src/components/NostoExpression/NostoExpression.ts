import { nostojs } from "@nosto/nosto-js"
import { customElement } from "../decorators"
import { NostoElement } from "../NostoElement"

/**
 * NostoExpression is a custom element that evaluates a Vue expression using page tagging data as context.
 * The result of the expression evaluation is displayed as text content of the element.
 *
 * @category Dynamic Content
 *
 * @property {string} expr - The Vue expression to evaluate using page tagging context.
 *
 * @example
 * Display product name from page tagging:
 * ```html
 * <nosto-expression expr="product.name"></nosto-expression>
 * ```
 *
 * @example
 * Display calculated value:
 * ```html
 * <nosto-expression expr="product.price * 1.2"></nosto-expression>
 * ```
 */
@customElement("nosto-expression", { observe: true })
export class NostoExpression extends NostoElement {
  /** @private */
  static attributes = {
    expr: String
  }

  expr!: string

  attributeChangedCallback() {
    if (this.isConnected) {
      this.connectedCallback()
    }
  }

  async connectedCallback() {
    const api = await new Promise(nostojs)
    const pageTagging = api.pageTagging()
    const result = evaluate(this.expr, pageTagging)
    this.textContent = String(result ?? "")
  }
}

// Cache for compiled function objects.
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const functionCache = new Map<string, Function>()

// Evaluates a JS expression in the context of provided data.
function evaluate(expression: string, context: object) {
  // Build a cache key based on the expression and the context keys.
  let fn = functionCache.get(expression)
  if (!fn) {
    // TODO sanitize the expression to prevent code injection.
    fn = new Function("$data", `with ($data) { return ${expression}; }`)
    functionCache.set(expression, fn)
  }
  return fn(context)
}
