/* eslint-disable @typescript-eslint/no-explicit-any */
import { html as hybridHtml } from "hybrids"

// Re-export hybrids html function as our templating function
export const html = hybridHtml

// Export other useful hybrids utilities
export { define, children, parent } from "hybrids"

/**
 * Helper function to migrate from our custom TemplateExpression to hybrids
 * This can be used during transition to maintain compatibility
 */
export function createHybridTemplate(templateFn: () => any) {
  return () => templateFn()
}
