"use client"

// Components
import BlueButton from "@/components/BlueButton"
import { Button } from "@/components/ui/button"

// Entity
import { UserFormData } from "@/entity/user/user"


type Props = {
  formData: UserFormData
  onCancel: () => void
  onSubmit: () => void
}

export default function SignUpConfirmView({ formData, onCancel, onSubmit }: Props) {

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      <div className="space-y-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            メールアドレス
          </label>
          <div className="p-3 bg-gray-50 rounded-md text-gray-900">
            {formData.email}
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            パスワード
          </label>
          <div className="p-3 bg-gray-50 rounded-md text-gray-900">
            {"●".repeat(formData.password.length)}
          </div>
        </div>

        {/* Terms and Privacy */}
        <div className="space-y-2">
          <div className="p-3 bg-gray-50 rounded-md text-gray-900 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-green-600">✓</span>
              <span>利用規約に同意済み</span>
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-md text-gray-900 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-green-600">✓</span>
              <span>プライバシーポリシーに同意済み</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-4 pt-6">
          <BlueButton onClick={onSubmit}>
            アカウント作成
          </BlueButton>
          <div className="text-center">
            <Button variant="ghost" onClick={onCancel}>
              編集画面に戻る
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}