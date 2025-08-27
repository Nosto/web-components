import { customElement } from "../decorators"
import { JSONResult } from "@nosto/nosto-js/client"
import { NostoBaseCampaign } from "../NostoBaseCampaign/NostoBaseCampaign"

/**
 * Carousel layout campaign component with Swiper structure.
 */
@customElement("nosto-carousel-campaign")
export class NostoCarouselCampaign extends NostoBaseCampaign {
  protected async render(campaign: JSONResult) {
    const container = document.createElement("swiper-container")
    container.className = "nosto-carousel"

    const productSlides = campaign.products.map(product => {
      const slide = document.createElement("swiper-slide")
      slide.appendChild(this.createProductElement(product))
      return slide
    })
    container.append(...productSlides)

    this.replaceChildren(container)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-carousel-campaign": NostoCarouselCampaign
  }
}
