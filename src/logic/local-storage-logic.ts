/**
 * LocalStorage操作のロジック
 */

const CALLBACK_URL_KEY = 'callbackUrl'

/**
 * callbackUrlをLocalStorageに保存
 * @param url 遷移先のURL
 */
export const saveCallbackUrl = (url: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CALLBACK_URL_KEY, url)
  }
}

/**
 * LocalStorageからcallbackUrlを取得
 * @returns 保存されているcallbackUrl、存在しない場合はnull
 */
export const getCallbackUrl = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(CALLBACK_URL_KEY)
  }
  return null
}

/**
 * LocalStorageからcallbackUrlを削除
 */
export const clearCallbackUrl = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CALLBACK_URL_KEY)
  }
}

/**
 * callbackUrlが存在するかチェック
 * @returns callbackUrlが存在する場合はtrue
 */
export const hasCallbackUrl = (): boolean => {
  return getCallbackUrl() !== null
}

/**
 * A8パラメータをLocalStorageに保存
 * 保存期間は90日以上を想定（有効期限を設定）
 * @param a8Param A8パラメータ
 */
export const saveA8Param = (a8Param: string): void => {
  if (typeof window !== 'undefined') {
    const data = {
      value: a8Param,
      timestamp: Date.now(),
      // 90日後のタイムスタンプ
      expiresAt: Date.now() + (90 * 24 * 60 * 60 * 1000)
    }
    localStorage.setItem('a8Param', JSON.stringify(data))
    console.log('A8パラメータを保存しました:', a8Param)
  }
}

/**
 * LocalStorageからA8パラメータを取得
 * 有効期限をチェックし、期限切れの場合は削除
 * @returns 保存されているA8パラメータ、存在しないまたは期限切れの場合はnull
 */
export const getA8Param = (): string | null => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('a8Param')
    if (!stored) {
      return null
    }

    try {
      const data = JSON.parse(stored)
      const now = Date.now()

      // 有効期限をチェック
      if (data.expiresAt && now > data.expiresAt) {
        // 期限切れの場合は削除
        localStorage.removeItem('a8Param')
        return null
      }

      return data.value || null
    } catch (error) {
      // パースエラーの場合は削除
      localStorage.removeItem('a8Param')
      return null
    }
  }
  return null
}

/**
 * LocalStorageからA8パラメータを削除
 */
export const clearA8Param = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('a8Param')
  }
}

/**
 * A8パラメータが存在するかチェック
 * @returns A8パラメータが存在する場合はtrue
 */
export const hasA8Param = (): boolean => {
  return getA8Param() !== null
}
