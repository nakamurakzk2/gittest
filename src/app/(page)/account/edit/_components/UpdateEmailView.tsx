"use client"

import { useState } from "react"

// Components
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import BlueButton from "@/components/BlueButton"

// Providers
import { useDialog } from "@/providers/dialog-provider"
import { useLanguageSession } from "@/providers/language-provider"

// Define
import { LANGUAGE_LIST } from "@/define/language"

// Logic
import * as UserEditPageServerLogic from "@/logic/server/user/user-edit-page-server-logic"


interface Props {
  email: string | null
}

export default function UpdateEmailView({ email }: Props) {
  const { onFetch, setInfoDialogData } = useDialog()
  const { getLocalizedText } = useLanguageSession()

  const [newEmail, setNewEmail] = useState("")
  const [confirmEmail, setConfirmEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")

  const onClickUpdate = async () => {
    if (newEmail !== confirmEmail) {
      return
    }
    await onFetch(async () => {
      await UserEditPageServerLogic.updateEmail(newEmail, currentPassword)
      setInfoDialogData({
        title: getLocalizedText(LANGUAGE_LIST.Notification),
        description: getLocalizedText(LANGUAGE_LIST.EmailVerificationSent),
      })
      setNewEmail("")
      setConfirmEmail("")
      setCurrentPassword("")
    })
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {getLocalizedText(LANGUAGE_LIST.ChangeEmailAddress)}
      </h2>

      {/* 現在のメールアドレス */}
      <div className="mb-6">
        <Label className="text-sm font-bold text-gray-800">
          {getLocalizedText(LANGUAGE_LIST.CurrentEmailAddress)}
        </Label>
        <div className="mt-2">
          <span className="text-sm">{email || getLocalizedText(LANGUAGE_LIST.EmailNotSet)}</span>
        </div>
      </div>

      {/* 新しいメールアドレス */}
      <div className="mb-6">
        <Label className="text-sm font-bold text-gray-800">
          {getLocalizedText(LANGUAGE_LIST.NewEmailAddress)}
        </Label>
        <Input
          type="email"
          placeholder={getLocalizedText(LANGUAGE_LIST.EmailAddress)}
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="mt-2"
        />
      </div>

      {/* 新しいメールアドレス（確認用） */}
      <div className="mb-6">
        <Label className="text-sm font-bold text-gray-800">
          {getLocalizedText(LANGUAGE_LIST.NewEmailAddressConfirmation)}
        </Label>
        <Input
          type="email"
          placeholder={getLocalizedText(LANGUAGE_LIST.EmailAddress)}
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
          className="mt-2"
        />
      </div>

      {/* 現在のパスワード */}
      <div className="mb-6">
        <Label className="text-sm font-bold text-gray-800">
          {getLocalizedText(LANGUAGE_LIST.CurrentPassword)}
        </Label>
        <Input
          type="password"
          placeholder={getLocalizedText(LANGUAGE_LIST.Password)}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="mt-2"
        />
      </div>

      {/* 送信ボタン */}
      <div className="flex justify-start">
        <div>
          <BlueButton className="px-4" onClick={onClickUpdate}>
            {getLocalizedText(LANGUAGE_LIST.SendVerificationEmail)}
          </BlueButton>
        </div>
      </div>
    </div>
  )
}
