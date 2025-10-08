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
