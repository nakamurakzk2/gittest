// Entity
import { ResponsePreTalkChat, ResponsePreTalkChats, ResponseProductChat, ResponseProductChats } from "@/entity/response"

// Logic
import * as ServerLogic from "@/logic/server-logic"


// ===========
// PreTalkChat
// ==========

/**
 * 事前相談チャットを取得
 * @param townId 自治体ID
 * @param businessId 事業者ID
 * @returns ResponsePreTalkChats
 */
export const fetchPreTalkChats = async (townId: string, businessId: string): Promise<ResponsePreTalkChats> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/chat/pre-talk-chats`
  const response = await ServerLogic.postWithAccessToken(url, { townId, businessId }) as ResponsePreTalkChats
  return response
}

/**
 * 事前相談チャットを取得
 * @param chatId チャットID
 * @returns ResponsePreTalkChat
 */
export const fetchPreTalkChat = async (chatId: string): Promise<ResponsePreTalkChat> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/chat/pre-talk-chat`
  const response = await ServerLogic.postWithAccessToken(url, { chatId }) as ResponsePreTalkChat
  return response
}

/**
 * 事前相談チャットを送信
 * @param townId 自治体ID
 * @param businessId 事業者ID
 * @param userId ユーザーID
 * @param productId 商品ID
 * @param message メッセージ
 * @param images 画像
 */
export const sendPreTalkChat = async (townId: string, businessId: string, userId: string, productId: string, message: string, images: string[]): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/chat/send-pre-talk-chat`
  await ServerLogic.postWithAccessToken(url, { townId, businessId, userId, productId, message, images })
}

/**
 * 事前相談チャットの未読数をリセット
 * @param townId 自治体ID
 * @param businessId 事業者ID
 * @param userId ユーザーID
 * @param productId 商品ID
 */
export const resetPreTalkUnreadCount = async (townId: string, businessId: string, userId: string, productId: string): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/chat/reset-pre-talk-unread-count`
  await ServerLogic.postWithAccessToken(url, { townId, businessId, userId, productId })
}


// ===========
// ProductChat
// ===========

/**
 * 商品チャットを取得
 * @param townId 自治体ID
 * @param businessId 事業者ID
 * @returns ResponseProductChats
 */
export const fetchProductChats = async (townId: string, businessId: string): Promise<ResponseProductChats> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/chat/product-chats`
  const response = await ServerLogic.postWithAccessToken(url, { townId, businessId }) as ResponseProductChats
  return response
}

/**
 * 商品チャットを取得
 * @param chatId チャットID
 * @returns ResponseProductChat
 */
export const fetchProductChat = async (chatId: string): Promise<ResponseProductChat> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/chat/product-chat`
  const response = await ServerLogic.postWithAccessToken(url, { chatId }) as ResponseProductChat
  return response
}

/**
 * 商品チャットを送信
 * @param townId 自治体ID
 * @param businessId 事業者ID
 * @param userId ユーザーID
 * @param productId 商品ID
 * @param tokenId トークンID
 * @param message メッセージ
 * @param images 画像
 */
export const sendProductChat = async (townId: string, businessId: string, userId: string, productId: string, tokenId: number, message: string, images: string[]): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/chat/send-product-chat`
  await ServerLogic.postWithAccessToken(url, { townId, businessId, userId, productId, tokenId, message, images })
}


/**
 * 商品チャットの未読数をリセット
 * @param townId 自治体ID
 * @param businessId 事業者ID
 * @param userId ユーザーID
 * @param productId 商品ID
 * @param tokenId トークンID
 */
export const resetProductUnreadCount = async (townId: string, businessId: string, userId: string, productId: string, tokenId: number): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/chat/reset-product-unread-count`
  await ServerLogic.postWithAccessToken(url, { townId, businessId, userId, productId, tokenId })
}