import { assertRequired } from "@/utils/assertRequired"
import { getShopifyUrl } from "@/shopify/getShopifyUrl"
import { customElement, property } from "../decorators"
import { applyDefaults } from "@/utils/applyDefaults"
import { nostojs } from "@nosto/nosto-js"
import { JSONResult } from "@nosto/nosto-js/client"
import { getText } from "@/utils/fetch"
import { NostoElement } from "../Element"

/** Event name for the DynamicCards loaded event */
const DYNAMIC_CARDS_LOADED_EVENT = "@nosto/DynamicCards/loaded"

type Product = {
  id: string
  handle: string
}

type DefaultProps = Pick<DynamicCards, "lazy" | "loadRecommendations" | "section">

/** Default values for DynamicCards attributes */
let dynamicCardsDefaults: DefaultProps = {}

/**
 * A custom element that renders multiple products by fetching their markup from Shopify, using Storefront search API, based on the provided handles and the section.
 *
 * This component is designed to be used in a Shopify environment and fetches product card markup dynamically for a list of products.
 *
 *
 * @category Campaign level templating
 *
 * @property {string} [section] - The section to use for rendering the product cards. section should be supplied as an attribute or through the defaults.
 * @property {boolean} [lazy] - If true, the component will only fetch data when it comes into view. Defaults to false.
 * @property {string} [placement] - Optional placement identifier to include in the request for analytics and campaign targeting purposes. Required when `loadRecommendations` is true.
 * @property {boolean} [loadRecommendations] - If true, the component will load product ids from Nosto. Defaults to false.
 * @property {boolean} [searchPerformed] - Internal flag to prevent multiple recommendation loads. Not settable via attribute.
 * @property {string} [productsContainerSelector] - Optional CSS selector to identify the container within the fetched markup where product card items are located. Used for appending additional batches of products while preserving existing content.
 * @property {string} [productItemSelector] - Optional CSS selector to identify individual product card items within the fetched markup. Used for sorting products based on the original order of the input product list.
 */
@customElement("nosto-dynamic-cards")
export class DynamicCards extends NostoElement {
  private BATCH_SIZE = 10
  #products: Product[] = []
  @property(String) section?: string
  @property(Boolean) lazy?: boolean
  @property(String) placement!: string
  @property(Boolean) loadRecommendations?: boolean
  @property(Boolean) searchPerformed?: boolean
  @property(String) productsContainerSelector?: string
  @property(String) productItemSelector?: string

  set products(products: Product[]) {
    this.#products = products
    if (this.isConnected) {
      if (this.lazy) {
        const observer = new IntersectionObserver(async entries => {
          if (entries[0].isIntersecting) {
            observer.disconnect()
            await this.render()
          }
        })
        observer.observe(this)
      } else {
        void this.render()
      }
    }
  }

  get products() {
    return this.#products
  }

  async connectedCallback() {
    // Apply default values before rendering
    applyDefaults(this, dynamicCardsDefaults as this)

    if (!this.loadRecommendations || (this.loadRecommendations && !this.placement) || this.searchPerformed) {
      return
    }

    const api = await new Promise(nostojs)
    const { recommendations } = await api
      .createRecommendationRequest({ includeTagging: true })
      .disableCampaignInjection()
      .setElements([this.placement])
      .setResponseMode("JSON_ORIGINAL")
      .load()

    const recs = recommendations[this.placement] as JSONResult
    if (recs && recs.products) {
      this.searchPerformed = true
      this.products = recs.products.map(p => ({
        id: p.product_id,
        handle: p.handle
      }))

      console.log("Loaded recommendations for DynamicCards:", this.products)
    }
  }

