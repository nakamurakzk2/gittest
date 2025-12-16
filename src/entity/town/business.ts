import { MultiLanguageText } from "@/entity/language"

export type Business = {
  businessId: string
  townId: string
  name: string
  description: MultiLanguageText
  createdAt: number
  updatedAt: number
}

export type SimpleBusiness = {
  businessId: string
  name: string
  description: MultiLanguageText
}
