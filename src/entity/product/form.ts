// Language
import { MultiLanguageText } from "@/entity/language"
import { ProductItem } from "@/entity/product/product"

// フォーム回答項目のタイプ
export enum FormFieldType {
  TEXT_SHORT = "text_short",        // テキスト短文
  TEXT_LONG = "text_long",          // テキスト長文
  SELECT_SINGLE = "select_single",  // 選択肢（単一選択）
  SELECT_MULTIPLE = "select_multiple", // 選択肢（複数選択）
  DATE = "date",                    // 日付選択
  IMAGE = "image"                   // 画像アップロード
}

// フォーム回答項目の定義
export type FormField = {
  fieldId: string                    // フィールドID（一意）
  type: FormFieldType               // フィールドタイプ
  title: MultiLanguageText          // フィールドタイトル
  required: boolean                 // 必須項目かどうか
  options?: string[]                // 選択肢（select系の場合のみ）
  maxImages?: number                // 最大画像数（imageの場合のみ）
  createdAt: number                 // 作成日時
  updatedAt: number                 // 更新日時
}

// フォーム定義
export type FormMaster = {
  formId: string                    // フォームID
  title: MultiLanguageText          // フォームタイトル
  description: MultiLanguageText    // フォーム説明
  startTime: number                 // 公開開始日時
  endTime: number                   // 公開終了日時
  fields: FormField[]               // 回答項目
  allowEdit: boolean                // 回答後の編集を許可するか
  townId: string                    // 自治体ID
  businessId: string                // 事業者ID
  createdAt: number                 // 作成日時
  updatedAt: number                 // 更新日時
}

export type SimpleFormMaster = {
  formId: string                    // フォームID
  title: MultiLanguageText          // フォームタイトル
  townId: string                    // 自治体ID
  businessId: string                // 事業者ID
  startTime: number                 // 公開開始日時
  endTime: number                   // 公開終了日時
}

// フォーム回答の値
export type FormAnswerValue = {
  fieldId: string                   // フィールドID
  value: string | string[] | number // 回答値
  images?: string[]                 // 画像URL（imageフィールドの場合）
}

// フォーム回答
export type FormAnswer = {
  answerId: string                  // 回答ID
  formId: string                    // フォームID
  townId: string                    // 自治体ID
  businessId: string                // 事業者ID
  productId: string                 // 商品ID
  tokenId: number                   // トークンID
  userId: string                    // 回答者ID
  values: FormAnswerValue[]         // 回答値の配列
  editedAt?: number                 // 最終編集日時
  createdAt: number                 // 作成日時
  updatedAt: number                 // 更新日時
}

export type FormAnswerSummary = {
  formMaster: FormMaster
  productItem: ProductItem
  answerCount: number
  lastUpdatedAt: number
}
