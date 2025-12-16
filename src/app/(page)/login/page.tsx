"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

// Components
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import BlueButton from "@/components/BlueButton"
import GoogleLoginButton from "@/app/(page)/(home)/_components/GoogleLoginButton"

// Provider
import { useDialog } from "@/providers/dialog-provider"
import { useUserSession } from "@/providers/user-session-provider"
import { useLanguageSession } from "@/providers/language-provider"
import { toast } from "@/components/hooks/use-toast"
import { ReCaptchaProvider } from "@/providers/recaptcha-provider"

// Hooks
import { useAfterLoginProcess } from "@/hooks/use-after-login-process"

// Logic
import * as UserLoginServerLogic from "@/logic/server/user/user-login-server-logic"

// Define
import { LANGUAGE_LIST } from "@/define/language"
import { getBackgroundClass } from "@/define/colors"
import { RecaptchaActionType } from "@/entity/admin/audit"

// Logic
import * as LocalStorageLogic from "@/logic/local-storage-logic"

function LoginForm() {
  const router = useRouter()
  const { onFetch } = useDialog()
  const { simpleUser, saveSimpleUser } = useUserSession()
  const { getLocalizedText } = useLanguageSession()
  const { executeRecaptcha } = useGoogleReCaptcha()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Googleログイン後の処理
  useAfterLoginProcess()


  /**
   * ログインボタン押下時
   */
  const onClickLogin = async (e?: React.FormEvent) => {
    e?.preventDefault()
    await onFetch(async () => {
      if (!executeRecaptcha) {
        toast({
          title: 'エラー',
          description: 'reCAPTCHAが初期化されていません。ページを再読み込みしてください。',
          variant: 'destructive',
        })
        return
      }

      let recaptchaToken: string
      try {
        recaptchaToken = await executeRecaptcha(RecaptchaActionType.USER_LOGIN)
      } catch (error) {
        console.error('reCAPTCHA execution error:', error)
        toast({
          title: 'エラー',
          description: 'reCAPTCHAの検証に失敗しました。もう一度お試しください。',
          variant: 'destructive',
        })
        return
      }

      if (!recaptchaToken) {
        toast({
          title: 'エラー',
          description: 'reCAPTCHAトークンの取得に失敗しました。',
          variant: 'destructive',
        })
        return
      }

      const { simpleUser } = await UserLoginServerLogic.login(email, password, recaptchaToken)
      saveSimpleUser(simpleUser)
      toast({
        title: getLocalizedText(LANGUAGE_LIST.LoggedIn),
      })
      const callbackUrl = LocalStorageLogic.getCallbackUrl()
      if (callbackUrl) {
        LocalStorageLogic.clearCallbackUrl()
        router.replace(callbackUrl)
      } else {
        router.replace("/account")
      }
    })
  }


  // ログイン完了後の遷移処理
  const onClickNavigate = () => {
    const callbackUrl = LocalStorageLogic.getCallbackUrl()
    if (callbackUrl) {
      LocalStorageLogic.clearCallbackUrl()
      router.replace(callbackUrl)
    } else {
      router.replace("/")
    }
  }

  // simpleUserがnullでない場合（ログイン済み）の表示
  if (simpleUser) {
    const callbackUrl = LocalStorageLogic.getCallbackUrl()
    const buttonText = callbackUrl ? "元のページに戻る" : "TOPページへ"

    return (
      <div className={`min-h-screen ${getBackgroundClass('PRIMARY')}`}>
        <div className="max-w-2xl mx-auto py-8">
          <h1 className="text-2xl font-bold text-gray-900">ログイン完了</h1>
        </div>
        <div className="w-full max-w-md mx-auto">
          <BlueButton onClick={onClickNavigate} className="w-full">
            {buttonText}
          </BlueButton>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen px-4 ${getBackgroundClass('PRIMARY')}`}>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold text-gray-900">{getLocalizedText(LANGUAGE_LIST.Login)}</h1>
      </div>
      <div className="w-full max-w-md mx-auto">
        <form onSubmit={onClickLogin} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {getLocalizedText(LANGUAGE_LIST.EmailAddress)}
            </label>
            <Input
              type="email"
              placeholder={getLocalizedText(LANGUAGE_LIST.EmailAddress)}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              autoComplete="email"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {getLocalizedText(LANGUAGE_LIST.Password)}
            </label>
            <Input
              type="password"
              placeholder={getLocalizedText(LANGUAGE_LIST.Password)}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              autoComplete="current-password"
            />
          </div>

          <div className="text-left">
            <Link href="/forgot-password" className="text-xs text-gray-600 hover:text-gray-900 flex items-center">
              {getLocalizedText(LANGUAGE_LIST.ForgotPassword)} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Account Creation Link */}
          <div className="text-center underline">
            <Link href="/signup" className="text-sm text-gray-600 hover:text-gray-900">
              {getLocalizedText(LANGUAGE_LIST.CreateNewAccount)}
            </Link>
          </div>

          {/* Login Button */}
          <BlueButton type="submit" className="w-full" disabled={email.length === 0 || password.length === 0}>
            {getLocalizedText(LANGUAGE_LIST.LoginButton)}
          </BlueButton>
        </form>

        {/* Divider */}
        <div className="py-6">
          <Separator />
        </div>
        <GoogleLoginButton />
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <ReCaptchaProvider>
      <LoginForm />
    </ReCaptchaProvider>
  )
}