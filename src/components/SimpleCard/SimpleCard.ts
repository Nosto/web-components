import { assertRequired } from "@/utils/assertRequired"
import { customElement, property } from "../decorators"
import { NostoElement } from "../Element"
import { generateCardHTML, updateSimpleCardContent } from "./markup"
import styles from "./styles.css?raw"
import type { ShopifyProduct, VariantChangeDetail } from "@/shopify/graphql/types"
import { addSkuToCart } from "@nosto/nosto-js"
import { shadowContentFactory } from "@/utils/shadowContentFactory"
import { JSONProduct } from "@nosto/nosto-js/client"
import { convertProduct } from "./convertProduct"
import { fetchProduct } from "@/shopify/graphql/fetchProduct"
import { parseId, toProductId } from "@/shopify/graphql/utils"

const setShadowContent = shadowContentFactory(styles)

/** Event name for the SimpleCard rendered event */
const SIMPLE_CARD_RENDERED_EVENT = "@nosto/SimpleCard/rendered"

export const mockProduct = {
  id: toProductId(7001),
  availableForSale: true,
  title: "Mock Product",
  vendor: "Mock Brand",
  onlineStoreUrl: "/products/mock-product",
  images: [
    {
      url: "https://cdn.nosto.com/nosto/7/mock",
      altText: "Mock Product Image",
      width: 800,
      height: 800,
      thumbhash: null
    }
  ],
  price: {
    amount: "10",
    currencyCode: "USD"
  },
  compareAtPrice: {
    amount: "12",
    currencyCode: "USD"
  }
} as ShopifyProduct

/**
 * A custom element that displays a product card using Shopify product data.
 *
 * Fetches product data from `/products/<handle>.js` and renders a card with
 * product image, title, price, and optional brand, discount, and rating information.
 *
 * The component renders inside a shadow DOM with encapsulated styles. Styling can be
 * customized using the following CSS custom properties:
 *
 * {@include ./examples.md}
 *
 * @category Campaign level templating
 *
 * @property {string} handle - The Shopify product handle to fetch data for. Required.
 * @property {boolean} [alternate] - Show alternate product image on hover. Defaults to false.
 * @property {boolean} [carousel] - Show image carousel with arrow navigation. Defaults to false.
 * @property {boolean} [brand] - Show brand/vendor data. Defaults to false.
 * @property {boolean} [discount] - Show discount data. Defaults to false.
 * @property {boolean} [rating] - Show product rating. Defaults to false.
 * @property {string} [sizes] - The sizes attribute for responsive images to help the browser choose the right image size.
 * @property {boolean} [mock] - If true, uses mock data instead of fetching from Shopify. Defaults to false.
 *
 * @fires @nosto/SimpleCard/rendered - Emitted when the component has finished rendering
 */
@customElement("nosto-simple-card", { observe: true })
export class SimpleCard extends NostoElement {
  @property(String) handle!: string
  @property(Boolean) alternate?: boolean
  @property(Boolean) carousel?: boolean
  @property(Boolean) brand?: boolean
  @property(Boolean) discount?: boolean
  @property(Number) rating?: number
  @property(String) sizes?: string
  @property(Boolean) mock?: boolean

  product?: JSONProduct

  /** @hidden */
  productId?: number
  /** @hidden */
  variantId?: number

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  async attributeChangedCallback(_: string, oldValue: string | null, newValue: string | null) {
    if (this.isConnected && oldValue !== newValue) {
      await loadAndRenderMarkup(this)
    }
  }

  async connectedCallback() {
    assertRequired(this, "handle")
    await loadAndRenderMarkup(this)
    this.addEventListener("click", this)
    this.shadowRoot?.addEventListener("click", this)
    this.addEventListener("variantchange", this)

    // Add scroll listener for carousel to update indicators
    if (this.carousel) {
      this.shadowRoot?.addEventListener("scroll", this, { capture: true })
    }
  }

  handleEvent(event: Event) {
    switch (event.type) {
      case "click":
        onClick(this, event as MouseEvent)
        break
      case "variantchange":
        onVariantChange(this, event as CustomEvent<VariantChangeDetail>)
        break
      case "scroll":
        onCarouselScroll(this, event)
        break
    }
  }
}

