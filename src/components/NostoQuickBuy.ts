import { assertRequired } from "@/utils"
import { customElement } from "./decorators"

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
        const buttons = o.values.map(ov => `<button>${ov}</button>`)
        return `<div n-option-group=${o.name}>${buttons.join("")}</div>`
      })
      const atcButton = `<button n-atc>Add to Cart</button>`
      this.innerHTML = optionGroups.join("") + atcButton
    }
  }
}

type OptionKey = "option1" | "option2" | "option3"

type Data = {
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
