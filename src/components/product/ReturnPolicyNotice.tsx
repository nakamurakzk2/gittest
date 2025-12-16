'use client'

import { useLanguageSession } from "@/providers/language-provider"
import { LANGUAGE_LIST } from "@/define/language"

export default function ReturnPolicyNotice() {
  const { getLocalizedText } = useLanguageSession()

  return (
    <div className="text-sm text-gray-700">
      <h3 className="font-bold text-base text-gray-900 mb-3">
        {getLocalizedText(LANGUAGE_LIST.ReturnPolicyTitle)}
      </h3>
      <div className="space-y-2">
        <p>
          (1) <span className="text-red-500 font-semibold"> {getLocalizedText(LANGUAGE_LIST.ReturnPolicyNftNotAllowed)}</span>
          {getLocalizedText(LANGUAGE_LIST.ReturnPolicyNftReason)}
        </p>
        <p>
          (2) <span className="text-red-500 font-semibold">{getLocalizedText(LANGUAGE_LIST.ReturnPolicyItemNotAllowed)}</span>
        </p>
        <p>
          (3) {getLocalizedText(LANGUAGE_LIST.ReturnPolicyService)}
        </p>
      </div>
      <p className="mt-5 text-sm">
        {getLocalizedText(LANGUAGE_LIST.ReturnPolicyNote)}
      </p>
    </div>
  )
}

