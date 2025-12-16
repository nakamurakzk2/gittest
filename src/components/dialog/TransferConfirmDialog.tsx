"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

// Components
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import BlueButton from "@/components/BlueButton"

// Entity
import { SimpleOwnProduct } from "@/entity/product/product"

interface TransferConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  product: SimpleOwnProduct | null
  transferAddress: string | null
}

export default function TransferConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  product,
  transferAddress,
}: TransferConfirmDialogProps) {
  const router = useRouter()

  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-medium">
            転送確認
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 商品画像 */}
          <div className="flex justify-center">
            <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              {product.image.length > 0 ? (
                <Image
                  src={product.image}
                  alt={product.title.ja}
                  width={128}
                  height={128}
                  className="object-cover rounded-lg"
                />
              ) : (
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-2xl">📷</span>
                </div>
              )}
            </div>
          </div>

          {/* 確認メッセージ */}
          <div className="text-center space-y-3">
            <p className="text-base">
              こちらの商品を接続済みのウォレットに送付しますか。
            </p>

            {/* ウォレットアドレス表示 */}
            <div className="text-sm text-gray-600">
              {transferAddress || "XX0000XXXXXXXXXXXXXXXXXXXXXXXXXXX"}
            </div>

            {/* ウォレット変更リンク */}
            <div className="flex justify-center">
              <button
                onClick={() => router.push("/account/external-integration")}
                className="text-blue-600 underline text-sm hover:text-blue-800"
              >
                ウォレットを変更
              </button>
            </div>

            {/* 区切り線 */}
            <div className="border-t border-gray-300"></div>
          </div>

          {/* ボタン */}
          <div className="flex gap-3">
            <BlueButton className="flex-1" onClick={onConfirm}>
              はい
            </BlueButton>
            <Button variant="outline" className="flex-1 rounded-full" onClick={onClose}>
              いいえ
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
