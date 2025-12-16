'use client'

import { cn } from "@/lib/utils"
import { signIn } from "next-auth/react"
import { FcGoogle } from 'react-icons/fc'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

// Components
import { Button } from "@/components/ui/button"
import { toast } from "@/components/hooks/use-toast"

// Provider
import { useUserSession } from "@/providers/user-session-provider"
import { useDialog } from "@/providers/dialog-provider"
import { useLanguageSession } from "@/providers/language-provider"

// Logic
import * as GoogleLoginServerLogic from "@/logic/server/user/google-login-server-logic"

// Define
import { LANGUAGE_LIST } from "@/define/language"
import { RecaptchaActionType } from "@/entity/admin/audit"

type Props = {
  className?: string
  isLogin?: boolean
  disabled?: boolean
}

export default function GoogleLoginButton({ className, isLogin = true, disabled = false }: Props) {
  const { onFetch } = useDialog()
  const { simpleUser } = useUserSession()
  const { getLocalizedText } = useLanguageSession()
  const { executeRecaptcha } = useGoogleReCaptcha()

  const onClickGoogleLogin = async () => {
    await onFetch(async () => {
      // reCAPTCHAトークンを取得
      if (executeRecaptcha) {
        try {
          const actionType = RecaptchaActionType.USER_LOGIN
          const recaptchaToken = await executeRecaptcha(actionType)
          if (recaptchaToken) {
            document.cookie = `recaptcha_token=${recaptchaToken}; path=/; max-age=300`
          }
        } catch (error) {
          console.error('reCAPTCHA execution error:', error)
          toast({
            title: 'エラー',
            description: 'reCAPTCHAの検証に失敗しました。もう一度お試しください。',
            variant: 'destructive',
          })
          return
        }
      } else {
        toast({
          title: 'エラー',
          description: 'reCAPTCHAが初期化されていません。ページを再読み込みしてください。',
          variant: 'destructive',
        })
        return
      }

      // 既存のcustom_session_keyクッキーを削除
      document.cookie = 'custom_session_key=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

      // ユーザIDに応じたkeyを発行
      if (simpleUser != null) {
        const { key } = await GoogleLoginServerLogic.fetchLoginKey()
        document.cookie = `custom_session_key=${key}; path=/`
      }
      signIn("google")
    })
  }

  return (
    <Button variant="outline" className={cn("w-full h-[40px] bg-white hover:bg-gray-50", className)} onClick={onClickGoogleLogin} disabled={disabled}>
      <FcGoogle />
      {isLogin ? getLocalizedText(LANGUAGE_LIST.GoogleLogin) : getLocalizedText(LANGUAGE_LIST.GoogleSignup)}
    </Button>
  )
}
