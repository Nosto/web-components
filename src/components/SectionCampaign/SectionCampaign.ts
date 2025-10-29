/* eslint-disable @typescript-eslint/no-explicit-any */
import { html, define } from "hybrids"
import { nostojs } from "@nosto/nosto-js"
import { getText } from "@/utils/fetch"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import { addRequest } from "../Campaign/orchestrator"
import { JSONResult } from "@nosto/nosto-js/client"
import { logFirstUsage } from "@/logger"

/**
 * A custom element that fetches Nosto placement results and renders them using Shopify section templates.
 * This component integrates with Shopify's Section Rendering API to dynamically render campaign content.
 *
 * {@include ./examples.md}
 *
 * @category Store level templating
 *
 * @property {string} placement - The placement identifier for the campaign.
 * @property {string} section - The section to be used for Section Rendering API based rendering.
 */
const SectionCampaign = {
  tag: "nosto-section-campaign",
  placement: "",
  section: "",

  render: () => html`<slot></slot>`,

  connect: (host: any) => {
    logFirstUsage()

    const initializeMarkup = async () => {
      const api = await new Promise(nostojs)
      const rec = (await addRequest({
        placement: host.placement,
        responseMode: "JSON_ORIGINAL" // TODO use a responseMode that returns only the needed data
      })) as JSONResult
      if (!rec) {
        return
      }
      const markup = await getSectionMarkup(host, rec)
      host.innerHTML = markup
      api.attributeProductClicksInCampaign(host, rec)
    }

    const init = async () => {
      host.toggleAttribute("loading", true)
      try {
        await initializeMarkup()
      } finally {
        host.toggleAttribute("loading", false)
      }
    }

    init().catch(console.error)
  }
}

async function getSectionMarkup(element: any, rec: JSONResult) {
  const handles = rec.products.map(product => product.handle).join(":")
  const target = createShopifyUrl("/search")
  target.searchParams.set("section_id", element.section)
  target.searchParams.set("q", handles)
  const sectionHtml = await getText(target.href)
  const parser = new DOMParser()
  const doc = parser.parseFromString(sectionHtml, "text/html")
  if (rec.title) {
    const headingEl = doc.querySelector("[nosto-title]")
    if (headingEl) {
      headingEl.textContent = rec.title
    }
  }
  return doc.body.firstElementChild?.innerHTML?.trim() || sectionHtml
}

// Define the hybrid component
define(SectionCampaign)

declare global {
  interface HTMLElementTagNameMap {
    "nosto-section-campaign": HTMLElement & {
      placement: string
      section: string
    }
  }
}

export { SectionCampaign }
