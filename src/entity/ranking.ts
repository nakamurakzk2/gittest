import { MultiLanguageText } from "@/entity/language"
import { ProductCategory } from "@/entity/product/product"

export type DailyProductRanking = {
  term: number
  month: number
  items: ProductRankingItem[]
  createdAt: number
}

export type MonthlyProductRanking = {
  term: number
  month: number
  isLastDay: boolean
  items: ProductRankingItem[]
  createdAt: number
}

export type AllTimeProductRanking = {
  term: number
  month: number
  year: number
  isLastDay: boolean
  items: ProductRankingItem[]
  createdAt: number
}


export type ProductRankingItem = {
  rank: number
  productId: string
  totalAmount: number
  productCreatedAt: number
}


export type SimpleProductRankingItem = {
  rank: number
  productId: string
  productGroupId: string
  title: MultiLanguageText
  description: MultiLanguageText
  image: string
  price: number
  categories: ProductCategory[]
  townId: string
  businessId: string
}
