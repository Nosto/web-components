import { createElement } from "@/templating/jsx"
import type { SimpleCard } from "./SimpleCard"
import type { ShopifyProduct } from "@/shopify/graphql/types"
import { generateImgHtml } from "./markup"

export function generateCarouselHTML(element: SimpleCard, product: ShopifyProduct): HTMLElement {
  const images = product.images
  return (
    <div class="image carousel" part="image">
      <div class="carousel-images">
        {images.map(img => (
          <div class="carousel-slide">{generateImgHtml(img, product.title, "img carousel-img", element.sizes)}</div>
        ))}
      </div>
      <div class="carousel-indicators" part="carousel-indicators">
        {images.map((_, index) => (
          <button
            class={`carousel-indicator ${index === 0 ? "active" : ""}`}
            part="carousel-indicator"
            aria-label={`Go to image ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  )
}

export function handleIndicatorClick(element: SimpleCard, event: MouseEvent) {
  const target = event.target as HTMLElement
  const indicators = element.shadowRoot?.querySelectorAll(".carousel-indicator")
  const index = indicators ? Array.from(indicators).indexOf(target) : -1

  if (index === -1) return

  const carouselImages = element.shadowRoot?.querySelector(".carousel-images")
  const slide = carouselImages?.querySelector(`.carousel-slide:nth-child(${index + 1})`)

  if (slide) {
    slide.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
    setTimeout(() => updateCarouselIndicators(element), 300)
  }
}

export function onCarouselScroll(element: SimpleCard, event: Event) {
  const target = event.target as HTMLElement
  if (!target.classList.contains("carousel-images")) return

  updateCarouselIndicators(element)
}

export function updateCarouselIndicators(element: SimpleCard) {
  const carouselImages = element.shadowRoot?.querySelector(".carousel-images") as HTMLElement
  if (!carouselImages) return

  const slides = carouselImages.querySelectorAll(".carousel-slide")
  const indicators = element.shadowRoot?.querySelectorAll(".carousel-indicator")
  if (!slides.length || !indicators) return

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

  indicators.forEach((indicator, index) => {
    indicator.classList.toggle("active", index === closestIndex)
  })
}
