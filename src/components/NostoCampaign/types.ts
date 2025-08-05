import { AttributedCampaignResult } from "@nosto/nosto-js/client"

export type Renderer = (rec: AttributedCampaignResult, target: HTMLElement) => Promise<void>
