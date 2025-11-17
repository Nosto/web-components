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

    // Add touch/pointer event listeners for carousel swipe
    if (this.carousel) {
      this.shadowRoot?.addEventListener("pointerdown", this)
      this.shadowRoot?.addEventListener("pointermove", this)
      this.shadowRoot?.addEventListener("pointerup", this)
      this.shadowRoot?.addEventListener("pointercancel", this)
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
      case "pointerdown":
        onPointerDown(this, event as PointerEvent)
        break
      case "pointermove":
        onPointerMove(this, event as PointerEvent)
        break
      case "pointerup":
      case "pointercancel":
        onPointerEnd(this, event as PointerEvent)
        break
    }
  }
}

function isAddToCartClick(event: MouseEvent) {
  return event.target instanceof HTMLElement && event.target.hasAttribute("n-atc")
}

// Swipe gesture tracking
interface SwipeState {
  startX: number
  startY: number
  currentX: number
  currentY: number
  isDragging: boolean
  pointerId: number | null
}

const swipeStates = new WeakMap<SimpleCard, SwipeState>()

function isCarouselIndicatorClick(event: MouseEvent) {
  return event.target instanceof HTMLElement && event.target.hasAttribute("data-carousel-indicator")
}

function isCarouselSwipeArea(event: PointerEvent) {
  const target = event.target as HTMLElement
  return target.hasAttribute("data-carousel-swipe") || target.closest("[data-carousel-swipe]") !== null
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
  const newIndex = parseInt(target.getAttribute("data-carousel-indicator") || "0")
  navigateToSlide(element, newIndex)
}

function navigateToSlide(element: SimpleCard, newIndex: number) {
  const carouselContainer = element.shadowRoot?.querySelector(".image.carousel")
  if (!carouselContainer) return

  const currentIndex = parseInt(carouselContainer.getAttribute("data-current-index") || "0")
  const slides = carouselContainer.querySelectorAll(".carousel-slide")
  const indicators = carouselContainer.querySelectorAll(".carousel-indicator")

  if (newIndex !== currentIndex && newIndex >= 0 && newIndex < slides.length) {
    // Update active slide
    slides[currentIndex]?.classList.remove("active")
    slides[newIndex]?.classList.add("active")

    // Update active indicator
    indicators[currentIndex]?.classList.remove("active")
    indicators[newIndex]?.classList.add("active")

    // Update current index
    carouselContainer.setAttribute("data-current-index", newIndex.toString())
  }
}

function onPointerDown(element: SimpleCard, event: PointerEvent) {
  if (!isCarouselSwipeArea(event)) return

  const swipeArea = event.target as HTMLElement
  const carouselSwipe = swipeArea.closest("[data-carousel-swipe]") as HTMLElement
  if (!carouselSwipe) return

  // Capture the pointer to this element (optional for test compatibility)
  if (typeof carouselSwipe.setPointerCapture === "function") {
    carouselSwipe.setPointerCapture(event.pointerId)
  }

  swipeStates.set(element, {
    startX: event.clientX,
    startY: event.clientY,
    currentX: event.clientX,
    currentY: event.clientY,
    isDragging: true,
    pointerId: event.pointerId
  })
}

function onPointerMove(element: SimpleCard, event: PointerEvent) {
  const state = swipeStates.get(element)
  if (!state || !state.isDragging || state.pointerId !== event.pointerId) return

  state.currentX = event.clientX
  state.currentY = event.clientY
}

function onPointerEnd(element: SimpleCard, event: PointerEvent) {
  const state = swipeStates.get(element)
  if (!state || !state.isDragging || state.pointerId !== event.pointerId) return

  const deltaX = state.currentX - state.startX
  const deltaY = state.currentY - state.startY
  const absDeltaX = Math.abs(deltaX)
  const absDeltaY = Math.abs(deltaY)

  // Only handle horizontal swipes (where horizontal movement is greater than vertical)
  if (absDeltaX > absDeltaY && absDeltaX > 50) {
    const carouselContainer = element.shadowRoot?.querySelector(".image.carousel")
    if (carouselContainer) {
      const currentIndex = parseInt(carouselContainer.getAttribute("data-current-index") || "0")
      const slides = carouselContainer.querySelectorAll(".carousel-slide")
      const totalSlides = slides.length

      let newIndex = currentIndex
      if (deltaX > 0) {
        // Swipe right - go to previous
        newIndex = (currentIndex - 1 + totalSlides) % totalSlides
      } else {
        // Swipe left - go to next
        newIndex = (currentIndex + 1) % totalSlides
      }

      navigateToSlide(element, newIndex)
    }
  }

  state.isDragging = false
  state.pointerId = null
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
