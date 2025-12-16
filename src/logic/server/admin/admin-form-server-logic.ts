// Entity
import { FormMaster } from "@/entity/product/form"
import { ResponseFormAnswer, ResponseFormAnswers, ResponseFormAnswerSummaries, ResponseFormMaster, ResponseSimpleFormMasters } from "@/entity/response"

// Logic
import * as ServerLogic from "@/logic/server-logic"


// ==========
// FormMaster
// ==========

/**
 * シンプルフォームマスタを取得
 * @param townId 自治体ID
 * @param businessId 事業者ID
 */
export const fetchSimpleFormMasters = async (townId: string, businessId: string): Promise<ResponseSimpleFormMasters> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/form/simple-form-masters`
  const response = await ServerLogic.postWithAccessToken(url, { townId, businessId }) as ResponseSimpleFormMasters
  return response
}

/**
 * フォームマスタを取得
 * @param formId フォームマスタID
 */
export const fetchFormMaster = async (formId: string): Promise<ResponseFormMaster> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/form/form-master`
  const response = await ServerLogic.postWithAccessToken(url, { formId }) as ResponseFormMaster
  return response
}

/**
 * フォームマスタを更新
 * @param formMaster フォームマスタ
 */
export const upsertFormMaster = async (formMaster: FormMaster): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/form/upsert-form-master`
  await ServerLogic.postWithAccessToken(url, { formMaster })
}


/**
 * フォームマスタを削除
 * @param formId フォームマスタID
 */
export const deleteFormMaster = async (formId: string): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/form/delete-form-master`
  await ServerLogic.postWithAccessToken(url, { formId })
}

// ==========
// FormAnswer
// ==========

/**
 * フォーム回答を取得
 * @param townId 自治体ID
 * @param businessId 事業者ID
 * @returns ResponseFormAnswers
 */
export const fetchFormAnswerSummaries = async (townId: string, businessId: string): Promise<ResponseFormAnswerSummaries> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/form/form-answer-summaries`
  const response = await ServerLogic.postWithAccessToken(url, { townId, businessId }) as ResponseFormAnswerSummaries
  return response
}

/**
 * フォーム回答をまとめて取得
 * @param townId 自治体ID
 * @param businessId 事業者ID
 * @returns ResponseFormAnswer
 */
export const fetchFormAnswers = async (townId: string, businessId: string): Promise<ResponseFormAnswers> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/form/form-answers`
  const response = await ServerLogic.postWithAccessToken(url, { townId, businessId }) as ResponseFormAnswers
  return response
}

/**
 * フォーム回答を取得
 * @param productId 商品ID
 * @returns ResponseFormAnswer
 */
export const fetchFormAnswer = async (productId: string): Promise<ResponseFormAnswer> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/form/form-answer`
  const response = await ServerLogic.postWithAccessToken(url, { productId }) as ResponseFormAnswer
  return response
}