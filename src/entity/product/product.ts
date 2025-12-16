// Language
import { MultiLanguageText } from "@/entity/language"
import { Attribute } from "@/entity/product/contract"

// ContractCreate
export type ProductGroup = {
  productGroupId: string
  townId: string
  businessId: string
  productIds: string[]
  createdAt: number
  updatedAt: number
}

export type ProductItem = {
  productId: string                // 商品ID
  productGroupId: string           // 商品グループID
  title: MultiLanguageText         // 多言語対応のタイトル
  description: MultiLanguageText   // 多言語対応の商品説明文
  price: number                    // 価格
  images: string[]                 // 画像URL
  stock: number                    // 在庫数(必ず上限あり)
  hideStock: boolean               // 在庫数を非表示にするか
  deliveryText: MultiLanguageText  // 多言語対応の配送について
  paymentText: MultiLanguageText   // 多言語対応の支払いについて
  buyLimit: number | null          // 購入可能な最大数
  categoryIds: string[]            // カテゴリー
  formIds: string[]                // フォームID
  chatEnabled: boolean             // 事前相談を可能にするか
  purchaseConfirmations?: MultiLanguageText[]  // 購入前に確認するチェック項目
  startTime: number | null         // 公開開始日時（nullの場合は常に公開）
  endTime: number | null           // 公開終了日時（nullの場合は常に公開）
  isDraft: boolean                 // 下書き状態かどうか
  townId: string                   // 自治体ID
  businessId: string               // 事業者ID
  chainId: number | null           // チェーンID
  contractAddress: string | null   // コントラクトアドレス
  createdAt: number                // 作成日時
  updatedAt: number                // 更新日時
}

export type ProductCategory = {
  categoryId: string               // カテゴリーID
  name: MultiLanguageText          // 多言語対応のカテゴリー名
  description: MultiLanguageText   // 多言語対応の説明文
  icon: string                     // アイコンURL
  createdAt: number                // 作成日時
  updatedAt: number                // 更新日時
}

export type SimpleProductGroup = {
  productGroupId: string
  townId: string
  businessId: string
  createdAt: number
  updatedAt: number
}

export type SimpleProductItem = {
  productId: string
  productGroupId: string
  title: MultiLanguageText
  description: MultiLanguageText
  stock: number
  townId: string
  businessId: string
  hideStock: boolean
  hasStock: boolean
  deliveryText: MultiLanguageText
  paymentText: MultiLanguageText
  buyLimit: number | null
  categoryIds: string[]
  chatEnabled: boolean
  purchaseConfirmations: MultiLanguageText[]  // 購入前に確認するチェック項目
  price: number
  images: string[]
  createdAt: number
  updatedAt: number
}
export type SearchProductItem = {
  productId: string
  productGroupId: string
  title: MultiLanguageText
  description: MultiLanguageText
  stock: number
  townId: string
  businessId: string
  hideStock: boolean
  categoryIds: string[]
  chatEnabled: boolean
  price: number
  images: string[]
  createdAt: number
  updatedAt: number
}

export type SimpleProductCategory = {
  categoryId: string
  name: MultiLanguageText
  description: MultiLanguageText
  icon: string
}

export type OwnProduct = {
  userId: string
  productGroupId: string
  productId: string
  tokenId: number
  townId: string
  businessId: string
  status: OwnProductStatus
  adminStatus: AdminProductStatus
  attributes: Attribute[]
  createdAt: number
  updatedAt: number
}

export type OwnAssetProduct = {
  address: string
  userId: string
  productGroupId: string
  productId: string
  tokenId: number
  townId: string
  businessId: string
  isOwner: boolean
  adminStatus: AdminProductStatus
  attributes: Attribute[]
  createdAt: number
  updatedAt: number
}

export type SimpleOwnProduct = {
  userId: string
  // OwnProduct
  productGroupId: string
  productId: string
  tokenId: number
  townId: string
  businessId: string
  status: OwnProductStatus
  adminStatus: AdminProductStatus
  attributes: Attribute[]
  categoryIds: string[]
  // Product
  title: MultiLanguageText
  image: string
  createdAt: number
  updatedAt: number
}

export enum OwnProductStatus {
  PENDING_PAYMENT = "PENDING_PAYMENT",   // 入金待ち
  PURCHASED = "PURCHASED",               // 購入済みでNFT未発行
  NFT_MINTED = "NFT_MINTED",             // NFT発行済
  NFT_TRANSFERRED = "NFT_TRANSFERRED",   // NFT発行済だが別の人にトランスファー済み
  CANCELED = "CANCELED",                 // キャンセル済み
}

export enum AdminProductStatus {
  CONSULTATION = "CONSULTATION",         // 相談
  IN_USE = "IN_USE",                     // 使う
  COMPLETED = "COMPLETED"                // 完了
}
