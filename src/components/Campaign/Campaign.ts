/* eslint-disable @typescript-eslint/no-explicit-any */
import { html, define } from "hybrids"
import { nostojs } from "@nosto/nosto-js"
import { AttributedCampaignResult, JSONResult } from "@nosto/nosto-js/client"
import { compile } from "@/templating/vue"
import { getContext } from "../../templating/context"
import { getTemplate } from "../common"
import { addRequest } from "./orchestrator"
import { logFirstUsage } from "@/logger"

/**
 * A custom element that renders a Nosto campaign based on the provided placement and fetched campaign data.
 * This component fetches campaign data from Nosto and injects it into the DOM.
 * It supports both HTML and JSON response modes, allowing for flexible rendering.
 * The placement or id attribute will be used as the identifier of the placement to be fetched.
 *
 * {@include ./examples.md}
 *
 * @category Store level templating
 *
 * @property {string} placement (or id) - The placement identifier for the campaign.
 * @property {string} productId (`product-id`) - The ID of the product to associate with
 * the campaign.
 * @property {string} [variantId] (`variant-id`) - The variant ID of the product.
 * @property {string} template - The ID of the template to use for rendering
 * the campaign. If provided, the campaign will be rendered using this template.
 * @property {string} [init] - If set to "false", the component will not
 * automatically load the campaign on connection. Defaults to "true".
 * @property {boolean} [lazy] - If true, the component will only load the campaign
 * when it comes into view using IntersectionObserver. Defaults to false.
 * @property {boolean} [cartSynced] (`cart-synced`) - If true, the component will reload the campaign
 * whenever a cart update event occurs. Useful for keeping cart-related campaigns in sync
 * with cart changes. Defaults to false.
 */
const Campaign = {
  tag: "nosto-campaign",
  placement: "",
  productId: "",
  variantId: "",
  template: "",
  init: "true",
  lazy: false,
  cartSynced: false,
  templateElement: undefined,

  render: () => html`<slot></slot>`,

  connect: (host: any) => {
    logFirstUsage()

    if (!host.placement && !host.id) {
      throw new Error("placement or id attribute is required for Campaign")
    }

    const loadFn = () => loadCampaign(host)

    // Setup cart sync listener if enabled
    const setupCartSync = async () => {
      if (host.cartSynced) {
        const api = await new Promise(nostojs)
        api.listen("cartupdated", loadFn)

        // Return cleanup function for cart listener
        return async () => {
          const api = await new Promise(nostojs)
          api.unlisten("cartupdated", loadFn)
        }
      }
      return () => {}
    }

    // Initialize campaign loading
    const initCampaign = () => {
      if (host.init !== "false") {
        if (host.lazy) {
          const observer = new IntersectionObserver(async entries => {
            if (entries[0].isIntersecting) {
              observer.disconnect()
              await loadCampaign(host)
            }
          })
          observer.observe(host)
          return () => observer.disconnect()
        } else {
          loadCampaign(host).catch(console.error)
          return () => {}
        }
      }
      return () => {}
    }

    // Store cleanup functions
    let cartCleanup: (() => void) | (() => Promise<void>) = () => {}
    let initCleanup = () => {}

    // Setup
    setupCartSync().then(cleanup => {
      cartCleanup = cleanup
    })
    initCleanup = initCampaign()

    // Expose load method
    host.load = () => loadCampaign(host)

    // Return cleanup function
    return async () => {
      initCleanup()
      await cartCleanup()
    }
  }
}

export async function loadCampaign(element: any) {
  element.toggleAttribute("loading", true)
  try {
    const useTemplate = element.templateElement || element.template || element.querySelector(":scope > template")
    const placement = element.placement ?? element.id
    const api = await new Promise(nostojs)

    const rec = await addRequest({
      placement,
      productId: element.productId,
      variantId: element.variantId,
      responseMode: useTemplate ? "JSON_ORIGINAL" : "HTML"
    })

    if (rec) {
      if (useTemplate) {
        const template = getTemplate(element)
        compile(element, template, getContext(rec as JSONResult))
        api.attributeProductClicksInCampaign(element, rec as JSONResult)
      } else {
        await api.placements.injectCampaigns(
          { [placement]: rec as string | AttributedCampaignResult },
          { [placement]: element }
        )
      }
    }
  } finally {
    element.toggleAttribute("loading", false)
  }
}

// Define the hybrid component
define(Campaign)

declare global {
  interface HTMLElementTagNameMap {
    "nosto-campaign": HTMLElement & {
      placement: string
      productId?: string
      variantId?: string
      template?: string
      init?: string
      lazy?: boolean
      cartSynced?: boolean
      templateElement?: HTMLTemplateElement
      load: () => Promise<void>
    }
  }
}

export { Campaign }
