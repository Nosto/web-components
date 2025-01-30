import { beforeEach, describe, expect, it } from "vitest"
import { NostoSku } from "@/components/NostoSku"
import skuOptions from "../sku-options"

describe("NostoSku", () => {
  let skuComponent: NostoSku

  beforeEach(() => {
    skuComponent = new NostoSku()
    document.body.innerHTML = ""
  })

  it("should throw error when n-sku-items attribute is not setup", () => {
    skuComponent.innerHTML = `
            <div class="sku-color">
                <span n-sku-item n-sku-item-id="1">Red</span>
                <span n-sku-item n-sku-item-id="2" selected>Blue</span>
            </div>
    `

    expect(() => skuComponent.connectedCallback()).toThrow(
      "No elements with [n-sku-items] attribute found. This attribute is required on the wrapper element of SKU options"
    )
  })

  it("should throw error when n-sku-items attribute is not supplied the option type value", () => {
    skuComponent.innerHTML = `
            <div n-sku-items class="sku-color">
                <span n-sku-item n-sku-item-id="1">Red</span>
                <span n-sku-item n-sku-item-id="2" selected>Blue</span>
            </div>
    `

    expect(() => skuComponent.connectedCallback()).toThrow(
      "SKU option type value not specified for [n-sku-items] attribute"
    )
  })

  it("should throw error when n-sku-item attribute is not setup", () => {
    skuComponent.innerHTML = `
            <div n-sku-items="color" class="sku-color">
                <span n-sku-item-id="1">Red</span>
                <span n-sku-item-id="2" selected>Blue</span>
            </div>
    `

    expect(() => skuComponent.connectedCallback()).toThrow(
      "No elements with [n-sku-item] attribute found. All sku option items should have this attribute"
    )
  })

  it("should throw error when n-sku-item-id attribute is not setup", () => {
    skuComponent.innerHTML = `
            <div n-sku-items="color" class="sku-color">
                <span n-sku-item>Red</span>
                <span n-sku-item selected>Blue</span>
            </div>
    `

    expect(() => skuComponent.connectedCallback()).toThrow(
      "[n-sku-item-id] not setup for sku options. This attribute should be assigned the id of the sku"
    )
  })

  it("should throw error when n-sku-item-id attribute is not supplied with SKU id", () => {
    skuComponent.innerHTML = `
            <div n-sku-items="color" class="sku-color">
                <span n-sku-item n-sku-item-id>Red</span>
                <span n-sku-item n-sku-item-id selected>Blue</span>
            </div>
    `

    expect(() => skuComponent.connectedCallback()).toThrow(
      "[n-sku-item-id] not setup for sku options. This attribute should be assigned the id of the sku"
    )
  })

  it("should extract option value from text content", () => {
    skuComponent.innerHTML = `
            <div n-sku-items="color" class="sku-color">
                <span n-sku-item n-sku-item-id="1">Red</span>
                <span n-sku-item n-sku-item-id="2" selected>Blue</span>
            </div>
    `

    expect(() => skuComponent.connectedCallback()).not.toThrow()
  })

  it("Should handle multiple Sku Selections", () => {
    skuComponent.innerHTML = `
            <div n-sku-items="color" n-next-layer-option="size" class="sku-color">
                <span n-sku-item n-sku-item-id="13">Red</span>
                <span n-sku-item n-sku-item-id="21" selected>Blue</span>
            </div>
            <div n-sku-items="red-size" n-option-type="size" class="sku-size" style="display: none;">
                <span n-sku-item-id="13" n-sku-item>S</span>
                <span n-sku-item-id="12" n-sku-item>M</span>
                <span n-sku-item-id="11" n-sku-item>L</span>
                <span n-sku-item-id="14" n-sku-item>XL</span>
            </div>
            <div n-sku-items="blue-size" n-option-type="size" class="sku-size">
                <span n-sku-item n-sku-item-id="21" selected>M</span>
                <span n-sku-item n-sku-item-id="22">L</span>
            </div>
    `

    skuComponent.setAttribute("n-skus", JSON.stringify(skuOptions))
    skuComponent.setAttribute("depth", "2")

    expect(() => skuComponent.connectedCallback()).not.toThrow()

    const colorElement = skuComponent.querySelector(".sku-color")
    const blueSizeElement = skuComponent.querySelector<HTMLElement>('[n-sku-items="blue-size"]')
    const redSizeElement = skuComponent.querySelector<HTMLElement>('[n-sku-items="red-size"]')

    expect(colorElement).toBeTruthy()
    expect(blueSizeElement).toBeTruthy()
    expect(redSizeElement).toBeTruthy()
    expect(blueSizeElement!.style.display).not.toBe("none")
    expect(redSizeElement!.style.display).toBe("none")

    // select Burgundy color
    colorElement!.querySelector<HTMLElement>("[n-sku-item]:nth-child(1)")?.click()

    expect(blueSizeElement!.style.display).toBe("none")
    expect(redSizeElement!.style.display).not.toBe("none")

    //assert side-effects
    const colorSelectedElement = colorElement!.querySelector<HTMLElement>("[n-sku-item]:nth-child(1)[selected]")
    expect(colorSelectedElement).toBeTruthy()

    const newSelectionOptions = skuComponent.querySelector<HTMLElement>('[n-sku-items="red-size"]')
    expect(newSelectionOptions).toBeTruthy()
    expect(newSelectionOptions!.style.display).toBe("flex")

    const existingSelectionOptions = skuComponent.querySelector<HTMLElement>('[n-sku-items="blue-size"]')
    expect(existingSelectionOptions).toBeTruthy()
    expect(existingSelectionOptions!.style.display).toBe("none")

    const sizes = redSizeElement!.querySelectorAll("[n-sku-item]")
    expect(sizes.length).toBe(4)

    const blueSizeSelectedElement = blueSizeElement!.querySelector<HTMLElement>("[n-sku-item]:nth-child(1)[selected]")
    expect(blueSizeSelectedElement).toBeFalsy()

    const sizeSelectedElement = redSizeElement!.querySelector<HTMLElement>("[n-sku-item]:nth-child(1)[selected]")
    expect(sizeSelectedElement).toBeTruthy()

    const sizesForRed = Array.from(redSizeElement!.querySelectorAll("[n-sku-item]")).map(
      element => element.textContent!
    )
    expect(sizesForRed).toEqual(["S", "M", "L", "XL"])
  })
})
