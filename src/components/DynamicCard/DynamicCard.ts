import { assertRequired } from "@/utils/assertRequired"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import { getText } from "@/utils/fetch"
import { mergeDom } from "@/utils/mergeDom"
import { customElement, property } from "../decorators"
import { NostoElement } from "../Element"
import { shadowContentFactory } from "@/utils/shadowContentFactory"
import styles from "./styles.css?raw"
import { generateMockMarkup } from "./markup"

const setShadowContent = shadowContentFactory(styles)

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
 * @property {boolean} [mock] - If true, the component will render mock markup instead of fetching real data. Defaults to false.
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
      mergeDom(this, placeholders.get(key) || "")
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

async function loadAndRenderMarkup(element: DynamicCard) {
  element.toggleAttribute("loading", true)
  try {
    mergeDom(element, await getMarkup(element))
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
