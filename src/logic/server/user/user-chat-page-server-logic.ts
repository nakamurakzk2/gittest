// Entity
import { ResponseSimpleChat } from "@/entity/response"

// Logic
import * as ServerLogic from "@/logic/server-logic"


/**
 * 事前相談チャットを送信
 * @param productId 商品ID
 * @param message メッセージ
 * @param images 画像
 * @returns ResponseChatPage
 */
export const sendPreTalkChat = async (productId: string, message: string, images: string[]): Promise<ResponseSimpleChat> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/page/chat/send-pre-talk-chat`
  const response = await ServerLogic.postWithAccessToken(url, { productId, message, images }) as ResponseSimpleChat
  return response
}

/**
 * 商品チャットを送信
 * @param productId 商品ID
 * @param tokenId トークンID
 * @param message メッセージ
 * @param images 画像
 * @returns ResponseChatPage
 */
export const sendProductChat = async (productId: string, tokenId: number, message: string, images: string[]): Promise<ResponseSimpleChat> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/page/chat/send-product-chat`
  const response = await ServerLogic.postWithAccessToken(url, { productId, tokenId, message, images }) as ResponseSimpleChat
  return response
}
