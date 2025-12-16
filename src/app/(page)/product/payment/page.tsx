'use client'

import { useSearchParams } from "next/navigation"
import { PaymentView } from "@/app/(page)/product/_components/PaymentView"

// Providers
import { useLanguageSession } from "@/providers/language-provider"

// Define
import { LANGUAGE_LIST } from "@/define/language"

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const productId = searchParams.get('productId')
  const amount = searchParams.get('amount')
  const { getLocalizedText } = useLanguageSession()

  if (!productId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{getLocalizedText(LANGUAGE_LIST.Error)}</h1>
          <p className="text-gray-600">{getLocalizedText(LANGUAGE_LIST.ProductIdNotSpecified)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8">
        <PaymentView
          productId={productId}
          amount={amount ? parseInt(amount) : 1}
        />
      </div>
    </div>
  )
}
