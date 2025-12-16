"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { signOut, useSession as useNextAuthSession } from "next-auth/react"
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

// Providers
import { useDialog } from "@/providers/dialog-provider"
import { useUserSession } from "@/providers/user-session-provider"
import { useLanguageSession } from "@/providers/language-provider"
import { ReCaptchaProvider } from "@/providers/recaptcha-provider"
import { toast } from "@/components/hooks/use-toast"

// Entity
import { UserFormData } from "@/entity/user/user"

// Define
import { LANGUAGE_LIST } from "@/define/language"
import { getBackgroundClass } from "@/define/colors"
import { RecaptchaActionType } from "@/entity/admin/audit"

// Components
import SignUpFormView from "@/app/(page)/_components/SignUpFormView"
import SignUpConfirmView from "@/app/(page)/_components/SignUpConfirmView"
import BlueButton from "@/components/BlueButton"

// Logic
import * as LocalStorageLogic from "@/logic/local-storage-logic"
import * as UserLoginServerLogic from "@/logic/server/user/user-login-server-logic"
import * as AuthLogic from "@/logic/auth-logic"


function SignupForm() {
  const router = useRouter()
  const { simpleUser, saveSimpleUser } = useUserSession()
  const { onFetch, setInfoDialogData } = useDialog()
  const { getLocalizedText } = useLanguageSession()
  const { executeRecaptcha } = useGoogleReCaptcha()
  const { data } = useNextAuthSession()
  const isAfterLoginProcess = useRef(false)

  // Googleログイン後の処理（/signupページ専用）
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
        LocalStorageLogic.clearCallbackUrl()
        router.replace(callbackUrl)
      } else {
        router.replace('/')
      }
      // リダイレクト後にsignOutを実行
      setTimeout(() => {
        signOut()
      }, 100)
    }

    afterLoginProcess()
  }, [data, router, saveSimpleUser])

  const [ formData, setFormData ] = useState<UserFormData | null>(null)

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

  /**
   * アカウント登録処理
   */
  const onClickSubmit = async () => {
    if (formData == null) return
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
        recaptchaToken = await executeRecaptcha(RecaptchaActionType.USER_SIGNUP)
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

      const callbackUrl = LocalStorageLogic.getCallbackUrl()
      await UserLoginServerLogic.signup(formData, callbackUrl || "/", recaptchaToken)
      setInfoDialogData({
        title: getLocalizedText(LANGUAGE_LIST.AccountCreatedTitle),
        description: getLocalizedText(LANGUAGE_LIST.AccountCreated),
        onOk: () => router.replace("/")
      })
    })
  }

  return (
    <div className={`min-h-screen ${getBackgroundClass('PRIMARY')}`}>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {formData == null ? getLocalizedText(LANGUAGE_LIST.AccountCreation) : getLocalizedText(LANGUAGE_LIST.AccountCreationConfirmation)}
        </h1>
      </div>

      {formData == null && (
        <SignUpFormView onNext={setFormData} />
      )}
      {formData != null && (
        <SignUpConfirmView
          formData={formData}
          onCancel={() => setFormData(null)}
          onSubmit={onClickSubmit}
        />
      )}
    </div>
  )
}

export default function SignupPage() {
  return (
    <ReCaptchaProvider>
      <SignupForm />
    </ReCaptchaProvider>
  )
}