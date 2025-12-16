// Entity
import { ResponseCustomerSupportData, ResponseCustomerSupportMemos } from "@/entity/response"

// Logic
import * as ServerLogic from "@/logic/server-logic"

// ===============
// CustomerSupport
// ===============

/**
 * 顧客対応データを取得
 * @param townId 自治体ID
 * @param businessId 事業者ID
 * @returns ResponseCustomerSupportData
 */
export const fetchCustomerSupportData = async (townId: string, businessId: string): Promise<ResponseCustomerSupportData> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/customer-support/customer-support-data`
  const response = await ServerLogic.postWithAccessToken(url, { townId, businessId }) as ResponseCustomerSupportData
  return response
}


// ===================
// CustomerSupportMemo
// ===================

/**
 * 顧客サポートメモを取得
 * @returns ResponseCustomerSupportMemos
 */
export const fetchCustomerSupportMemos = async (): Promise<ResponseCustomerSupportMemos> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/customer-support/customer-support-memos`
  const response = await ServerLogic.postWithAccessToken(url, {}) as ResponseCustomerSupportMemos
  return response
}

/**
 * 顧客サポートメモを更新
 * @param userId ユーザID
 * @param productId 商品ID
 * @param tokenId トークンID
 * @param memo メモ内容
 */
export const upsertCustomerSupportMemo = async (userId: string, productId: string, tokenId: number, memo: string): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/customer-support/upsert-customer-support-memo`
  await ServerLogic.postWithAccessToken(url, { userId, productId, tokenId, memo }) as {}
}

/**
 * 顧客サポートメモを削除
 * @param userId ユーザID
 * @param productId 商品ID
 * @param tokenId トークンID
 */
export const deleteCustomerSupportMemo = async (userId: string, productId: string, tokenId: number): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/customer-support/customer-support-memo/delete`
  await ServerLogic.postWithAccessToken(url, { userId, productId, tokenId }) as {}
}
