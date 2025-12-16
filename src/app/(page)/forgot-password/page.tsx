"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

// Components
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import BlueButton from "@/components/BlueButton"

// Provider
import { useDialog } from "@/providers/dialog-provider"
import { useLanguageSession } from "@/providers/language-provider"

// Logic
import * as CommonLogic from "@/logic/common-logic"

// Define
import { LANGUAGE_LIST } from "@/define/language"
import { getBackgroundClass } from "@/define/colors"

// Logic
import * as UserLoginServerLogic from "@/logic/server/user/user-login-server-logic"

export default function LoginPage() {
  const router = useRouter()
  const { onFetch, setInfoDialogData } = useDialog()
  const { getLocalizedText } = useLanguageSession()

  const [email, setEmail] = useState("")

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await onFetch(async () => {
      await UserLoginServerLogic.forgotPassword(email)
      setInfoDialogData({
        title: "お知らせ",
        description: "登録済みのメールアドレスの場合、パスワードリセットメールが送信されます。24時間以内にメール内のリンクにアクセスしてパスワードをリセットしてください。",
        onOk: () => {
          setEmail("")
        }
      })
    })
  }


  return (
    <div className={`min-h-screen ${getBackgroundClass('PRIMARY')}`}>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold text-gray-900 text-center">パスワードリセット</h1>
      </div>
      <div className="w-full max-w-md mx-auto mt-10">
        <form onSubmit={onSubmit} className="space-y-10">
          <div className="text-center text-sm text-gray-500">
            パスワードをリセットするためのメールをお送りします
          </div>
          <Input
            type="email"
            placeholder={getLocalizedText(LANGUAGE_LIST.EmailAddress)}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            autoComplete="email"
          />

          <div className="mt-10 space-y-4">
            <BlueButton type="submit" className="w-full" disabled={!CommonLogic.isValidEmail(email)}>
              送信する
            </BlueButton>
            <Button variant="ghost" className="w-full" onClick={() => router.back()}>
              キャンセル
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}