import type { SimpleCard } from "./SimpleCard"

/**
 * Interface to track scroll timeout for debouncing
 */
export interface ElementWithScrollTimeout extends SimpleCard {
  _scrollTimeout?: ReturnType<typeof setTimeout>
}

/**
 * Handles indicator button clicks to navigate to a specific slide
 */
export function handleIndicatorClick(element: SimpleCard, event: MouseEvent) {
  const target = event.target as HTMLElement
  const index = parseInt(target.getAttribute("data-carousel-indicator") || "0")
  const carouselImages = element.shadowRoot?.querySelector(".carousel-images")
  const slide = element.shadowRoot?.querySelector(`.carousel-slide[data-index="${index}"]`)

  if (carouselImages && slide) {
    slide.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
  }
}

/**
 * Handles scroll events on the carousel to update active indicator
 * Uses debouncing to avoid excessive updates
 */
export function onCarouselScroll(element: SimpleCard, event: Event) {
  const target = event.target as HTMLElement
  if (!target.classList.contains("carousel-images")) return

  const elementWithTimeout = element as ElementWithScrollTimeout

  // Debounce scroll updates to avoid too frequent updates
  clearTimeout(elementWithTimeout._scrollTimeout)
  elementWithTimeout._scrollTimeout = setTimeout(() => {
    updateCarouselIndicators(element)
  }, 100)
}

/**
 * Updates carousel indicators based on the current scroll position
 * Determines which slide is most visible and marks its indicator as active
 */
export function updateCarouselIndicators(element: SimpleCard) {
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
