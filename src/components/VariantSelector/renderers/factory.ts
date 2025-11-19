import type { VariantSelector } from "../VariantSelector"
import type { VariantSelectorRenderer } from "./types"
import { OptionsRenderer } from "./OptionsRenderer"
import { CompactRenderer } from "./CompactRenderer"

const optionsRenderer = new OptionsRenderer()
const compactRenderer = new CompactRenderer()

/**
 * Factory function that returns the appropriate renderer based on the element's mode.
 * Reuses renderer instances for efficiency.
 *
 * @param element - The VariantSelector element
 * @returns The appropriate renderer instance
 */
export function getRenderer(element: VariantSelector): VariantSelectorRenderer {
  if (element.mode === "compact") {
    return compactRenderer
  }
  return optionsRenderer
}
