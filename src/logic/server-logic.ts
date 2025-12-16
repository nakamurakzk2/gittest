import * as AuthLogic from "@/logic/auth-logic"
import * as LocalStorageLogic from "@/logic/local-storage-logic"

type TokenType = 'user' | 'admin' | 'none'

/**
 * URLからトークンタイプを判定
 * @param url URL
 * @returns トークンタイプ
 */
const getTokenType = (url: string): TokenType => {
  if (url.includes('/admin/')) {
    return 'admin'
  } else {
    return 'user'
  }
}

/**
 * トークンを取得
 * @param tokenType トークンタイプ
 * @returns アクセストークンとリフレッシュトークン
 */
const getTokens = (tokenType: TokenType): { accessToken: string | null, refreshToken: string | null } => {
  if (tokenType === 'admin') {
    return {
      accessToken: AuthLogic.getAdminAccessToken(),
      refreshToken: AuthLogic.getAdminRefreshToken()
    }
  }
  if (tokenType === 'user') {
    return {
      accessToken: AuthLogic.getUserAccessToken(),
      refreshToken: AuthLogic.getUserRefreshToken()
    }
  }
  return { accessToken: null, refreshToken: null }
}

/**
 * トークンリフレッシュ
 * @param tokenType トークンタイプ
 * @returns 新しいアクセストークン、失敗時はnull
 */
const refreshAccessToken = async (tokenType: TokenType): Promise<string | null> => {
  const { refreshToken } = getTokens(tokenType)
  if (!refreshToken) {
    return null
  }

  try {
    const url = tokenType === 'admin'
      ? `${process.env.NEXT_PUBLIC_API_URL}/admin/login/refresh`
      : `${process.env.NEXT_PUBLIC_API_URL}/user/login/refresh`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Refresh-Token': refreshToken
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    const json = await response.json()
    if (json.loginToken) {
      const { accessToken, refreshToken: newRefreshToken } = json.loginToken
      if (tokenType === 'admin') {
        AuthLogic.setAdminTokens(accessToken, newRefreshToken || refreshToken)
      } else {
        AuthLogic.setUserTokens(accessToken, newRefreshToken || refreshToken)
      }
      return accessToken
    }
  } catch (error) {
    console.error('Token refresh error:', error)
  }

  return null
}

/**
 * POSTリクエスト（内部関数）
 * @param url URL
 * @param data データ
 * @param additionalHeaders 追加のリクエストヘッダー（Content-Typeは自動で設定される）
 * @returns Responseオブジェクト
 */
const postCommon = async (
  url: string,
  data: Record<string, unknown> | null = null,
  additionalHeaders: Record<string, string> = {}
): Promise<Response> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...additionalHeaders,
  }
  return await fetch(url, {
    method: 'POST',
    headers,
    body: data ? JSON.stringify(data) : null,
    cache: 'no-store',
  })
}

/**
 * POSTリクエスト（認証不要）
 * @param url URL
 * @param data データ
 */
export const postWithNoAuth = async (
  url: string,
  data: Record<string, unknown> | null = null
) => {
  // A8パラメータがあれば追加
  const a8 = LocalStorageLogic.getA8Param()
  if (a8) {
    if (data == null) {
      data = { a8 }
    } else {
      data.a8 = a8
    }
  }

  const response = await postCommon(url, data)
  const json = await response.json()
  if (!response.ok) {
    console.error(json)
    throw new Error(json.error || response.statusText)
  }
  return json
}

/**
 * POSTリクエスト（認証不要、カスタムAuthorizationヘッダー付き）
 * @param url URL
 * @param data データ
 * @param authorization Authorizationヘッダー（APIキーなど）
 */
export const postWithAuth = async (
  url: string,
  data: Record<string, unknown> | null = null,
  authorization: string
) => {
  const response = await postCommon(url, data, { 'Authorization': authorization })
  const json = await response.json()
  if (!response.ok) {
    console.error(json)
    throw new Error(json.error || response.statusText)
  }
  return json
}

/**
 * POSTリクエスト（認証必要）
 * @param url URL
 * @param data データ
 */
export const postWithAccessToken = async (
  url: string,
  data: Record<string, unknown> | null = null
) => {
  const tokenType = getTokenType(url)
  const { accessToken, refreshToken } = getTokens(tokenType)

  const additionalHeaders: Record<string, string> = {}
  if (accessToken) {
    additionalHeaders['Authorization'] = `Bearer ${accessToken}`
    if (refreshToken) {
      additionalHeaders['X-Refresh-Token'] = refreshToken
    }
  }

  // A8パラメータがあれば追加
  const a8 = LocalStorageLogic.getA8Param()
  if (a8) {
    if (data == null) {
      data = { a8 }
    } else {
      data.a8 = a8
    }
  }

  let response = await postCommon(url, data, additionalHeaders)
  let json = await response.json()

  // 401エラーの場合、トークンをリフレッシュして再試行
  if (response.status === 401) {
    const newAccessToken = await refreshAccessToken(tokenType)
    if (newAccessToken) {
      additionalHeaders['Authorization'] = `Bearer ${newAccessToken}`
      response = await postCommon(url, data, additionalHeaders)
      json = await response.json()
    } else {
      // リフレッシュに失敗した場合、トークンを削除
      if (tokenType === 'admin') {
        AuthLogic.clearAdminTokens()
      } else {
        AuthLogic.clearUserTokens()
      }
    }
  }

  if (!response.ok) {
    console.error(json)
    throw new Error(json.error || response.statusText)
  }
  return json
}


/**
 * PUTリクエスト(ファイルアップロード)
 * @param url         URL
 * @param file        ファイル
 * @param contentType コンテントタイプ
 */
export const uploadFile = async (url: string, file: File, contentType: string): Promise<void> => {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: file
  })
  if (!res.ok) {
    throw new Error('エラーが発生しました')
  }
}
