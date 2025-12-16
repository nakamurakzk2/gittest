"use client"

import { getBackgroundClass } from "@/define/colors"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

// Components
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import BlueButton from "@/components/BlueButton"

// Provider
import { useDialog } from "@/providers/dialog-provider"

// Logic
import * as UserLoginServerLogic from "@/logic/server/user/user-login-server-logic"

export default function PasswordResetPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { onFetch, setInfoDialogData } = useDialog()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [key, setKey] = useState<string | null>(null)

  useEffect(() => {
    const keyParam = searchParams.get("key")
    if (!keyParam) {
      setInfoDialogData({
        title: "エラー",
        description: "無効なリセットリンクです。",
        onOk: () => router.push("/login")
      })
      return
    }
    setKey(keyParam)
  }, [searchParams, setInfoDialogData, router])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setInfoDialogData({
        title: "エラー",
        description: "パスワードが一致しません。"
      })
      return
    }

    if (password.length < 6) {
      setInfoDialogData({
        title: "エラー",
        description: "パスワードは6文字以上で入力してください。"
      })
      return
    }

    if (!key) {
      setInfoDialogData({
        title: "エラー",
        description: "URLが無効です"
      })
      return
    }

    await onFetch(async () => {
      await UserLoginServerLogic.resetPassword(key, password)
      setInfoDialogData({
        title: "完了",
        description: "パスワードが正常に変更されました",
        onOk: () => router.push("/login")
      })
    })
  }

  return (
    <div className={`min-h-screen ${getBackgroundClass('PRIMARY')}`}>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold text-gray-900 text-center">パスワードの再設定</h1>
      </div>
      <div className="w-full max-w-md mx-auto">
        <form onSubmit={onSubmit} className="space-y-10">
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              autoComplete="new-password"
            />
            <Input
              type="password"
              placeholder="パスワード (確認)"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full"
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-4">
            <BlueButton type="submit" className="w-full" disabled={!password || !confirmPassword || password !== confirmPassword}>
              パスワードを変更
            </BlueButton>
            <Button variant="ghost" className="w-full" onClick={() => router.push("/")}>
              キャンセル
            </Button>

          </div>
        </form>
      </div>
    </div>
  )
}