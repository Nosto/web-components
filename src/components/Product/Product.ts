/* eslint-disable @typescript-eslint/no-explicit-any */
import { html, define } from "hybrids"
import { assertRequired } from "@/utils/assertRequired"
import { createStore, injectKey, Store } from "./store"
import { syncSkuData } from "../common"
import { provide } from "../inject"
import { logFirstUsage } from "@/logger"

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
const Product = {
  tag: "nosto-product",
  productId: "",
  recoId: "",
  skuSelected: false,
  selectedSkuId: "",

  render: () => html`<slot></slot>`,

  connect: (host: any) => {
    logFirstUsage()

    // Validate required attributes
    assertRequired(host, "productId", "recoId")

    // Setup store and provide it
    const store = createStore(host)
    provide(host, injectKey, store)

    // Setup listeners and registrations
    addListeners(host, store)
    registerSkuSelectors(host, store)
    registerSkuIds(host, store)
    registerAtcButtons(host, store)
    registerSkuData(host, store)
  }
}

function addListeners(element: any, { listen }: Store) {
  listen("selectedSkuId", selectedSkuId => {
    element.selectedSkuId = selectedSkuId
    element.skuSelected = !!selectedSkuId
  })
  listen("skuFields", ({ image, altImage, price, listPrice }) => {
    if (image) {
      element.style.setProperty("--n-img", `url(${image})`)
      element.querySelector("img[n-img]:not([data-tracked])")?.setAttribute("src", image)
    }
    if (altImage) {
      element.style.setProperty("--n-alt-img", `url(${altImage})`)
      element.querySelector("img[n-alt-img]:not([data-tracked])")?.setAttribute("src", altImage)
    }
    if (price) {
      element.querySelectorAll<HTMLElement>("[n-price]:not([data-tracked])").forEach(e => (e.innerHTML = price))
    }
    if (listPrice) {
      element.querySelectorAll("[n-list-price]:not([data-tracked])").forEach(e => (e.innerHTML = listPrice))
    }
  })
}

function registerSkuSelectors(element: any, { selectSkuId }: Store) {
  element.querySelectorAll("select[n-sku-selector]").forEach((selectElement: HTMLSelectElement) => {
    selectElement.dataset.tracked = "true"
    selectSkuId(selectElement.value)
    selectElement.addEventListener("change", () => selectSkuId(selectElement.value))
  })
}

function registerSkuIds(element: any, { selectSkuId, setSkuFields }: Store) {
  element.querySelectorAll("[n-sku-id]:not([n-atc])").forEach((skuElement: HTMLElement) => {
    skuElement.dataset.tracked = "true"
    skuElement.addEventListener("click", () => {
      selectSkuId(skuElement.getAttribute("n-sku-id")!)
      syncSkuData(skuElement, setSkuFields)
    })
  })
}

function registerAtcButtons(element: any, { addToCart, selectSkuId }: Store) {
  element.querySelectorAll("[n-atc]:not([n-option])").forEach((button: HTMLElement) => {
    button.dataset.tracked = "true"
    button.addEventListener("click", async () => {
      const skuId = button.closest("[n-sku-id]")?.getAttribute("n-sku-id")
      if (skuId) {
        selectSkuId(skuId)
      }
      await addToCart()
    })
  })
}

function registerSkuData(element: any, { setSkus }: Store) {
  const dataEl = element.querySelector("script[n-sku-data]")
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

// Define the hybrid component
define(Product)

declare global {
  interface HTMLElementTagNameMap {
    "nosto-product": HTMLElement & {
      productId: string
      recoId: string
      skuSelected?: boolean
      selectedSkuId?: string
    }
  }
}

export { Product }
