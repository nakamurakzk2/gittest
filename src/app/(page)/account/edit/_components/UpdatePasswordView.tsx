"use client"

import { useState } from "react"

// Components
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import BlueButton from "@/components/BlueButton"

// Providers
import { useDialog } from "@/providers/dialog-provider"

// Logic
import * as UserEditPageServerLogic from "@/logic/server/user/user-edit-page-server-logic"


export default function UpdatePasswordView() {
  const { onFetch, setInfoDialogData, setErrorDialogData } = useDialog()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const onClickUpdate = async () => {
    if (newPassword !== confirmPassword) {
      setErrorDialogData({
        title: "エラー",
        description: "新しいパスワードと確認用のパスワードが一致しません",
      })
      return
    }
    await onFetch(async () => {
      await UserEditPageServerLogic.updatePassword(currentPassword, newPassword)
      setInfoDialogData({
        title: "お知らせ",
        description: "認証メールを送信しました。24時間以内にメール内のリンクにアクセスしてください。",
      })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    })
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        パスワードの変更
      </h2>

      {/* 現在のパスワード */}
      <div className="mb-6">
        <Label className="text-sm font-bold text-gray-800">
          現在のパスワード
        </Label>
        <Input
          type="password"
          placeholder="パスワード"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="mt-2"
        />
      </div>

      {/* 新しいパスワード */}
      <div className="mb-6">
        <Label className="text-sm font-bold text-gray-800">
          新しいパスワード
        </Label>
        <Input
          type="password"
          placeholder="パスワード"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-2"
        />
      </div>

      {/* 新しいパスワード（確認用） */}
      <div className="mb-6">
        <Label className="text-sm font-bold text-gray-800">
          新しいパスワード (確認用)
        </Label>
        <Input
          type="password"
          placeholder="パスワード"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-2"
        />
      </div>

      {/* 送信ボタン */}
      <div className="flex justify-start">
        <div>
          <BlueButton className="px-4" onClick={onClickUpdate}>
            認証メールを送信する
          </BlueButton>
        </div>
      </div>
    </div>
  )
}
