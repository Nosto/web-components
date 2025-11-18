import { assertRequired } from "@/utils/assertRequired"
import { customElement, property } from "../decorators"
import { NostoElement } from "../Element"
import { loadAndRenderMarkup } from "./default"

/**
 * A custom element that displays product variant options as clickable pills.
 *
 * Fetches product data from `/products/<handle>.js` and renders option rows with
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
 *
 * @fires variantchange - Emitted when variant selection changes, contains { variant, product }
 * @fires @nosto/VariantSelector/rendered - Emitted when the component has finished rendering
 */
@customElement("nosto-variant-selector")
export class VariantSelector extends NostoElement {
  @property(String) handle!: string
  @property(Number) variantId?: number
  @property(Boolean) preselect?: boolean
  @property(Boolean) placeholder?: boolean

  /**
   * Internal state for current selections
   * @hidden
   */
  selectedOptions: Record<string, string> = {}

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  async attributeChangedCallback(_: string, oldValue: string | null, newValue: string | null) {
    if (this.isConnected && oldValue !== newValue) {
      await loadAndRenderMarkup(this, false)
    }
  }

  async connectedCallback() {
    assertRequired(this, "handle")
    await loadAndRenderMarkup(this, true)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-variant-selector": VariantSelector
  }
}
