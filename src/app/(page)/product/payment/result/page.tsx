'use client'

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { PaymentResultView } from "@/app/(page)/product/_components/PaymentResultView"
import { PaymentConfirmationModal } from "@/app/(page)/product/_components/PaymentConfirmationModal"

// Providers
import { useLanguageSession } from "@/providers/language-provider"
import { useDialog } from "@/providers/dialog-provider"

// Logic
import * as ProductPaymentServerLogic from "@/logic/server/product/product-payment-server-logic"

// Entity
import { ResponsePaymentResult } from "@/entity/response"

// Define
import { LANGUAGE_LIST } from "@/define/language"

export default function PaymentResultPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || ''
  const requestId = searchParams.get('RequestId') || ''
  const townId = searchParams.get('townId') || ''

  const { getLocalizedText } = useLanguageSession()
  const { onFetch } = useDialog()

  const [productData, setProductData] = useState<ResponsePaymentResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  const fetchProductData = async () => {
    if (!requestId && !orderId) {
      setIsLoading(false)
      return
    }

    await onFetch(async () => {
      try {
        if (requestId != '' && townId != '') {
          const data = await ProductPaymentServerLogic.searchCreditResult(requestId, townId)
          setProductData(data)
        } else if (orderId != '') {
          const data = await ProductPaymentServerLogic.searchBankResult(orderId)
          setProductData(data)
        }
      } catch (error) {
        console.error('Failed to fetch product data:', error)
        setError(error instanceof Error ? error.message : getLocalizedText(LANGUAGE_LIST.ErrorOccurred))
        setProductData(null)
      } finally {
        setIsLoading(false)
      }
    })
  }

  useEffect(() => {
    fetchProductData()
  }, [requestId, orderId, townId])

  // 2秒後にモーダルを表示
  useEffect(() => {
    if (productData && productData.simpleProductItem && productData.tokenIds && productData.tokenIds.length > 0) {
      const timer = setTimeout(() => {
        setShowConfirmationModal(true)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [productData])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{getLocalizedText(LANGUAGE_LIST.LoadingPaymentInfo)}</p>
        </div>
      </div>
    )
  }

  if (!requestId && !orderId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{getLocalizedText(LANGUAGE_LIST.Error)}</h1>
          <p className="text-gray-600">{getLocalizedText(LANGUAGE_LIST.InvalidRequest)}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{getLocalizedText(LANGUAGE_LIST.Error)}</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!productData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{getLocalizedText(LANGUAGE_LIST.Error)}</h1>
          <p className="text-gray-600">{getLocalizedText(LANGUAGE_LIST.FailedToLoadPaymentInfo)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8">
        <PaymentResultView
          simpleProductGroup={productData.simpleProductGroup}
          simpleProductItem={productData.simpleProductItem}
          amount={productData.amount}
          price={productData.price}
          billingInfo={productData.billingInfo}
          simpleBusiness={productData.simpleBusiness}
          tokenIds={productData.tokenIds}
          paymentType={productData.paymentType}
        />
      </div>

      <PaymentConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        productId={productData.simpleProductItem.productId}
        tokenId={productData.tokenIds[0]}
      />
    </div>
  )
}
