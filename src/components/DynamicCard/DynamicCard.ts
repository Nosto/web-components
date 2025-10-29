/* eslint-disable @typescript-eslint/no-explicit-any */
import { html, define } from "hybrids"
import { assertRequired } from "@/utils/assertRequired"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import { getText } from "@/utils/fetch"
import { logFirstUsage } from "@/logger"

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
 */
const DynamicCard = {
  tag: "nosto-dynamic-card",
  handle: "",
  section: "",
  template: "",
  variantId: "",
  placeholder: false,
  lazy: false,

  render: () => html`<slot></slot>`,

  connect: (host: any) => {
    logFirstUsage()

    assertRequired(host, "handle")

    const init = async () => {
      const key = host.template || host.section || ""
      if (host.placeholder && placeholders.has(key)) {
        host.toggleAttribute("loading", true)
        host.innerHTML = placeholders.get(key) || ""
      }
      if (host.lazy) {
        const observer = new IntersectionObserver(async entries => {
          if (entries[0].isIntersecting) {
            observer.disconnect()
            await loadAndRenderMarkup(host)
          }
        })
        observer.observe(host)
      } else {
        await loadAndRenderMarkup(host)
      }
    }

    // Watch for attribute changes
    const observer = new MutationObserver(() => {
      init().catch(console.error)
    })

    observer.observe(host, {
      attributes: true,
      attributeFilter: ["handle", "section", "template", "variant-id", "placeholder", "lazy"]
    })

    init().catch(console.error)

    return () => {
      observer.disconnect()
    }
  }
}

const placeholders = new Map<string, string>()

async function loadAndRenderMarkup(element: any) {
  element.toggleAttribute("loading", true)
  try {
    element.innerHTML = await getMarkup(element)
    element.dispatchEvent(new CustomEvent(DYNAMIC_CARD_LOADED_EVENT, { bubbles: true, cancelable: true }))
  } finally {
    element.toggleAttribute("loading", false)
  }
}

async function getMarkup(element: any) {
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

// Define the hybrid component
define(DynamicCard)

declare global {
  interface HTMLElementTagNameMap {
    "nosto-dynamic-card": HTMLElement & {
      handle: string
      section?: string
      template?: string
      variantId?: string
      placeholder?: boolean
      lazy?: boolean
    }
  }
}

export { DynamicCard }
