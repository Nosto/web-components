import { customElement } from "../decorators"
import { nostojs } from "@nosto/nosto-js"
import { compile } from "@/templating/vue"
import { getContext } from "../../templating/context"
import { NostoElement } from "../NostoElement"
import { getTemplate } from "../common"

/**
 * A custom element that renders templates using Vue-like syntax with Nosto page tagging data as context.
 * This component takes a template child element, evaluates it as a Vue template using the current
 * page's tagging data as context (via api.pageTagging()), and replaces the content of the custom
 * element with the compiled result.
 *
 * Usage:
 * ```html
 * <nosto-template>
 *   <template>
 *     <div>Current page type: {{ pageType }}</div>
 *     <div v-if="customer">Welcome {{ customer.firstName }}!</div>
 *     <div v-if="products.length">Products: {{ products.length }}</div>
 *   </template>
 * </nosto-template>
 * ```
 */
@customElement("nosto-template")
export class NostoTemplate extends NostoElement {
  async connectedCallback() {
    await loadTemplate(this)
  }
}

export async function loadTemplate(element: NostoTemplate) {
  const template = getTemplate(element)
  const api = await new Promise(nostojs)
  const taggingData = api.pageTagging()

  // Use the existing context processor to ensure consistent data transformation
  const context = getContext(taggingData)

  // Compile and render the template with the tagging data as context
  compile(element, template, context)
}
