/* eslint-disable @typescript-eslint/no-explicit-any */
import { html, define } from "hybrids"
import { nostojs } from "@nosto/nosto-js"
import { logFirstUsage } from "@/logger"

/**
 * A custom element that provides conditional content rendering based on user segments.
 * This component replaces its children with the content of the first template
 * that matches any of the current user's Nosto segments.
 *
 * {@include ./examples.md}
 *
 * @category Store level templating
 */
const Control = {
  tag: "nosto-control",

  render: () => html`<slot></slot>`,

  connect: (host: any) => {
    logFirstUsage()

    // Setup segments-based content replacement
    const setupSegments = async () => {
      const api = await new Promise(nostojs)
      const segments = await api.internal.getSegments()
      const template = Array.from(host.querySelectorAll(":scope > template[segment]")).find((el: any) =>
        // TODO provide more filtering options: schedule, affinities etc
        segments?.includes(el.getAttribute("segment")!)
      ) as HTMLTemplateElement
      if (template) {
        const clone = template.content.cloneNode(true) as DocumentFragment
        host.replaceChildren(...clone.childNodes)
      }
    }

    setupSegments().catch(console.error)
  }
}

// Define the hybrid component
define(Control)

declare global {
  interface HTMLElementTagNameMap {
    "nosto-control": HTMLElement
  }
}

export { Control }
