import { describe, it, expect, beforeEach } from "vitest"
import { NostoImage } from "@/components/NostoImage/NostoImage"

// TODO: extend this to check the presence of width and height attributes in resulting URL
describe("NostoImage", () => {
  let nostoImage: NostoImage
  const shopifyUrl = "https://cdn.shopify.com/s/files/1/1183/1048/products/boat-shoes.jpeg?v=1459175177"
  const bigCommerceUrl =
    "https://cdn11.bigcommerce.com/s-bo4yyk7o1j/products/15493/images/80390/5SqIsKoR7VMPHGrsnseGPkhhpWHT9tLcY7Uwop7FCMzm5jcxKgU2d7P7zbgqcs8r__09669.1741105378.1280.1280.jpg?c=2"
  const stencilUrlPrefix = "https://cdn11.bigcommerce.com/s-bo4yyk7o1j/images/stencil/"

  // Register the custom element before tests
  beforeEach(() => {
    document.body.innerHTML = ""
  })

  function initComp(attrs: Record<string, string> = {}) {
    nostoImage = new NostoImage()
    Object.assign(nostoImage, attrs)
    return nostoImage
  }

  function assertImage(src: string) {
    const imageElement = nostoImage.querySelector("img")
    expect(imageElement?.src).toContain(src)
    expect(imageElement?.srcset).toBeDefined()
    expect(imageElement?.sizes).toBeDefined()
    expect(imageElement?.style).toBeDefined()
  }

  it("throws when invalid layout value is used", () => {
    initComp({ src: "https://example.com/image.jpg", layout: "invalid" })
    expect(() => nostoImage.connectedCallback()).toThrowError(/Invalid layout/)
  })

  describe("Constrained Layout", () => {
    it("throws when width, height and aspectRadio are missing", () => {
      initComp({ src: "https://example.com/image.jpg" })
      expect(() => nostoImage.connectedCallback()).toThrowError(
        "Either 'width' and 'aspectRatio' or 'height' and 'aspectRatio' must be provided."
      )
    })

    it("throws when only width prop is provided", () => {
      initComp({ src: "https://example.com/image.jpg" })
      expect(() => nostoImage.connectedCallback()).toThrowError(
        "Either 'width' and 'aspectRatio' or 'height' and 'aspectRatio' must be provided."
      )
    })

    it("throws when only height prop is provided", () => {
      initComp({ src: "https://example.com/image.jpg" })
      expect(() => nostoImage.connectedCallback()).toThrowError(
        "Either 'width' and 'aspectRatio' or 'height' and 'aspectRatio' must be provided."
      )
    })

    it("renders an image with srcset, sizes and style with width and height props", () => {
      initComp({ src: shopifyUrl, width: "300", height: "200" })
      nostoImage.connectedCallback()
      assertImage(shopifyUrl)

      initComp({ src: bigCommerceUrl, width: "300", height: "200" })
      nostoImage.connectedCallback()
      assertImage(stencilUrlPrefix)
    })

    it("renders an image with srcset, sizes and style with width and aspect ratio props", () => {
      initComp({ src: shopifyUrl, width: "800", aspectRatio: "1.77" })
      nostoImage.connectedCallback()
      assertImage(shopifyUrl)

      initComp({ src: bigCommerceUrl, width: "800", aspectRatio: "1.77" })
      nostoImage.connectedCallback()
      assertImage(stencilUrlPrefix)
    })

    it("renders an image with srcset, sizes and style with height and aspect ratio props", () => {
      initComp({ src: shopifyUrl, height: "300", aspectRatio: "1.33" })
      nostoImage.connectedCallback()
      assertImage(shopifyUrl)

      initComp({ src: bigCommerceUrl, height: "300", aspectRatio: "1.33" })
      nostoImage.connectedCallback()
      assertImage(stencilUrlPrefix)
    })
  })

  describe("FullWidth Layout", () => {
    it("renders an image with srcset, when no width, height or aspectRatio props are provided", () => {
      initComp({ src: shopifyUrl, layout: "fullWidth" })
      nostoImage.connectedCallback()
      assertImage(shopifyUrl)

      initComp({ src: bigCommerceUrl, layout: "fullWidth" })
      nostoImage.connectedCallback()
      assertImage(stencilUrlPrefix)
    })

    it("renders an image with srcset, sizes and style with only height prop", () => {
      initComp({ src: shopifyUrl, height: "300", layout: "fullWidth" })
      nostoImage.connectedCallback()
      assertImage(shopifyUrl)

      initComp({ src: bigCommerceUrl, height: "300", layout: "fullWidth" })
      nostoImage.connectedCallback()
      assertImage(stencilUrlPrefix)
    })

    it("renders an image with srcset, sizes and style with height and aspectRatio prop", () => {
      initComp({ src: shopifyUrl, width: "300", aspectRatio: "1.33", layout: "fullWidth" })
      nostoImage.connectedCallback()
      assertImage(shopifyUrl)

      initComp({ src: bigCommerceUrl, width: "300", aspectRatio: "1.33", layout: "fullWidth" })
      nostoImage.connectedCallback()
      assertImage(stencilUrlPrefix)
    })
  })
})
