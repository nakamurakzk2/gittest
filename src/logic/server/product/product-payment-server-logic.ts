// Logic
import { ResponsePaymentResult, ResponseKey, ResponseRedirect } from "@/entity/response"
import { BillingInfo } from "@/entity/user/user"
import * as ServerLogic from "@/logic/server-logic"

/**
 * トークンAPIキーを取得
 * @param townId 自治体ID
 * @returns トークンAPIキー
 */
export const fetchTokenApiKey = async (townId: string): Promise<ResponseKey> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/product/payment/token-api-key`
  const response = await ServerLogic.postWithAccessToken(url, { townId }) as ResponseKey
  return response
}

/**
 * クレカ決済
 * @param productId 商品ID
 * @param amount 金額
 * @param price 価格
 * @param token トークン
 * @param email メールアドレス
 * @param billingInfo 請求先住所
 * @returns ResponseLink
 */
export const buyCredit = async (productId: string, amount: number, price: number, token: string, email: string, billingInfo: BillingInfo): Promise<ResponseRedirect> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/product/payment/buy-credit`
  const response = await ServerLogic.postWithAccessToken(url, { productId, amount, price, token, email, billingInfo }) as ResponseRedirect
  return response
}

/**
 * クレカ決済結果を検索
 * @param requestId リクエストID
 * @param townId 自治体ID
 * @returns ResponseCreditPaymentResult
 */
export const searchCreditResult = async (requestId: string, townId: string): Promise<ResponsePaymentResult> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/product/payment/search-credit-result`
  const response = await ServerLogic.postWithAccessToken(url, { requestId, townId }) as ResponsePaymentResult
  return response
}

/**
 * 銀行決済
 * @param productId 商品ID
 * @param amount 数量
 * @param price 価格
 * @param name 名前
 * @param nameKana 名前（カナ）
 * @param email メールアドレス
 * @param billingInfo 請求先住所
 * @returns ResponseBank
 */
export const buyBank = async (productId: string, amount: number, price: number, name: string, nameKana: string, email: string, billingInfo: BillingInfo): Promise<ResponseRedirect> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/product/payment/buy-bank`
  const response = await ServerLogic.postWithAccessToken(url, { productId, amount, price, name, nameKana, email, billingInfo }) as ResponseRedirect
  return response
}


/**
 * 銀行決済結果を検索
 * @param orderId 注文ID
 * @returns ResponsePaymentResult
 */
export const searchBankResult = async (orderId: string): Promise<ResponsePaymentResult> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/product/payment/search-bank-result`
  const response = await ServerLogic.postWithAccessToken(url, { orderId }) as ResponsePaymentResult
  return response
}

