import { assertRequired } from "@/utils/assertRequired"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import { getText } from "@/utils/fetch"
import { customElement, property } from "../decorators"
import { NostoElement } from "../Element"
import { html } from "@/templating/html"
import styles from "./styles.css?raw"

/** Event name for the DynamicCard loaded event */
const DYNAMIC_CARD_LOADED_EVENT = "@nosto/DynamicCard/loaded"

/**
 * A custom element that renders a product by fetching the markup from Shopify based on the provided handle and template.
 *
 * This component is designed to be used in a Shopify environment and fetches product data dynamically.
 *
 * {@include ./examples.md}
 *
 * @category Campaign level templating
 *
 * @property {string} handle - The product handle to fetch data for. Required.
 * @property {string} section - The section to use for rendering the product. section or template is required.
 * @property {string} template - The template to use for rendering the product. section or template is required.
 * @property {string} [variantId] (`variant-id`) - The variant ID to fetch specific variant data. Optional.
 * @property {boolean} [placeholder] - If true, the component will display placeholder content while loading. Defaults to false.
 * @property {boolean} [lazy] - If true, the component will only fetch data when it comes into view. Defaults to false.
 * @property {boolean} [mock] - If true, renders a visual placeholder instead of fetching real product data. Defaults to false.
 */
@customElement("nosto-dynamic-card", { observe: true })
export class DynamicCard extends NostoElement {
  @property(String) handle!: string
  @property(String) section?: string
  @property(String) template?: string
  @property(String) variantId?: string
  @property(Boolean) placeholder?: boolean
  @property(Boolean) lazy?: boolean
  @property(Boolean) mock?: boolean

  async attributeChangedCallback(_: string, oldValue: string | null, newValue: string | null) {
    if (this.isConnected && oldValue !== newValue) {
      await loadAndRenderMarkup(this)
    }
  }

  async connectedCallback() {
    assertRequired(this, "handle")

    // If mock mode is enabled, render mock template immediately and skip all other logic
    if (this.mock) {
      this.innerHTML = generateMockMarkup()
      this.dispatchEvent(new CustomEvent(DYNAMIC_CARD_LOADED_EVENT, { bubbles: true, cancelable: true }))
      return
    }

    const key = this.template || this.section || ""
    if (this.placeholder && placeholders.has(key)) {
      this.toggleAttribute("loading", true)
      this.innerHTML = placeholders.get(key) || ""
    }
    if (this.lazy) {
      const observer = new IntersectionObserver(async entries => {
        if (entries[0].isIntersecting) {
          observer.disconnect()
          await loadAndRenderMarkup(this)
        }
      })
      observer.observe(this)
    } else {
      await loadAndRenderMarkup(this)
    }
  }
}

const placeholders = new Map<string, string>()

function generateMockMarkup() {
  return html`
    <style>
      ${{ html: styles }}
    </style>
    <div class="mock-card">
      <div class="mock-image">
        <span class="mock-text">MOCK PREVIEW</span>
      </div>
      <h3 class="mock-title">Mock Product Title</h3>
      <p class="mock-brand">Mock Brand</p>
      <div class="mock-price">
        <span class="mock-price-current">XX.XX</span>
        <span class="mock-price-original">XX.XX</span>
      </div>
    </div>
  `.html
}

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
  const target = createShopifyUrl(`/products/${element.handle}`)

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
      `Invalid markup for template ${element.template}, make sure that no <body> or <html> tags are included.`
    )
  }
  return markup
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-dynamic-card": DynamicCard
  }
}
