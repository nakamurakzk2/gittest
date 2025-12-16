"use client"

// Components
import { Checkbox } from "@/components/ui/checkbox"

// Providers
import { useLanguageSession } from "@/providers/language-provider"

// Define
import { LANGUAGE_LIST } from "@/define/language"

type Props = {
  termsAccepted: boolean
  privacyAccepted: boolean
  onTermsChange: (accepted: boolean) => void
  onPrivacyChange: (accepted: boolean) => void
}

export default function TermsAndPrivacyCheck({
  termsAccepted,
  privacyAccepted,
  onTermsChange,
  onPrivacyChange,
}: Props) {
  const { getLocalizedText } = useLanguageSession()

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={termsAccepted}
          onCheckedChange={(checked) => onTermsChange(checked as boolean)}
        />
        <button
          type="button"
          onClick={() => window.open('/terms', '_blank')}
          className="text-sm text-gray-700 hover:text-gray-900 border-b border-gray-400 hover:border-gray-600"
        >
          {getLocalizedText(LANGUAGE_LIST.TermsOfServiceAgree)}
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="privacy"
          checked={privacyAccepted}
          onCheckedChange={(checked) => onPrivacyChange(checked as boolean)}
        />
        <button
          type="button"
          onClick={() => window.open('/privacy', '_blank')}
          className="text-sm text-gray-700 hover:text-gray-900 border-b border-gray-400 hover:border-gray-600"
        >
          {getLocalizedText(LANGUAGE_LIST.PrivacyPolicyAgree)}
        </button>
      </div>
    </div>
  )
}
