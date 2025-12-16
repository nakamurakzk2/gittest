import { MultiLanguageText } from "@/entity/language"
import { SimpleProductItem } from "@/entity/product/product"
import { SimpleBusiness } from "./business"

export type Town = {
  townId: string
  name: MultiLanguageText
  description: MultiLanguageText
  image: string
  bannerImage: string
  headerImage: string
  mapImage: string
  prefCode: number
}

export type SimpleTown = {
  townId: string
  name: MultiLanguageText
  description: MultiLanguageText
  image: string
  bannerImage: string
  headerImage: string
  mapImage: string
  prefCode: number
}

export type TownPageItem = {
  simpleTown: SimpleTown
  simpleProductItems: SimpleProductItem[]
  simpleBusinesses: SimpleBusiness[]
}