import { MultiLanguageText } from "@/entity/language"

export type DisplayOrder = {
  type: DisplayOrderType
  ids: string[]
  createdAt: number
  updatedAt: number
}

export enum DisplayOrderType {
  TOP_BANNER = 'top-banner',
  TOP_PICKUP = 'top-pickup',
  CAMPAIGN_BANNER = 'campaign-banner',
  PRODUCT_CATEGORY = 'product-category',
}

export type TopBanner = {
  bannerId: string
  image: string
  title: MultiLanguageText
  description: MultiLanguageText
  link: string
  startTime: number | null
  endTime: number | null
  createdAt: number
  updatedAt: number
}

export type TopPickup = {
  pickupId: string
  image: string
  link: string
  text: MultiLanguageText
  startTime: number | null
  endTime: number | null
  type: TopPickUpType
  createdAt: number
  updatedAt: number
}


export enum TopPickUpType {
  NONE = 'none',
  SOLD_OUT = 'sold-out',
}

export type CampaignBanner = {
  campaignId: string
  image: string
  link: string
  startTime: number | null
  endTime: number | null
  createdAt: number
  updatedAt: number
}