function isAddToCartClick(event: MouseEvent) {
  return event.target instanceof HTMLElement && event.target.hasAttribute("n-atc")
}

function isCarouselIndicatorClick(event: MouseEvent) {
  return event.target instanceof HTMLElement && event.target.hasAttribute("data-carousel-indicator")
}

async function onClick(element: SimpleCard, event: MouseEvent) {
  if (isCarouselIndicatorClick(event)) {
    event.preventDefault()
    event.stopPropagation()
    handleIndicatorClick(element, event)
    return
  }

  if (isAddToCartClick(event) && element.productId && element.variantId) {
    event.stopPropagation()
    await addSkuToCart({
      productId: element.productId.toString(),
      skuId: element.variantId.toString()
    })
  }
}

function handleIndicatorClick(element: SimpleCard, event: MouseEvent) {
  const target = event.target as HTMLElement
  const index = parseInt(target.getAttribute("data-carousel-indicator") || "0")
  const carouselImages = element.shadowRoot?.querySelector(".carousel-images")
  const slide = element.shadowRoot?.querySelector(`.carousel-slide[data-index="${index}"]`)

  if (carouselImages && slide) {
    slide.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
  }
}

interface ElementWithScrollTimeout extends SimpleCard {
  _scrollTimeout?: ReturnType<typeof setTimeout>
}

function onCarouselScroll(element: SimpleCard, event: Event) {
  const target = event.target as HTMLElement
  if (!target.classList.contains("carousel-images")) return

  const elementWithTimeout = element as ElementWithScrollTimeout

  // Debounce scroll updates to avoid too frequent updates
  clearTimeout(elementWithTimeout._scrollTimeout)
  elementWithTimeout._scrollTimeout = setTimeout(() => {
    updateCarouselIndicators(element)
  }, 100)
}

function updateCarouselIndicators(element: SimpleCard) {
  const carouselImages = element.shadowRoot?.querySelector(".carousel-images") as HTMLElement
  if (!carouselImages) return

  const slides = carouselImages.querySelectorAll(".carousel-slide")
  const indicators = element.shadowRoot?.querySelectorAll(".carousel-indicator")
  if (!slides.length || !indicators) return

  // Find the slide that is most visible (closest to the left edge of the container)
  const containerLeft = carouselImages.scrollLeft
  const containerWidth = carouselImages.clientWidth
  const centerPoint = containerLeft + containerWidth / 2

  let closestIndex = 0
  let closestDistance = Infinity

  slides.forEach((slide, index) => {
    const slideElement = slide as HTMLElement
    const slideLeft = slideElement.offsetLeft
    const slideCenter = slideLeft + slideElement.clientWidth / 2
    const distance = Math.abs(slideCenter - centerPoint)

    if (distance < closestDistance) {
      closestDistance = distance
      closestIndex = index
    }
  })

  // Update indicators
  indicators.forEach((indicator, index) => {
    if (index === closestIndex) {
      indicator.classList.add("active")
    } else {
      indicator.classList.remove("active")
    }
  })
}

function onVariantChange(element: SimpleCard, event: CustomEvent<VariantChangeDetail>) {
  event.stopPropagation()
  const { variant } = event.detail
  element.productId = parseId(variant.product.id)
  element.variantId = parseId(variant.id)
  updateSimpleCardContent(element, variant)
}

async function loadAndRenderMarkup(element: SimpleCard) {
  if (element.product) {
    const normalized = convertProduct(element.product)
    const cardHTML = generateCardHTML(element, normalized)
    setShadowContent(element, cardHTML.html)
    element.dispatchEvent(new CustomEvent(SIMPLE_CARD_RENDERED_EVENT, { bubbles: true, cancelable: true }))
  }
  element.toggleAttribute("loading", true)
  try {
    const productData = element.mock ? mockProduct : await fetchProduct(element.handle)
    element.productId = parseId(productData.id)

    const cardHTML = generateCardHTML(element, productData)
    setShadowContent(element, cardHTML.html)
    if (!element.product) {
      element.dispatchEvent(new CustomEvent(SIMPLE_CARD_RENDERED_EVENT, { bubbles: true, cancelable: true }))
    }
  } finally {
    element.toggleAttribute("loading", false)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-simple-card": SimpleCard
  }
}
