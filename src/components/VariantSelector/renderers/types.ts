import type { VariantSelector } from "../VariantSelector"

/**
 * Base interface for VariantSelector renderers.
 * Defines the contract for all rendering mode implementations.
 */
export interface VariantSelectorRenderer {
  /**
   * Renders the variant selector markup and applies it to the element's shadow DOM.
   * @param element - The VariantSelector element to render
   * @param initial - Whether this is the initial render (used for placeholder handling in options mode)
   */
  render(element: VariantSelector, initial?: boolean): Promise<void>

  /**
   * Sets up event listeners for user interactions.
   * @param element - The VariantSelector element to attach listeners to
   */
  setupEventListeners(element: VariantSelector): void

  /**
   * Updates the visual state based on current selection.
   * @param element - The VariantSelector element with current selections
   */
  updateSelection(element: VariantSelector): void
}
