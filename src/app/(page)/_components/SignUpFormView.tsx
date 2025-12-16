"use client"

import { useState } from "react"
import { LANGUAGE_LIST } from "@/define/language"

// Entity
import { UserFormData } from "@/entity/user/user"

// Components
import { Input } from "@/components/ui/input"
import BlueButton from "@/components/BlueButton"
import { Separator } from "@/components/ui/separator"
import GoogleLoginButton from "../(home)/_components/GoogleLoginButton"
import TermsAndPrivacyCheck from "@/components/common/TermsAndPrivacyCheck"

// Providers
import { useLanguageSession } from "@/providers/language-provider"

// Logic
import * as CommonLogic from "@/logic/common-logic"


type Props = {
  onNext: (userFormData: UserFormData) => void
}

export default function SignUpFormView({ onNext }: Props) {
  const { getLocalizedText } = useLanguageSession()

  const [email, setEmail] = useState("")
  const [emailConfirm, setEmailConfirm] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [googleTermsAccepted, setGoogleTermsAccepted] = useState(false)
  const [googlePrivacyAccepted, setGooglePrivacyAccepted] = useState(false)

  const isPasswordMatch = password === passwordConfirm
  const isEmailMatch = email === emailConfirm
  const isFormValid = email && emailConfirm && password && passwordConfirm && termsAccepted && privacyAccepted && isPasswordMatch && isEmailMatch

  const handleNext = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!isFormValid) return
    const userFormData: UserFormData = {
      email,
      password,
    }
    onNext(userFormData)
  }

  return (
    <div className="w-full max-w-lg mx-auto px-8 bg-white">
      <form onSubmit={handleNext} className="space-y-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
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

        {/* Email Confirmation */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            {getLocalizedText(LANGUAGE_LIST.EmailConfirmation)}
          </label>
          <Input
            type="email"
            placeholder={getLocalizedText(LANGUAGE_LIST.EmailConfirmation)}
            value={emailConfirm}
            onChange={(e) => setEmailConfirm(e.target.value)}
            className="w-full"
            autoComplete="email"
          />
          {emailConfirm && !isEmailMatch && (
            <p className="text-red-500 text-sm mt-1">メールアドレスが異なります</p>
          )}
          {emailConfirm && isEmailMatch && !CommonLogic.isValidEmail(emailConfirm) && (
            <p className="text-red-500 text-sm mt-1">有効なメールアドレスではありません</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            {getLocalizedText(LANGUAGE_LIST.Password)}
          </label>
          <Input
            type="password"
            placeholder={getLocalizedText(LANGUAGE_LIST.Password)}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
            autoComplete="new-password"
          />
        </div>

        {/* Password Confirmation */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            {getLocalizedText(LANGUAGE_LIST.PasswordConfirmation)}
          </label>
          <Input
            type="password"
            placeholder={getLocalizedText(LANGUAGE_LIST.PasswordConfirmation)}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full"
            autoComplete="new-password"
          />
          {passwordConfirm && !isPasswordMatch && (
            <p className="text-red-500 text-sm mt-1">パスワードが異なります</p>
          )}
        </div>

        <TermsAndPrivacyCheck
          termsAccepted={termsAccepted}
          privacyAccepted={privacyAccepted}
          onTermsChange={setTermsAccepted}
          onPrivacyChange={setPrivacyAccepted}
        />

        <div className="space-y-4 pt-6">
          <BlueButton type="submit" disabled={!isFormValid}>
            {getLocalizedText(LANGUAGE_LIST.ProceedToConfirmation)}
          </BlueButton>
          <div className="text-center">
            <button type="button" className="text-sm text-gray-600 hover:text-gray-900">
              {getLocalizedText(LANGUAGE_LIST.Cancel)}
            </button>
          </div>
        </div>
      </form>

      <div className="py-6">
        <Separator />
      </div>

      <TermsAndPrivacyCheck
        termsAccepted={googleTermsAccepted}
        privacyAccepted={googlePrivacyAccepted}
        onTermsChange={setGoogleTermsAccepted}
        onPrivacyChange={setGooglePrivacyAccepted}
      />

      <div className="mt-10">
        <GoogleLoginButton isLogin={false} disabled={!googleTermsAccepted || !googlePrivacyAccepted} />
      </div>
    </div>
  )
}