  async render() {
    assertRequired(this, "section")
    if (!this.products.length) {
      this.innerHTML = "<span>No products to display</span>"
      return
    }

    this.toggleAttribute("loading", true)
    try {
      const batches = this.#chunkProducts(this.products)

      let batchIndex = 0
      for (const batch of batches) {
        const markup = await this.#getMarkup(batch)
        this.#extractDOM(markup, batchIndex)
        batchIndex++
      }

      this.dispatchEvent(new CustomEvent(DYNAMIC_CARDS_LOADED_EVENT, { bubbles: true, cancelable: true }))
    } finally {
      this.toggleAttribute("loading", false)
    }
  }

  async #getMarkup(batch: Product[]) {
    const target = this.#generateUrl(false, batch)

    const markup = await getText(target, { cached: true })

    if (/<(body|html)/.test(markup)) {
      throw new Error(
        `Invalid markup for section ${this.section}, make sure that no <body> or <html> tags are included.`
      )
    }
    return markup
  }

  #sortResultsIfApplicable(recommendations: HTMLElement, batchIndex: number) {
    if (this.productItemSelector) {
      this.products.forEach((product, index) => {
        const productUrl = `/products/${product.handle}`
        const productCardItem = recommendations.querySelector<HTMLElement>(
          `${this.productItemSelector!}:has(a[href*="${productUrl}"])`
        )
        if (productCardItem) {
          productCardItem.style.order = `${index + batchIndex * this.BATCH_SIZE}`
        }
      })
    }

    return recommendations
  }

  #generateUrl(predictiveSearch: boolean, batch: Product[]) {
    if (predictiveSearch) {
      const url = getShopifyUrl(`/search/suggest`)
      url.searchParams.set("section_id", this.section!)
      url.searchParams.set("q", this.#generateQuery(batch))
      url.searchParams.set("resources[type]", "product")
      url.searchParams.set("resources[limit_scope]", "each")
      url.searchParams.set("resources[options][unavailable_products]", "hide")
      return url.href
    }

    const url = getShopifyUrl(`/search`)
    url.searchParams.set("section_id", this.section!)
    url.searchParams.set("q", this.#generateQuery(batch))
    url.searchParams.set("type", "product")
    url.searchParams.set("options[prefix]", "none")
    url.searchParams.set("options[unavailable_products]", "hide")
    return url.href
  }

  #generateQuery(products: Product[]) {
    const query = products.map(p => `id:${p.id.trim()}`).join(" OR ")
    return query
  }

  #chunkProducts(products: Product[]) {
    const batches: Product[][] = []
    for (let index = 0; index < products.length; index += this.BATCH_SIZE) {
      batches.push(products.slice(index, index + this.BATCH_SIZE))
    }
    return batches
  }

  #extractDOM(markup: string, batchIndex: number) {
    const html = document.createElement("div")
    html.innerHTML = markup
    const recommendations = html.querySelector<HTMLElement>(`nosto-dynamic-cards[id="${this.id}"]`)
    if (!recommendations) {
      return html
    }
    const sortedContent = this.#sortResultsIfApplicable(recommendations, batchIndex)

    if (batchIndex === 0) {
      if (sortedContent.children.length > 0) {
        this.replaceChildren(...sortedContent.children)
      } else {
        this.replaceChildren(sortedContent)
      }
    } else if (this.productItemSelector && this.productsContainerSelector) {
      const items = sortedContent.querySelectorAll(this.productItemSelector)
      const container = this.querySelector(this.productsContainerSelector)
      if (container && items.length) {
        items.forEach(item => container.appendChild(item))
      }
    }
  }
}

/**
 * Sets default values for DynamicCards attributes.
 * These defaults will be applied to all DynamicCards instances created after this function is called.
 *
 * @param defaults - An object containing default values for DynamicCards attributes
 *
 * @example
 * ```typescript
 * import { setDynamicCardsDefaults } from '@nosto/web-components'
 *
 * setDynamicCardsDefaults({
 *   lazy: true,
 *   loadRecommendations: true,
 *   section: 'product-card'
 * })
 * ```
 */
export function setDynamicCardsDefaults(defaults: DefaultProps) {
  dynamicCardsDefaults = { ...defaults }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-dynamic-cards": DynamicCards
  }
}
