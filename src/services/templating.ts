const liquidJs = "https://cdn.jsdelivr.net/npm/liquidjs@latest/dist/liquid.browser.esm.js"
const handlebarsJs = "https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.min.js"

export async function evaluate(templateId: string, context: object) {
  const templateEl = document.getElementById(templateId)
  if (!templateEl) {
    throw new Error(`Template with id "${templateId}" not found.`)
  }
  switch (templateEl.getAttribute("type")) {
    case "text/liquid":
      return evaluateLiquid(templateEl, context)
    case "text/handlebars":
      return evaluateHandlebars(templateEl, context)
    default:
      throw new Error(`Unsupported template type "${templateEl.getAttribute("type")}".`)
  }
}

async function evaluateLiquid(templateEl: HTMLElement, context: object) {
  const Liquid = window.Liquid ?? (await import(liquidJs))
  const engine = new Liquid.Liquid()
  const tmpl = engine.parse(templateEl.innerHTML)
  return await engine.render(tmpl, context)
}

async function evaluateHandlebars(templateEl: HTMLElement, context: object) {
  const Handlebars = window.Handlebars ?? (await import(handlebarsJs))
  const template = Handlebars.compile(templateEl.innerHTML)
  return template(context)
}
