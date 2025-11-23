import { assertRequired } from "@/utils/assertRequired"
import { customElement, property } from "../decorators"
import { ReactiveElement } from "../Element"
import { loadAndRenderMarkup } from "./options"
import { loadAndRenderCompact } from "./compact"

/**
 * A custom element that displays product variant options as clickable pills.
 *
 * Fetches product data from the Shopify Storefront GraphQL API and renders option rows with
 * clickable value pills. Optionally preselects the first value for each option and highlights
 * the currently selected choices. Emits a custom event when variant selections change.
 *
 * The component renders inside a shadow DOM with encapsulated styles. Styling can be
 * customized using CSS custom properties.
 *
 * {@include ./examples.md}
 *
 * @category Campaign level templating
 *
 * @property {string} handle - The Shopify product handle to fetch data for. Required.
 * @property {string} variantId - (Optional) The ID of the variant to preselect on load.
 * @property {boolean} preselect - Whether to automatically preselect the options of the first available variant. Defaults to false.
 * @property {boolean} placeholder - If true, the component will display placeholder content while loading. Defaults to false.
 * @property {number} maxValues - (Optional) Maximum number of option values to display per option. When exceeded, shows an ellipsis indicator.
 * @property {string} mode - (Optional) Display mode: "options" or "compact". Defaults to "options".
 *
 * @fires variantchange - Emitted when variant selection changes, contains { variant, product }
 * @fires @nosto/VariantSelector/rendered - Emitted when the component has finished rendering
 */
@customElement("nosto-variant-selector", { observe: true })
export class VariantSelector extends ReactiveElement {
  @property(String) handle!: string
  @property(Number) variantId?: number
  @property(Boolean) preselect?: boolean
  @property(Boolean) placeholder?: boolean
  @property(Number) maxValues?: number
  @property(String) mode?: "options" | "compact"

  /**
   * Internal state for current selections
   * @hidden
   */
  selectedOptions: Record<string, string> = {}

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  async connectedCallback() {
    assertRequired(this, "handle")
    await this.render(true)
  }

  async render(initial = false) {
    if (this.mode === "compact") {
      await loadAndRenderCompact(this)
    } else {
      await loadAndRenderMarkup(this, initial)
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-variant-selector": VariantSelector
  }
}
