import { assertRequired } from "@/utils/assertRequired"
import { customElement, property } from "../decorators"
import { NostoElement } from "../Element"
import { getRenderer } from "./renderers"
import type { VariantSelectorRenderer } from "./renderers"

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
export class VariantSelector extends NostoElement {
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

  /**
   * Current renderer instance
   * @hidden
   */
  #renderer: VariantSelectorRenderer | null = null

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  async attributeChangedCallback(_: string, oldValue: string | null, newValue: string | null) {
    if (this.isConnected && oldValue !== newValue) {
      await this.#render()
    }
  }

  async connectedCallback() {
    assertRequired(this, "handle")
    await this.#render(true)
  }

  async #render(initial = false) {
    this.#renderer = getRenderer(this)
    await this.#renderer.render(this, initial)
  }

  /**
   * Get the current renderer instance (for testing purposes)
   * @hidden
   */
  get renderer(): VariantSelectorRenderer | null {
    return this.#renderer
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-variant-selector": VariantSelector
  }
}
