import { assertRequired } from "@/utils/assertRequired"
import { createStore, injectKey, Store } from "./store"
import { customElement, property } from "../decorators"
import { syncSkuData } from "../common"
import { NostoElement } from "../Element"
import { provide, unprovide } from "../inject"

/**
 * Custom element that represents a Nosto product component.
 *
 * This component manages product selection, SKU selection, and add-to-cart functionality.
 * It creates a store and provides methods to interact with product and SKU data.
 *
 * {@include ./examples.md}
 *
 * @category Campaign level templating
 *
 * @property {string} productId (`product-id`) - Required. The ID of the product.
 * @property {string} recoId (`reco-id`) - Required. The recommendation slot ID.
 * @property {boolean} skuSelected (`sku-selected`) - Indicates whether a SKU is currently selected.
 */
@customElement("nosto-product")
export class Product extends NostoElement {
  @property(String) productId!: string
  @property(String) recoId!: string
  @property(Boolean) skuSelected?: boolean

  /** @hidden */
  selectedSkuId?: string

  connectedCallback() {
    assertRequired(this, "productId", "recoId")
    const store = createStore(this)
    provide(this, injectKey, store)
    this.#addListeners(store)
    this.#registerSkuSelectors(store)
    this.#registerSkuIds(store)
    this.#registerAtcButtons(store)
    this.#registerSkuData(store)
  }

  disconnectedCallback() {
    unprovide(this)
  }

  #addListeners({ listen }: Store) {
    listen("selectedSkuId", selectedSkuId => {
      this.selectedSkuId = selectedSkuId
      this.skuSelected = !!selectedSkuId
    })
    listen("skuFields", ({ image, altImage, price, listPrice }) => {
      if (image) {
        this.style.setProperty("--n-img", `url(${image})`)
        this.querySelector("img[n-img]:not([data-tracked])")?.setAttribute("src", image)
      }
      if (altImage) {
        this.style.setProperty("--n-alt-img", `url(${altImage})`)
        this.querySelector("img[n-alt-img]:not([data-tracked])")?.setAttribute("src", altImage)
      }
      if (price) {
        this.querySelectorAll<HTMLElement>("[n-price]:not([data-tracked])").forEach(e => (e.innerHTML = price))
      }
      if (listPrice) {
        this.querySelectorAll("[n-list-price]:not([data-tracked])").forEach(e => (e.innerHTML = listPrice))
      }
    })
  }

  #registerSkuSelectors({ selectSkuId }: Store) {
    this.querySelectorAll<HTMLSelectElement>("select[n-sku-selector]").forEach(element => {
      element.dataset.tracked = "true"
      selectSkuId(element.value)
      element.addEventListener("change", () => selectSkuId(element.value))
    })
  }

  #registerSkuIds({ selectSkuId, setSkuFields }: Store) {
    this.querySelectorAll<HTMLElement>("[n-sku-id]:not([n-atc])").forEach(element => {
      element.dataset.tracked = "true"
      element.addEventListener("click", () => {
        selectSkuId(element.getAttribute("n-sku-id")!)
        syncSkuData(element, setSkuFields)
      })
    })
  }

  #registerAtcButtons({ addToCart, selectSkuId }: Store) {
    this.querySelectorAll<HTMLElement>("[n-atc]:not([n-option])").forEach(element => {
      element.dataset.tracked = "true"
      element.addEventListener("click", async () => {
        const skuId = element.closest("[n-sku-id]")?.getAttribute("n-sku-id")
        if (skuId) {
          selectSkuId(skuId)
        }
        await addToCart()
      })
    })
  }

  #registerSkuData({ setSkus }: Store) {
    const dataEl = this.querySelector("script[n-sku-data]")
    if (dataEl) {
      const parsed = JSON.parse(dataEl.innerHTML)
      if (!Array.isArray(parsed)) {
        throw new Error("Invalid SKU data format. Expected an array.")
      }
      if (parsed.some(entry => typeof entry !== "object")) {
        throw new Error("Invalid SKU data format. Expected an array of objects.")
      }
      setSkus(parsed)
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-product": Product
  }
}
