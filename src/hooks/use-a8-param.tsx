"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

// Provider
import { useUserSession } from "@/providers/user-session-provider"

// Logic
import * as LocalStorageLogic from "@/logic/local-storage-logic"
import * as UserLoginServerLogic from "@/logic/server/user/user-login-server-logic"

/**
 * URLパラメータからA8パラメータを取得して保存するカスタムフック
 * どのページでも使用可能で、URLにa8パラメータがある場合に自動的に保存します
 * ログイン中の場合は、サーバーにも送信します
 */
export const useA8Param = () => {
  const searchParams = useSearchParams()
  const { simpleUser } = useUserSession()


  /**
   * A8パラメータをサーバーに送信
   * @param a8 A8パラメータ
   */
  const createA8 = async (a8: string) => {
    if (simpleUser == null) return
    try {
      await UserLoginServerLogic.createA8(a8)
    } catch (error) {
      console.error('A8パラメータの送信に失敗しました:', error)
    }
  }

  useEffect(() => {
    const a8Param = searchParams.get('a8')
    if (a8Param) {
      // A8パラメータが見つかった場合は保存
      LocalStorageLogic.saveA8Param(a8Param)

      // クッキーにも保存（サーバー側で取得できるようにするため）
      // 90日間有効
      const expiresDate = new Date()
      expiresDate.setTime(expiresDate.getTime() + (90 * 24 * 60 * 60 * 1000))
      document.cookie = `a8Param=${a8Param}; expires=${expiresDate.toUTCString()}; path=/`

      // ログイン中の場合は、サーバーにも送信
      if (simpleUser) {
        createA8(a8Param)
      }
    }
  }, [searchParams, simpleUser])
}

