import { Liquid as _Liquid } from "liquidjs"
import _Handlebars from "handlebars"
import type { Template } from "liquidjs"

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

const liquidCache = new Map<string, Template[]>()
const handlebarsCache = new Map<string, HandlebarsTemplateDelegate>()

async function evaluateLiquid(templateEl: HTMLElement, context: object) {
  const Liquid = _Liquid ?? (await import(liquidJs)).Liquid
  const engine = new Liquid()
  let tmpl = liquidCache.get(templateEl.id)
  if (!tmpl) {
    tmpl = engine.parse(templateEl.innerHTML)
    liquidCache.set(templateEl.id, tmpl)
  }
  return await engine.render(tmpl, context)
}

async function evaluateHandlebars(templateEl: HTMLElement, context: object) {
  const Handlebars = _Handlebars ?? (await import(handlebarsJs)).default
  let tmpl = handlebarsCache.get(templateEl.id)
  if (!tmpl) {
    tmpl = Handlebars.compile(templateEl.innerHTML)
    handlebarsCache.set(templateEl.id, tmpl)
  }
  return tmpl(context)
}
