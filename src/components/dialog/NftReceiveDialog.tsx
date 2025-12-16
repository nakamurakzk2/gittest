import Image from 'next/image'

// Components
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useEffect, useRef, useState, useMemo } from 'react'

type Props = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
  imageUrl: string
  walletAddress: string
  onChangeWalletAddress: (address: string) => void
  onClickReceive: () => void
}

export default function NftReceiveDialog({
  isOpen,
  onOpenChange,
  title,
  imageUrl,
  walletAddress,
  onChangeWalletAddress,
  onClickReceive
}: Props) {

  const inputRef = useRef<HTMLInputElement>(null)
  const [isReadOnly, setIsReadOnly] = useState(true)

  // Ethereumアドレスのバリデーション
  const isValidAddress = useMemo(() => {
    if (!walletAddress) return false
    // Ethereumアドレスの基本形式チェック（0xで始まる42文字の16進数）
    const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/
    return ethereumAddressRegex.test(walletAddress)
  }, [walletAddress])

  // エラーメッセージの表示判定
  const showError = useMemo(() => {
    return walletAddress.length > 0 && !isValidAddress
  }, [walletAddress, isValidAddress])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setIsReadOnly(false)
        inputRef.current?.blur()
      }, 100)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>NFTを受け取る</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex justify-center">
            <Image
              src={imageUrl}
              alt={title}
              width={200}
              height={200}
              className="rounded-lg"
            />
          </div>
          <div className="text-center font-bold text-lg">
            {title}
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-500">送付先アドレス</label>
            <Input
              placeholder="0x..."
              value={walletAddress}
              onChange={(e) => onChangeWalletAddress(e.target.value)}
              autoFocus={false}
              readOnly={isReadOnly}
              ref={inputRef}
              className={showError ? "border-red-500 focus:border-red-500" : ""}
            />
            {showError && (
              <div className="text-sm text-red-500">
                正しいEthereumアドレスを入力してください（0xで始まる42文字の16進数）
              </div>
            )}
          </div>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              キャンセル
            </Button>
            <Button 
              onClick={onClickReceive}
              disabled={!isValidAddress}
            >
              受け取る
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}