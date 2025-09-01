import { Store } from "./Product/store"

export function syncSkuData(element: HTMLElement, setter: Store["setSkuFields"]) {
  setter({
    image: element.getAttribute("n-img") ?? undefined,
    altImage: element.getAttribute("n-alt-img") ?? undefined,
    price: element.getAttribute("n-price") ?? undefined,
    listPrice: element.getAttribute("n-list-price") ?? undefined
  })
}

interface CampaignElement extends HTMLElement {
  template?: string
  templateElement?: HTMLTemplateElement
}

export function getTemplate(element: CampaignElement): HTMLTemplateElement {
  if (element.templateElement) {
    return element.templateElement
  }
  const template = element.template
    ? document.querySelector<HTMLTemplateElement>(`template#${element.template}`)
    : element.querySelector<HTMLTemplateElement>(":scope > template")
  if (!template) {
    throw new Error(`Template with id "${element.template}" not found.`)
  }
  element.templateElement = template
  return template
}
