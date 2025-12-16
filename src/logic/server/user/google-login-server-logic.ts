// Entity
import { ResponseKey, ResponseLoginToken } from "@/entity/response"

// Logic
import * as ServerLogic from "@/logic/server-logic"

/**
 * ログインキーを取得
 * @returns ResponseKey
 */
export const fetchLoginKey = async (): Promise<ResponseKey> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/google/login-key`
  const response = await ServerLogic.postWithNoAuth(url) as ResponseKey
  return response
}

/**
 * Googleでログイン / アカウント連携
 * @param key キー
 * @param accountId GoogleアカウントID
 * @param email ユーザー名
 * @param token トークン
 * @param recaptchaToken reCAPTCHAトークン
 * @param a8 A8パラメータ（オプショナル）
 * @returns ResponseLoginToken
 */
export const login = async (key: string | undefined, accountId: string, email: string, token: string, recaptchaToken: string, a8?: string): Promise<ResponseLoginToken> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/google/login`
  const authorization = `Bearer ${process.env.LOGIN_API_KEY}`
  const response = await ServerLogic.postWithAuth(url, { key, accountId, email, token, recaptchaToken, a8 }, authorization) as ResponseLoginToken
  // サーバー側ではlocalStorageが使えないため、トークンの保存はクライアント側で行う
  // ここではトークンを返すだけ
  return response
}

/**
 * Google連携を解除する
 */
export const logout = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/page/login/google/logout`
  await ServerLogic.postWithAccessToken(url)
}
