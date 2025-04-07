import { assertRequired } from "@/utils"
import { createStore, provideStore, Store } from "../store"
import { customElement } from "./decorators"

@customElement("nosto-product")
export class NostoProduct extends HTMLElement {
  static attributes = {
    productId: String,
    recoId: String,
    skuSelected: Boolean
  }

  selectedSkuId: string | undefined
  productId!: string
  recoId!: string
  skuSelected!: boolean

  connectedCallback() {
    assertRequired(this, "productId", "recoId")
    initProduct(this)
  }
}

function initProduct(element: NostoProduct) {
  const store = createStore(element)
  provideStore(element, store)
  store.listen("selectedSkuId", selectedSkuId => {
    element.selectedSkuId = selectedSkuId
    element.skuSelected = !!selectedSkuId
  })
  registerSKUSelectors(element, store)
  registerSKUIds(element, store)
  registerATCButtons(element, store)
}

function registerSKUSelectors(element: NostoProduct, { selectSkuId }: Store) {
  element.querySelectorAll<HTMLSelectElement>("select[n-sku-selector]").forEach(element => {
    selectSkuId(element.value)
    element.addEventListener("change", () => selectSkuId(element.value))
  })
}

function registerSKUIds(element: NostoProduct, { selectSkuId }: Store) {
  element.querySelectorAll("[n-sku-id]:not([n-atc])").forEach(element => {
    element.addEventListener("click", () => {
      selectSkuId(element.getAttribute("n-sku-id")!)
    })
  })
}

function registerATCButtons(element: NostoProduct, { addToCart, selectSkuId }: Store) {
  element.querySelectorAll("[n-atc]").forEach(element =>
    element.addEventListener("click", async () => {
      const skuId = element.closest("[n-sku-id]")?.getAttribute("n-sku-id")
      if (skuId) {
        selectSkuId(skuId)
      }
      await addToCart()
    })
  )
}
