import { describe, it, expect } from "vitest"
import type {
  CampaignProps,
  ControlProps,
  DynamicCardProps,
  ImageProps,
  Crop,
  PopupProps,
  ProductProps,
  SectionCampaignProps,
  SimpleCardProps,
  SkuOptionsProps,
  VariantSelectorProps
} from "../src/main"

describe("Props types exports", () => {
  it("should export CampaignProps type", () => {
    const props: CampaignProps = {
      placement: "test-placement"
    }
    expect(props.placement).toBe("test-placement")
  })

  it("should export ControlProps type", () => {
    const props: ControlProps = {}
    expect(props).toBeDefined()
  })

  it("should export DynamicCardProps type", () => {
    const props: DynamicCardProps = {
      handle: "test-handle"
    }
    expect(props.handle).toBe("test-handle")
  })

  it("should export ImageProps type", () => {
    const props: ImageProps = {
      src: "https://example.com/image.jpg"
    }
    expect(props.src).toBe("https://example.com/image.jpg")
  })

  it("should export Crop type", () => {
    const crop: Crop = "center"
    expect(crop).toBe("center")
  })

  it("should export PopupProps type", () => {
    const props: PopupProps = {
      name: "test-popup"
    }
    expect(props.name).toBe("test-popup")
  })

  it("should export ProductProps type", () => {
    const props: ProductProps = {
      productId: "123",
      recoId: "reco-123"
    }
    expect(props.productId).toBe("123")
  })

  it("should export SectionCampaignProps type", () => {
    const props: SectionCampaignProps = {
      placement: "test-placement",
      section: "test-section"
    }
    expect(props.placement).toBe("test-placement")
  })

  it("should export SimpleCardProps type", () => {
    const props: SimpleCardProps = {
      handle: "test-handle"
    }
    expect(props.handle).toBe("test-handle")
  })

  it("should export SkuOptionsProps type", () => {
    const props: SkuOptionsProps = {
      name: "test-option"
    }
    expect(props.name).toBe("test-option")
  })

  it("should export VariantSelectorProps type", () => {
    const props: VariantSelectorProps = {
      handle: "test-handle"
    }
    expect(props.handle).toBe("test-handle")
  })
})
