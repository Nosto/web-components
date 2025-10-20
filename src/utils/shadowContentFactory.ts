export function shadowContentFactory(styles: string) {
  let cachedStyleSheet: CSSStyleSheet | null = null

  return async (element: HTMLElement, content: string) => {
    if ("adoptedStyleSheets" in element.shadowRoot!) {
      if (!cachedStyleSheet) {
        cachedStyleSheet = new CSSStyleSheet()
        await cachedStyleSheet.replace(styles)
      }
      element.shadowRoot!.adoptedStyleSheets = [cachedStyleSheet]
      element.shadowRoot!.innerHTML = content
    } else {
      element.shadowRoot!.innerHTML = `
        <style>${styles}</style>
        ${content}
      `
    }
  }
}
