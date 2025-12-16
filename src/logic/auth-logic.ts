/**
 * 認証トークン管理のロジック
 */

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const ADMIN_ACCESS_TOKEN_KEY = 'adminAccessToken'
const ADMIN_REFRESH_TOKEN_KEY = 'adminRefreshToken'

/**
 * ユーザー用トークンを保存
 * @param accessToken アクセストークン
 * @param refreshToken リフレッシュトークン
 */
export const setUserTokens = (accessToken: string, refreshToken: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }
}

/**
 * 管理者用トークンを保存
 * @param accessToken アクセストークン
 * @param refreshToken リフレッシュトークン
 */
export const setAdminTokens = (accessToken: string, refreshToken: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(ADMIN_REFRESH_TOKEN_KEY, refreshToken)
  }
}

/**
 * ユーザー用アクセストークンを取得
 * @returns アクセストークン、存在しない場合はnull
 */
export const getUserAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  }
  return null
}

/**
 * ユーザー用リフレッシュトークンを取得
 * @returns リフレッシュトークン、存在しない場合はnull
 */
export const getUserRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  }
  return null
}

/**
 * 管理者用アクセストークンを取得
 * @returns アクセストークン、存在しない場合はnull
 */
export const getAdminAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY)
  }
  return null
}

/**
 * 管理者用リフレッシュトークンを取得
 * @returns リフレッシュトークン、存在しない場合はnull
 */
export const getAdminRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(ADMIN_REFRESH_TOKEN_KEY)
  }
  return null
}

/**
 * ユーザー用トークンを削除
 */
export const clearUserTokens = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }
}

/**
 * 管理者用トークンを削除
 */
export const clearAdminTokens = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY)
    localStorage.removeItem(ADMIN_REFRESH_TOKEN_KEY)
  }
}

/**
 * すべてのトークンを削除
 */
export const clearAllTokens = (): void => {
  clearUserTokens()
  clearAdminTokens()
}

