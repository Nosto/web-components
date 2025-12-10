import { assertRequired } from "@/utils/assertRequired"
import { getShopifyUrl } from "@/shopify/getShopifyUrl"
import { getText } from "@/utils/fetch"
import { customElement, property } from "../decorators"
import { ReactiveElement } from "../Element"
import { shadowContentFactory } from "@/utils/shadowContentFactory"
import { applyDefaults } from "@/utils/applyDefaults"
import styles from "./styles.css?raw"
import { generateMockMarkup } from "./markup"

const setShadowContent = shadowContentFactory(styles)

/** Event name for the DynamicCard loaded event */
const DYNAMIC_CARD_LOADED_EVENT = "@nosto/DynamicCard/loaded"

type DefaultProps = Pick<DynamicCard, "section" | "placeholder" | "lazy" | "mock"> & {
  /** @deprecated Use `section` property instead. Template-based rendering will be removed in a future version. */
  template?: string
}

/** Default values for DynamicCard attributes */
let dynamicCardDefaults: DefaultProps = {}

/**
 * A custom element that renders a product by fetching the markup from Shopify based on the provided handle and section or template.
 *
 * This component is designed to be used in a Shopify environment and fetches product data dynamically.
 * **Recommended:** Use the `section` property for better performance and maintainability. The `template` property is deprecated.
 *
 * {@include ./examples.md}
 *
 * @category Campaign level templating
 *
 * @property {string} handle - The product handle to fetch data for. Required.
 * @property {string} section - The section to use for rendering the product. Recommended approach using Shopify's Section Rendering API.
 * @property {string} [template] - **Deprecated:** Use `section` property instead. Template-based rendering will be removed in a future version.
 * @property {string} [variantId] (`variant-id`) - The variant ID to fetch specific variant data. Optional.
 * @property {boolean} [placeholder] - If true, the component will display placeholder content while loading. Defaults to false.
 * @property {boolean} [lazy] - If true, the component will only fetch data when it comes into view. Defaults to false.
 * @property {boolean} [mock] - If true, the component will render mock markup instead of fetching real data. Defaults to false.
 */
@customElement("nosto-dynamic-card", { observe: true })
export class DynamicCard extends ReactiveElement {
  @property(String) handle!: string
  @property(String) section?: string
  /**
   * @deprecated Use `section` property instead. Template-based rendering will be removed in a future version.
   */
  @property(String) template?: string
  @property(String) variantId?: string
  @property(Boolean) placeholder?: boolean
  @property(Boolean) lazy?: boolean
  @property(Boolean) mock?: boolean

  async connectedCallback() {
    // Apply default values before rendering
    applyDefaults(this, dynamicCardDefaults as this)

    // Warn about deprecated template property
    if (this.template) {
      console.warn("DynamicCard: template property is deprecated. Use section property instead.")
    }

    if (this.mock) {
      if (!this.shadowRoot) {
        this.attachShadow({ mode: "open" })
      }
      setShadowContent(this, generateMockMarkup().html)
      this.dispatchEvent(
        new CustomEvent(DYNAMIC_CARD_LOADED_EVENT, { bubbles: true, cancelable: true, detail: { mock: true } })
      )
      return
    }

    assertRequired(this, "handle")
    const key = this.template || this.section || ""
    if (this.placeholder && placeholders.has(key)) {
      this.toggleAttribute("loading", true)
      this.innerHTML = placeholders.get(key) || ""
    }
    if (this.lazy) {
      const observer = new IntersectionObserver(async entries => {
        if (entries[0].isIntersecting) {
          observer.disconnect()
          await this.render()
        }
      })
      observer.observe(this)
    } else {
      await this.render()
    }
  }

  async render() {
    await loadAndRenderMarkup(this)
  }
}

const placeholders = new Map<string, string>()

async function loadAndRenderMarkup(element: DynamicCard) {
  element.toggleAttribute("loading", true)
  try {
    element.innerHTML = await getMarkup(element)
    element.dispatchEvent(new CustomEvent(DYNAMIC_CARD_LOADED_EVENT, { bubbles: true, cancelable: true }))
  } finally {
    element.toggleAttribute("loading", false)
  }
}

async function getMarkup(element: DynamicCard) {
  const target = getShopifyUrl(`/products/${element.handle}`)

  if (element.template) {
    target.searchParams.set("view", element.template)
    target.searchParams.set("layout", "none")
  } else if (element.section) {
    target.searchParams.set("section_id", element.section)
  }

  if (element.variantId) {
    target.searchParams.set("variant", element.variantId)
  }

  let markup = await getText(target.href, { cached: true })

  if (element.section) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(markup, "text/html")
    markup = doc.body.firstElementChild?.innerHTML?.trim() || markup
  }
  const key = element.template || element.section || ""
  placeholders.set(key, markup)
  if (/<(body|html)/.test(markup)) {
    throw new Error(
      `Invalid markup for ${element.template ? "template" : "section"} ${key}, make sure that no <body> or <html> tags are included.`
    )
  }
  return markup
}

/**
 * Sets default values for DynamicCard attributes.
 * These defaults will be applied to all DynamicCard instances created after this function is called.
 *
 * @param defaults - An object containing default values for DynamicCard attributes
 *
 * @example
 * ```typescript
 * import { setDynamicCardDefaults } from '@nosto/web-components'
 *
 * // Recommended: Use section instead of template
 * setDynamicCardDefaults({
 *   placeholder: true,
 *   lazy: true,
 *   section: 'product-card-section'
 * })
 *
 * // Deprecated: template property
 * setDynamicCardDefaults({
 *   placeholder: true,
 *   lazy: true,
 *   template: 'product-card' // ⚠️ Deprecated - use section instead
 * })
 * ```
 */
export function setDynamicCardDefaults(defaults: DefaultProps) {
  dynamicCardDefaults = { ...defaults }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-dynamic-card": DynamicCard
  }
}
