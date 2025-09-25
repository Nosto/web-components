import { describe, it, expect } from "vitest"
import { Image } from "@/components/Image/Image"
import { createElement } from "../../utils/jsx"

// TODO: extend this to check the presence of width and height attributes in resulting URL
describe("Image", () => {
  let nostoImage: Image
  const shopifyUrl = "https://cdn.shopify.com/s/files/1/1183/1048/products/boat-shoes.jpeg?v=1459175177"
  const bigCommerceUrl =
    "https://cdn11.bigcommerce.com/s-bo4yyk7o1j/products/15493/images/80390/5SqIsKoR7VMPHGrsnseGPkhhpWHT9tLcY7Uwop7FCMzm5jcxKgU2d7P7zbgqcs8r__09669.1741105378.1280.1280.jpg?c=2"
  const stencilUrlPrefix = "https://cdn11.bigcommerce.com/s-bo4yyk7o1j/images/stencil/"

  function assertNoNullOrUndefinedAttributes(imgElement: HTMLImageElement) {
    const attributes = imgElement.attributes
    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes[i]
      expect(attr.value).not.toBe("null")
      expect(attr.value).not.toBe("undefined")
    }
  }

  function assertImage(src: string) {
    const imageElement = nostoImage.querySelector("img")
    expect(imageElement?.src).toContain(src)
    expect(imageElement?.srcset).toBeDefined()
    expect(imageElement?.sizes).toBeDefined()
    expect(imageElement?.style).toBeDefined()
  }

  it("throws when invalid layout value is used", () => {
    // @ts-expect-error testing invalid layout value
    nostoImage = (<nosto-image src="https://example.com/image.jpg" layout="invalid" />) as Image
    expect(() => nostoImage.connectedCallback()).toThrowError(/Invalid layout/)
  })

  it("rerenders when attributes are updated", () => {
    nostoImage = (<nosto-image src={shopifyUrl} width={300} height={200} />) as Image
    document.body.appendChild(nostoImage)
    const oldSrcSet = nostoImage.querySelector("img")?.getAttribute("srcset")
    nostoImage.width = 400
    const newSrcSet = nostoImage.querySelector("img")?.getAttribute("srcset")
    expect(newSrcSet).not.toBe(oldSrcSet)
  })

  describe("Constrained Layout", () => {
    it("throws when width, height and aspectRadio are missing", () => {
      nostoImage = (<nosto-image src="https://example.com/image.jpg" />) as Image
      expect(() => nostoImage.connectedCallback()).toThrowError(
        "Either 'width' and 'aspectRatio' or 'height' and 'aspectRatio' must be provided."
      )
    })

    it("throws when only width prop is provided", () => {
      nostoImage = (<nosto-image src="https://example.com/image.jpg" width={300} />) as Image
      expect(() => nostoImage.connectedCallback()).toThrowError(
        "Either 'width' and 'aspectRatio' or 'height' and 'aspectRatio' must be provided."
      )
    })

    it("throws when only height prop is provided", () => {
      nostoImage = (<nosto-image src="https://example.com/image.jpg" height={200} />) as Image
      expect(() => nostoImage.connectedCallback()).toThrowError(
        "Either 'width' and 'aspectRatio' or 'height' and 'aspectRatio' must be provided."
      )
    })

    it("renders an image with srcset, sizes and style with width and height props", () => {
      nostoImage = (<nosto-image src={shopifyUrl} width={300} height={200} />) as Image
      nostoImage.connectedCallback()
      assertImage(shopifyUrl)

      nostoImage = (<nosto-image src={bigCommerceUrl} width={300} height={200} />) as Image
      nostoImage.connectedCallback()
      assertImage(stencilUrlPrefix)
    })

    it("renders an image with srcset, sizes and style with width and aspect ratio props", () => {
      nostoImage = (<nosto-image src={shopifyUrl} width={800} aspectRatio={1.77} />) as Image
      nostoImage.connectedCallback()
      assertImage(shopifyUrl)

      nostoImage = (<nosto-image src={bigCommerceUrl} width={800} aspectRatio={1.77} />) as Image
      nostoImage.connectedCallback()
      assertImage(stencilUrlPrefix)
    })

    it("renders an image with srcset, sizes and style with height and aspect ratio props", () => {
      nostoImage = (<nosto-image src={shopifyUrl} height={300} aspectRatio={1.33} />) as Image
      nostoImage.connectedCallback()
      assertImage(shopifyUrl)

      nostoImage = (<nosto-image src={bigCommerceUrl} height={300} aspectRatio={1.33} />) as Image
      nostoImage.connectedCallback()
      assertImage(stencilUrlPrefix)
    })
  })

  describe("FullWidth Layout", () => {
    it("renders an image with srcset, when no width, height or aspectRatio props are provided", () => {
      nostoImage = (<nosto-image src={shopifyUrl} layout="fullWidth" />) as Image
      nostoImage.connectedCallback()
      assertImage(shopifyUrl)

      nostoImage = (<nosto-image src={bigCommerceUrl} layout="fullWidth" />) as Image
      nostoImage.connectedCallback()
      assertImage(stencilUrlPrefix)
    })

    it("renders an image with srcset, sizes and style with only height prop", () => {
      nostoImage = (<nosto-image src={shopifyUrl} height={300} layout="fullWidth" />) as Image
      nostoImage.connectedCallback()
      assertImage(shopifyUrl)

      nostoImage = (<nosto-image src={bigCommerceUrl} height={300} layout="fullWidth" />) as Image
      nostoImage.connectedCallback()
      assertImage(stencilUrlPrefix)
    })

    it("renders an image with srcset, sizes and style with height and aspectRatio prop", () => {
      nostoImage = (<nosto-image src={shopifyUrl} width={300} aspectRatio={1.33} layout="fullWidth" />) as Image
      nostoImage.connectedCallback()
      assertImage(shopifyUrl)

      nostoImage = (<nosto-image src={bigCommerceUrl} width={300} aspectRatio={1.33} layout="fullWidth" />) as Image
      nostoImage.connectedCallback()
      assertImage(stencilUrlPrefix)
    })
  })

  describe("Attribute handling", () => {
    it("should not set null or undefined attributes on img element", () => {
      // Create an image with some null/undefined properties
      nostoImage = (<nosto-image src={shopifyUrl} width={300} height={200} crop={undefined} />) as Image
      nostoImage.connectedCallback()

      const imgElement = nostoImage.querySelector("img")
      expect(imgElement).toBeDefined()

      // Check that no attributes have null or undefined string values
      assertNoNullOrUndefinedAttributes(imgElement!)

      // Ensure width and height attributes don't exist when unpic transform returns undefined values
      // Note: The crop: undefined parameter doesn't affect width/height - they're undefined because
      // the unpic transform removes them from props and puts sizing info in the style instead
      expect(imgElement!.hasAttribute("width")).toBe(false)
      expect(imgElement!.hasAttribute("height")).toBe(false)
    })

    it("should set attributes for valid non-null values", () => {
      // Create an image with all valid properties
      nostoImage = (<nosto-image src={shopifyUrl} width={400} height={300} />) as Image
      nostoImage.connectedCallback()

      const imgElement = nostoImage.querySelector("img")
      expect(imgElement).toBeDefined()

      // Check that valid attributes are present
      expect(imgElement!.hasAttribute("src")).toBe(true)
      expect(imgElement!.hasAttribute("srcset")).toBe(true)
      expect(imgElement!.hasAttribute("sizes")).toBe(true)
      expect(imgElement!.hasAttribute("loading")).toBe(true)
      expect(imgElement!.hasAttribute("decoding")).toBe(true)

      // Verify no null/undefined string values
      assertNoNullOrUndefinedAttributes(imgElement!)
    })

    it("should correctly set alt and sizes attributes", () => {
      // Test alt attribute
      const altText = "Product image description"
      nostoImage = (<nosto-image src={shopifyUrl} width={300} height={200} alt={altText} />) as Image
      nostoImage.connectedCallback()

      let imgElement = nostoImage.querySelector("img")
      expect(imgElement).toBeDefined()
      expect(imgElement!.getAttribute("alt")).toBe(altText)

      // Test sizes attribute
      const sizesValue = "(max-width: 768px) 100vw, 50vw"
      nostoImage = (<nosto-image src={shopifyUrl} width={400} aspectRatio={1.5} sizes={sizesValue} />) as Image
      nostoImage.connectedCallback()

      imgElement = nostoImage.querySelector("img")
      expect(imgElement).toBeDefined()
      expect(imgElement!.getAttribute("sizes")).toBe(sizesValue)

      // Test both alt and sizes attributes together
      const combinedAltText = "Hero banner image"
      const combinedSizesValue = "(max-width: 1200px) 100vw, 50vw"
      nostoImage = (
        <nosto-image src={shopifyUrl} width={800} height={400} alt={combinedAltText} sizes={combinedSizesValue} />
      ) as Image
      nostoImage.connectedCallback()

      imgElement = nostoImage.querySelector("img")
      expect(imgElement).toBeDefined()
      expect(imgElement!.getAttribute("alt")).toBe(combinedAltText)
      expect(imgElement!.getAttribute("sizes")).toBe(combinedSizesValue)
    })
  })

  describe("Breakpoints", () => {
    it("accepts breakpoints property and passes them to transform", () => {
      const customBreakpoints = [320, 640, 768, 1024, 1280]
      nostoImage = (<nosto-image src={shopifyUrl} width={800} aspectRatio={1.5} />) as Image

      // Set breakpoints property directly (since JSX would stringify it as comma-separated)
      nostoImage.breakpoints = customBreakpoints
      nostoImage.connectedCallback()

      // Verify that the component has set the breakpoints property
      expect(nostoImage.breakpoints).toEqual(customBreakpoints)

      // Verify the image element is created (this confirms transform worked)
      const imgElement = nostoImage.querySelector("img")
      expect(imgElement).toBeDefined()
      expect(imgElement!.hasAttribute("src")).toBe(true)
      expect(imgElement!.hasAttribute("srcset")).toBe(true)
    })

    it("handles breakpoints via attribute", () => {
      nostoImage = (<nosto-image src={shopifyUrl} width={800} aspectRatio={1.5} />) as Image

      // Set breakpoints via attribute (JSON string)
      nostoImage.setAttribute("breakpoints", "[400, 800, 1200]")
      expect(nostoImage.breakpoints).toEqual([400, 800, 1200])

      nostoImage.connectedCallback()
      const imgElement = nostoImage.querySelector("img")
      expect(imgElement).toBeDefined()
      expect(imgElement!.hasAttribute("srcset")).toBe(true)
    })

    it("handles invalid breakpoints gracefully", () => {
      nostoImage = (<nosto-image src={shopifyUrl} width={800} aspectRatio={1.5} />) as Image

      // Set invalid JSON
      nostoImage.setAttribute("breakpoints", "invalid json")
      expect(nostoImage.breakpoints).toBeUndefined()

      // Component should still work
      nostoImage.connectedCallback()
      const imgElement = nostoImage.querySelector("img")
      expect(imgElement).toBeDefined()
    })

    it("works without breakpoints (uses defaults)", () => {
      nostoImage = (<nosto-image src={shopifyUrl} width={800} aspectRatio={1.5} />) as Image
      nostoImage.connectedCallback()

      // Verify default behavior still works
      const imgElement = nostoImage.querySelector("img")
      expect(imgElement).toBeDefined()
      expect(imgElement!.hasAttribute("srcset")).toBe(true)
      expect(nostoImage.breakpoints).toBeUndefined()
    })
  })
})
