import { assertRequired } from "@/utils"
import { customElement } from "./decorators"

/**
 * A custom web component for rendering a quick-buy interface for products.
 *
 * This component fetches product data based on the `handle` attribute and renders
 * options for the product, including an Add-To-Cart (ATC) button if multiple options exist.
 *
 * @property {string} handle - The unique identifier for the product to fetch.
 *
 * @example
 * ```html
 * <nosto-quick-buy handle="product-handle"></nosto-quick-buy>
 * ```
 */
@customElement("nosto-quick-buy")
export class NostoQuickBuy extends HTMLElement {
  static attributes = {
    handle: String,
    variantId: String
  }

  handle!: string
  variantId!: string

  async connectedCallback() {
    assertRequired(this, "handle")
    const result = await fetch(`/products/${this.handle}.js`)
    if (!result.ok) {
      throw new Error("Failed to fetch product data")
    }
    const { options, variants } = (await result.json()) as Data
    const filtered = options.filter(o => o.values.length > 1)
    if (filtered.length === 1) {
      // direct quick buy
      const field = `option${filtered[0].position}` as OptionKey
      const buttons = filtered[0].values.map(ov => {
        const skuId = variants.find(v => v[field] === ov)?.id
        return `<button n-sku-id="${skuId}">${ov}</button>`
      })
      this.innerHTML = buttons.join("")
    } else {
      // faceted quick buy with ATC button
      const optionGroups = filtered.map(o => {
        const field = `option${o.position}` as OptionKey
        const heading = `<h3>${o.name}</h3>`
        const buttons = o.values.map(ov => {
          const skuIds = variants.filter(v => v[field] === ov).map(v => String(v.id))
          const selected = this.variantId && skuIds.includes(this.variantId)
          return `<span n-option n-skus="${skuIds.join(",")}" ${selected ? "selected" : ""}>${ov}</span>`
        })
        return `<nosto-sku-options name=${o.name}>${heading}${buttons.join("")}</nosto-sku-options>`
      })
      const atcButton = `<button n-atc>Add to Cart</button>`
      this.innerHTML = optionGroups.join("") + atcButton
    }
  }
}

type OptionKey = "option1" | "option2" | "option3"

type Data = {
  id: number
  variants: Variant[]
  options: Option[]
}

type Variant = {
  id: string
  option1: string
  option2: string
  option3: string
}

type Option = {
  name: string
  position: number
  values: string[]
}
