import { render, type TemplateResult } from "lit"

export function litShadowContentFactory(styles: string) {
  let cachedStyleSheet: CSSStyleSheet | null = null

  return async (element: HTMLElement, template: TemplateResult) => {
    if ("adoptedStyleSheets" in element.shadowRoot!) {
      if (!cachedStyleSheet) {
        cachedStyleSheet = new CSSStyleSheet()
        await cachedStyleSheet.replace(styles)
      }
      element.shadowRoot!.adoptedStyleSheets = [cachedStyleSheet]
      render(template, element.shadowRoot!)
    } else {
      // For browsers that don't support adoptedStyleSheets, we need to render the template
      // to a temporary element to get the HTML string, then inject it with styles
      const tempDiv = document.createElement("div")
      render(template, tempDiv)
      element.shadowRoot!.innerHTML = `
        <style>${styles}</style>
        ${tempDiv.innerHTML}
      `
    }
  }
}
