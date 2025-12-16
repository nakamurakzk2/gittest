// Entity
import { ResponseSimpleAdminUser } from "@/entity/response"

// Logic
import * as ServerLogic from "@/logic/server-logic"
import * as AuthLogic from "@/logic/auth-logic"


/**
 * ログイン
 * @param email    メールアドレス
 * @param password パスワード
 * @param recaptchaToken reCAPTCHAトークン
 * @returns ResponseSimpleAdminUser
 */
export const login = async (email: string, password: string, recaptchaToken: string): Promise<ResponseSimpleAdminUser> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/login/login`
  const response = await ServerLogic.postWithNoAuth(url, { email, password, recaptchaToken }) as ResponseSimpleAdminUser
  // ログイン時にトークンを保存
  if (response.loginToken) {
    AuthLogic.setAdminTokens(response.loginToken.accessToken, response.loginToken.refreshToken)
  }
  return response
}

/**
 * ログアウト
 */
export const logout = async (): Promise<void> => {
  const refreshToken = AuthLogic.getAdminRefreshToken()
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/login/logout`
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
    AuthLogic.clearAdminTokens()
  }
}

/**
 * アクセストークンのリフレッシュ
 * @returns ResponseSimpleAdminUser
 */
export const refresh = async (): Promise<ResponseSimpleAdminUser> => {
  const refreshToken = AuthLogic.getAdminRefreshToken()
  if (!refreshToken) {
    throw new Error('リフレッシュトークンがありません')
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/login/refresh`
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

  const json = await response.json() as ResponseSimpleAdminUser

  // 新しいトークンを保存
  if (json.loginToken) {
    AuthLogic.setAdminTokens(json.loginToken.accessToken, json.loginToken.refreshToken)
  }

  return json
}

