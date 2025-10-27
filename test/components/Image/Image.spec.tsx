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
    const imageElement = nostoImage.shadowRoot?.querySelector("img")
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

  it("throws when breakpoints contains non-number values", () => {
    nostoImage = (<nosto-image src="https://example.com/image.jpg" width={300} height={200} />) as Image
    // Test with string values in breakpoints
    nostoImage.breakpoints = ["100", "200", "300"] as unknown as number[]
    expect(() => nostoImage.connectedCallback()).toThrowError(/All breakpoints must be positive finite numbers/)
  })

  it("throws when breakpoints contains invalid number values", () => {
    nostoImage = (<nosto-image src="https://example.com/image.jpg" width={300} height={200} />) as Image
    // Test with negative numbers
    nostoImage.breakpoints = [100, -200, 300]
    expect(() => nostoImage.connectedCallback()).toThrowError(/All breakpoints must be positive finite numbers/)

    // Test with zero
    nostoImage.breakpoints = [100, 0, 300]
    expect(() => nostoImage.connectedCallback()).toThrowError(/All breakpoints must be positive finite numbers/)

    // Test with Infinity
    nostoImage.breakpoints = [100, Infinity, 300]
    expect(() => nostoImage.connectedCallback()).toThrowError(/All breakpoints must be positive finite numbers/)

    // Test with NaN
    nostoImage.breakpoints = [100, NaN, 300]
    expect(() => nostoImage.connectedCallback()).toThrowError(/All breakpoints must be positive finite numbers/)
  })

  it("accepts valid breakpoints array", () => {
    nostoImage = (<nosto-image src="https://example.com/image.jpg" width={300} height={200} />) as Image
    nostoImage.breakpoints = [320, 640, 768, 1024, 1280]
    expect(() => nostoImage.connectedCallback()).not.toThrow()
  })

  it("handles breakpoints set via attribute", () => {
    nostoImage = (
      // @ts-expect-error Testing with string attribute that gets parsed to array
      <nosto-image src="https://example.com/image.jpg" width={300} height={200} breakpoints="[100, 300, 500]" />
    ) as Image
    expect(() => nostoImage.connectedCallback()).not.toThrow()
    expect(nostoImage.breakpoints).toEqual([100, 300, 500])
  })

  it("rerenders when attributes are updated", () => {
    nostoImage = (<nosto-image src={shopifyUrl} width={300} height={200} />) as Image
    document.body.appendChild(nostoImage)
    const oldSrcSet = nostoImage.shadowRoot?.querySelector("img")?.getAttribute("srcset")
    nostoImage.width = 400
    const newSrcSet = nostoImage.shadowRoot?.querySelector("img")?.getAttribute("srcset")
    expect(newSrcSet).not.toBe(oldSrcSet)
  })

  describe("Constrained Layout", () => {
    it("throws when width, height and aspectRadio are missing", () => {
      nostoImage = (<nosto-image src="https://example.com/image.jpg" />) as Image
      expect(() => nostoImage.connectedCallback()).toThrowError("At least one of 'width' or 'height' must be provided.")
    })

    it("renders an image with only width prop", () => {
      nostoImage = (<nosto-image src={shopifyUrl} width={300} />) as Image
      nostoImage.connectedCallback()
      assertImage(shopifyUrl)

      nostoImage = (<nosto-image src={bigCommerceUrl} width={300} />) as Image
      nostoImage.connectedCallback()
      assertImage(stencilUrlPrefix)
    })

    it("renders an image with only height prop", () => {
      nostoImage = (<nosto-image src={shopifyUrl} height={200} />) as Image
      nostoImage.connectedCallback()
      assertImage(shopifyUrl)

      nostoImage = (<nosto-image src={bigCommerceUrl} height={200} />) as Image
      nostoImage.connectedCallback()
      assertImage(stencilUrlPrefix)
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

      const imgElement = nostoImage.shadowRoot?.querySelector("img")
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

      const imgElement = nostoImage.shadowRoot?.querySelector("img")
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

      let imgElement = nostoImage.shadowRoot?.querySelector("img")
      expect(imgElement).toBeDefined()
      expect(imgElement!.getAttribute("alt")).toBe(altText)

      // Test sizes attribute
      const sizesValue = "(max-width: 768px) 100vw, 50vw"
      nostoImage = (<nosto-image src={shopifyUrl} width={400} aspectRatio={1.5} sizes={sizesValue} />) as Image
      nostoImage.connectedCallback()

      imgElement = nostoImage.shadowRoot?.querySelector("img")
      expect(imgElement).toBeDefined()
      expect(imgElement!.getAttribute("sizes")).toBe(sizesValue)

      // Test both alt and sizes attributes together
      const combinedAltText = "Hero banner image"
      const combinedSizesValue = "(max-width: 1200px) 100vw, 50vw"
      nostoImage = (
        <nosto-image src={shopifyUrl} width={800} height={400} alt={combinedAltText} sizes={combinedSizesValue} />
      ) as Image
      nostoImage.connectedCallback()

      imgElement = nostoImage.shadowRoot?.querySelector("img")
      expect(imgElement).toBeDefined()
      expect(imgElement!.getAttribute("alt")).toBe(combinedAltText)
      expect(imgElement!.getAttribute("sizes")).toBe(combinedSizesValue)
    })

    it("should correctly set fetchpriority attribute", () => {
      // Test fetchpriority="high"
      nostoImage = (<nosto-image src={shopifyUrl} width={300} height={200} fetchpriority="high" />) as Image
      nostoImage.connectedCallback()

      let imgElement = nostoImage.shadowRoot?.querySelector("img")
      expect(imgElement).toBeDefined()
      expect(imgElement!.getAttribute("fetchpriority")).toBe("high")

      // Test fetchpriority="low"
      nostoImage = (<nosto-image src={shopifyUrl} width={300} height={200} fetchpriority="low" />) as Image
      nostoImage.connectedCallback()

      imgElement = nostoImage.shadowRoot?.querySelector("img")
      expect(imgElement).toBeDefined()
      expect(imgElement!.getAttribute("fetchpriority")).toBe("low")

      // Test fetchpriority="auto"
      nostoImage = (<nosto-image src={shopifyUrl} width={300} height={200} fetchpriority="auto" />) as Image
      nostoImage.connectedCallback()

      imgElement = nostoImage.shadowRoot?.querySelector("img")
      expect(imgElement).toBeDefined()
      expect(imgElement!.getAttribute("fetchpriority")).toBe("auto")

      // Test without fetchpriority (should not have the attribute)
      nostoImage = (<nosto-image src={shopifyUrl} width={300} height={200} />) as Image
      nostoImage.connectedCallback()

      imgElement = nostoImage.shadowRoot?.querySelector("img")
      expect(imgElement).toBeDefined()
      expect(imgElement!.hasAttribute("fetchpriority")).toBe(false)
    })

    it("should correctly combine fetchpriority with other attributes", () => {
      // Test fetchpriority with alt and sizes
      const altText = "Priority image"
      const sizesValue = "(max-width: 768px) 100vw, 50vw"
      nostoImage = (
        <nosto-image src={shopifyUrl} width={800} height={400} alt={altText} sizes={sizesValue} fetchpriority="high" />
      ) as Image
      nostoImage.connectedCallback()

      const imgElement = nostoImage.shadowRoot?.querySelector("img")
      expect(imgElement).toBeDefined()
      expect(imgElement!.getAttribute("alt")).toBe(altText)
      expect(imgElement!.getAttribute("sizes")).toBe(sizesValue)
      expect(imgElement!.getAttribute("fetchpriority")).toBe("high")
    })
  })

  describe("Shadow DOM rendering", () => {
    it("should render image inside shadow DOM", () => {
      nostoImage = (<nosto-image src={shopifyUrl} width={300} height={200} />) as Image
      nostoImage.connectedCallback()

      // Verify shadow root exists
      expect(nostoImage.shadowRoot).toBeDefined()

      // Verify img is in shadow DOM, not in light DOM
      expect(nostoImage.querySelector("img")).toBeNull()
      expect(nostoImage.shadowRoot?.querySelector("img")).toBeDefined()
    })

    it("should have shadow root created in constructor", () => {
      nostoImage = (<nosto-image src={shopifyUrl} width={300} height={200} />) as Image

      expect(nostoImage.shadowRoot).toBeDefined()
    })
  })

  describe("Unstyled attribute", () => {
    it("should apply inline styles when unstyled is false/undefined", () => {
      nostoImage = (<nosto-image src={shopifyUrl} width={300} height={200} />) as Image
      nostoImage.connectedCallback()

      const imgElement = nostoImage.shadowRoot?.querySelector("img")
      expect(imgElement?.style.cssText).not.toBe("")
    })

    it("should skip inline styles when unstyled is true", () => {
      nostoImage = (<nosto-image src={shopifyUrl} width={300} height={200} unstyled />) as Image
      nostoImage.connectedCallback()

      const imgElement = nostoImage.shadowRoot?.querySelector("img")
      expect(imgElement?.style.cssText).toBe("")
    })
  })

  describe("Existing img child reuse", () => {
    it("should reuse existing img child when present in shadow DOM", () => {
      nostoImage = (<nosto-image src={shopifyUrl} width={300} height={200} />) as Image

      // Manually insert an img element into the existing shadow root
      const existingImg = document.createElement("img")
      existingImg.src = "https://example.com/old-image.jpg"
      existingImg.setAttribute("data-test-id", "existing-image")
      nostoImage.shadowRoot!.appendChild(existingImg)

      // Add event listener to verify it's preserved
      let clickCount = 0
      existingImg.addEventListener("click", () => clickCount++)

      // Call connectedCallback to trigger the update
      nostoImage.connectedCallback()

      // Verify the same img element is still there
      const imgElement = nostoImage.shadowRoot?.querySelector("img")
      expect(imgElement).toBe(existingImg)
      expect(imgElement?.getAttribute("data-test-id")).toBe("existing-image")

      // Verify attributes were updated correctly
      expect(imgElement?.src).toContain(shopifyUrl)
      expect(imgElement?.srcset).toBeDefined()

      // Verify event listener is preserved
      imgElement?.click()
      expect(clickCount).toBe(1)
    })

    it("should create new img child when none exists", () => {
      nostoImage = (<nosto-image src={shopifyUrl} width={300} height={200} />) as Image

      // Ensure shadow root exists but has no img initially
      expect(nostoImage.shadowRoot).toBeDefined()
      expect(nostoImage.shadowRoot?.querySelector("img")).toBeNull()

      // Call connectedCallback
      nostoImage.connectedCallback()

      // Verify new img was created in shadow DOM
      const imgElement = nostoImage.shadowRoot?.querySelector("img")
      expect(imgElement).toBeDefined()
      expect(imgElement?.src).toContain(shopifyUrl)
      expect(imgElement?.srcset).toBeDefined()
    })
  })
})
