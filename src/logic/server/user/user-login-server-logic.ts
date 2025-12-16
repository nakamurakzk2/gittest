// Entity
import { ResponseSimpleUser } from "@/entity/response"
import { UserFormData } from "@/entity/user/user"

// Logic
import * as ServerLogic from "@/logic/server-logic"
import * as AuthLogic from "@/logic/auth-logic"


/**
 * アカウント作成
 * @param userFormData ユーザ作成フォームデータ
 * @param callbackUrl コールバックURL
 * @param recaptchaToken reCAPTCHAトークン
 */
export const signup = async (userFormData: UserFormData, callbackUrl: string, recaptchaToken: string): Promise<ResponseSimpleUser> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/login/signup`
  const response = await ServerLogic.postWithNoAuth(url, { userFormData, callbackUrl, recaptchaToken }) as ResponseSimpleUser
  // サインアップ時にトークンが返された場合は保存
  if (response.loginToken) {
    AuthLogic.setUserTokens(response.loginToken.accessToken, response.loginToken.refreshToken)
  }
  return response
}

/**
 * ログイン
 * @param email    メールアドレス
 * @param password パスワード
 * @param recaptchaToken reCAPTCHAトークン
 * @returns ResponseSimpleUser
 */
export const login = async (email: string, password: string, recaptchaToken: string): Promise<ResponseSimpleUser> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/login/login`
  const response = await ServerLogic.postWithNoAuth(url, { email, password, recaptchaToken }) as ResponseSimpleUser
  // ログイン時にトークンを保存
  if (response.loginToken) {
    AuthLogic.setUserTokens(response.loginToken.accessToken, response.loginToken.refreshToken)
  }
  return response
}

/**
 * ログアウト
 */
export const logout = async (): Promise<void> => {
  const refreshToken = AuthLogic.getUserRefreshToken()
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/login/logout`
  try {
    if (refreshToken) {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Refresh-Token': refreshToken
        },
        cache: 'no-store',
      })
    }
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    // トークンを削除
    AuthLogic.clearUserTokens()
  }
}

/**
 * 認証
 * @param key 認証キー
 */
export const authorize = async (key: string): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/login/authorize`
  await ServerLogic.postWithNoAuth(url, { key })
}

/**
 * アクセストークンのリフレッシュ
 * @returns ResponseSimpleUser
 */
export const refresh = async (): Promise<ResponseSimpleUser> => {
  const refreshToken = AuthLogic.getUserRefreshToken()
  if (!refreshToken) {
    throw new Error('リフレッシュトークンがありません')
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/login/refresh`
  // リフレッシュトークンをヘッダーで送信するため、手動でfetchを実行
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Refresh-Token': refreshToken
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('トークンリフレッシュに失敗しました')
  }

  const json = await response.json() as ResponseSimpleUser

  // 新しいトークンを保存
  if (json.loginToken) {
    AuthLogic.setUserTokens(json.loginToken.accessToken, json.loginToken.refreshToken)
  }

  return json
}

/**
 * パスワードリセット
 * @param email メールアドレス
 */
export const forgotPassword = async (email: string): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/login/forgot-password`
  await ServerLogic.postWithNoAuth(url, { email })
}

/**
 * パスワードリセット
 * @param key キー
 * @param password 新しいパスワード
 */
export const resetPassword = async (key: string, password: string): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/login/reset-password`
  await ServerLogic.postWithNoAuth(url, { key, password })
}

/**
 * パスワード更新
 * @param key キー
 */
export const updatePassword = async (key: string): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/login/update-password`
  await ServerLogic.postWithNoAuth(url, { key })
}


/**
 * A8情報を作成
 * @param a8 A8パラメータ
 */
export const createA8 = async (a8: string): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/login/create-a8`
  await ServerLogic.postWithAccessToken(url, { a8 })
}
