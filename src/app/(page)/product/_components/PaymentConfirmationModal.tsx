"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Components
import { Dialog, DialogContent } from "@/components/ui/dialog"
import BlueButton from "@/components/BlueButton"

type Props = {
  isOpen: boolean
  onClose: () => void
  productId: string
  tokenId: number
}

export function PaymentConfirmationModal({ isOpen, onClose, productId, tokenId }: Props) {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (!isOpen) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push(`/account/products/${productId}/${tokenId}`)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, productId, tokenId, router])

  const onClickProductDetails = () => {
    router.push(`/account/products/${productId}/${tokenId}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <div className="space-y-4">
          {/* 上部の線 */}
          <div className="border-t border-black"></div>

          {/* タイトル */}
          <div className="text-center">
            <p className="text-red-600 font-bold">※要確認</p>
          </div>

          {/* 下部の線 */}
          <div className="border-t border-black"></div>

          {/* メインコンテンツ */}
          <div className="space-y-3 text-sm">
            <p>
              一部の商品につきましては、
              <span className="text-red-600 font-bold">
                ご購入後にお届け先住所などの詳細情報を入力していただく必要
              </span>
              があります。
            </p>

            <p>
              お手数ですが、下記のURLより商品詳細ページヘアクセスのうえ、必要事項の入力を完了させてください。
            </p>

            <p>
              <span className="text-red-600 font-bold">※{countdown}秒後</span>
              に自動で、商品詳細ページに遷移します。
            </p>
          </div>

          {/* ボタン */}
          <div className="flex justify-center pt-4">
            <BlueButton onClick={onClickProductDetails}>
              商品詳細
            </BlueButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
