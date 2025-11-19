import { mergeDom } from "./mergeDom"

export function shadowContentFactory(styles: string) {
  let cachedStyleSheet: CSSStyleSheet | null = null

  return async (element: HTMLElement, content: string) => {
    if ("adoptedStyleSheets" in element.shadowRoot!) {
      if (!cachedStyleSheet) {
        cachedStyleSheet = new CSSStyleSheet()
        await cachedStyleSheet.replace(styles)
      }
      element.shadowRoot!.adoptedStyleSheets = [cachedStyleSheet]
      mergeDom(element.shadowRoot as unknown as HTMLElement, content)
    } else {
      mergeDom(
        element.shadowRoot as unknown as HTMLElement,
        `
        <style>${styles}</style>
        ${content}
      `
      )
    }
  }
}
