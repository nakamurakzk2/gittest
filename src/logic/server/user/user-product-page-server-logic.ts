// Entity
import { FormAnswer } from "@/entity/product/form"
import { ResponseLink, ResponseMessage, ResponseOwnCount, ResponseOwnProductsPage, ResponsePaymentResult, ResponsePreTalkChatPage, ResponseProductPage, ResponseSimpleChat } from "@/entity/response"

// Logic
import * as ServerLogic from "@/logic/server-logic"


/**
 * 所持商品一覧ページに必要な情報を取得
 */
export const fetchOwnProductsPage = async (): Promise<ResponseOwnProductsPage> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/page/product/products-page`
  const response = await ServerLogic.postWithAccessToken(url) as ResponseOwnProductsPage
  return response
}

/**
 * 所持商品ページに必要な情報を取得
 * @param productId 商品ID
 * @param tokenId トークンID
 * @returns ResponseProductPage
 */
export const fetchProductPage = async (productId: string, tokenId: number): Promise<ResponseProductPage> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/page/product/product-page`
  const response = await ServerLogic.postWithAccessToken(url, { productId, tokenId }) as ResponseProductPage
  return response
}

/**
 * 事前相談チャットページに必要な情報を取得
 * @param productId 商品ID
 * @returns ResponsePreTalkChatPage
 */
export const fetchPreTalkChatPage = async (productId: string): Promise<ResponsePreTalkChatPage> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/page/product/pre-talk-chat-page`
  const response = await ServerLogic.postWithAccessToken(url, { productId }) as ResponsePreTalkChatPage
  return response
}


/**
 * アップロード用URLを取得
 * @param fileName ファイル名
 * @param contentType コンテンツタイプ
 * @returns ResponseLink
 */
export const fetchImageSignedUrl = async (fileName: string, contentType: string): Promise<ResponseLink> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/page/product/image-signed-url`
  const response = await ServerLogic.postWithAccessToken(url, { fileName, contentType }) as ResponseLink
  return response
}


/**
 * フォーム回答を送信
 * @param productId 商品ID
 * @param tokenId トークンID
 * @param formAnswer フォーム回答
 * @returns ResponseSimpleChat
 */
export const answerForm = async (productId: string, tokenId: number, formAnswer: FormAnswer): Promise<ResponseSimpleChat> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/page/product/answer-form`
  const response = await ServerLogic.postWithAccessToken(url, { productId, tokenId, formAnswer }) as ResponseSimpleChat
  return response
}


/**
 * NFTを送付する
 * @param productId 商品ID
 * @param tokenId トークンID
 */
export const transferAsset = async (productId: string, tokenId: number): Promise<ResponseMessage> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/page/product/transfer-asset`
  const response = await ServerLogic.postWithAccessToken(url, { productId, tokenId }) as ResponseMessage
  return response
}

/**
 * 商品の所持数を取得
 * @param productId 商品ID
 * @returns ResponseOwnCount
 */
export const fetchOwnCount = async (productId: string): Promise<ResponseOwnCount> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/page/product/own-count`
  const response = await ServerLogic.postWithAccessToken(url, { productId }) as ResponseOwnCount
  return response
}

/**
 * 支払状況を確認する
 * @param productId 商品ID
 * @param tokenId トークンID
 * @returns ResponsePaymentResult
 */
export const fetchPaymentStatus = async (productId: string, tokenId: number): Promise<ResponsePaymentResult> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/page/product/check-payment-status`
  const response = await ServerLogic.postWithAccessToken(url, { productId, tokenId }) as ResponsePaymentResult
  return response
}