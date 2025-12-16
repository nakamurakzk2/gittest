"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { signOut, useSession as useNextAuthSession } from "next-auth/react"
import { toast } from "@/components/hooks/use-toast"
import { useUserSession } from "@/providers/user-session-provider"
import * as UserLoginServerLogic from "@/logic/server/user/user-login-server-logic"
import * as AuthLogic from "@/logic/auth-logic"
import * as LocalStorageLogic from "@/logic/local-storage-logic"

/**
 * Googleログイン後の処理を行うカスタムフック
 */
export const useAfterLoginProcess = () => {
  const router = useRouter()
  const { saveSimpleUser } = useUserSession()
  const { data } = useNextAuthSession()
  const isAfterLoginProcess = useRef(false)

  useEffect(() => {
    const afterLoginProcess = async () => {
      if (data == null || data.loginToken == null) return
      if (isAfterLoginProcess.current) return
      isAfterLoginProcess.current = true

      // クライアント側でトークンを保存
      const { accessToken, refreshToken } = data.loginToken
      AuthLogic.setUserTokens(accessToken, refreshToken)

      // simpleUserを取得してセッションに保存
      try {
        const { simpleUser } = await UserLoginServerLogic.refresh()
        saveSimpleUser(simpleUser)
      } catch (error) {
        console.error('Failed to fetch user info:', error)
      }

      toast({
        title: 'ログインしました',
      })

      const callbackUrl = LocalStorageLogic.getCallbackUrl()
      if (callbackUrl) {
        router.push(callbackUrl)
      } else {
        router.push('/')
      }
      signOut()
    }

    afterLoginProcess()
  }, [data, router, saveSimpleUser])
}

