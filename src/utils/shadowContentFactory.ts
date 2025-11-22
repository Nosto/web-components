export function shadowContentFactory(styles: string) {
  let cachedStyleSheet: CSSStyleSheet | null = null

  return async (element: HTMLElement, content: string | HTMLElement) => {
    if ("adoptedStyleSheets" in element.shadowRoot!) {
      if (!cachedStyleSheet) {
        cachedStyleSheet = new CSSStyleSheet()
        await cachedStyleSheet.replace(styles)
      }
      element.shadowRoot!.adoptedStyleSheets = [cachedStyleSheet]
      if (typeof content === "string") {
        element.shadowRoot!.innerHTML = content
      } else {
        element.shadowRoot!.innerHTML = ""
        element.shadowRoot!.appendChild(content)
      }
    } else {
      if (typeof content === "string") {
        element.shadowRoot!.innerHTML = `
          <style>${styles}</style>
          ${content}
        `
      } else {
        element.shadowRoot!.innerHTML = ""
        const styleElement = document.createElement("style")
        styleElement.textContent = styles
        element.shadowRoot!.appendChild(styleElement)
        element.shadowRoot!.appendChild(content)
      }
    }
  }
}
