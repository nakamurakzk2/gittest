"use client"

import { useState, useEffect } from "react"

// Components
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Providers
import { useDialog } from "@/providers/dialog-provider"
import { toast } from "@/components/hooks/use-toast"

// Entity
import { SimpleUserWallet } from "@/entity/user/user"

// Logic
import * as CommonLogic from "@/logic/common-logic"
import * as UserWalletPageServerLogic from "@/logic/server/user/user-wallet-page-server-logic"


type Props = {
  simpleUserWallets: SimpleUserWallet[]
  transferAddress: string | null
  reload: () => void
}

export default function TransferAddressView({ simpleUserWallets, transferAddress, reload }: Props) {
  const { onFetch } = useDialog()
  const [selectedTransferAddress, setSelectedTransferAddress] = useState<string>("")

  useEffect(() => {
    setSelectedTransferAddress(transferAddress || "")
  }, [transferAddress])

  const onClickUpdateTransferAddress = async () => {
    await onFetch(async () => {
      await UserWalletPageServerLogic.updateTransferAddress(selectedTransferAddress)
      toast({
        title: "デフォルト送付先の設定が完了しました",
      })
      reload()
    })
  }

  return (
    <div className="space-y-4">
      <div className="text-lg font-bold">
      デフォルト送付先の設定
      </div>
      <div className="flex items-center gap-4">
        <Select value={selectedTransferAddress} onValueChange={setSelectedTransferAddress}>
          <SelectTrigger className="w-80">
            <SelectValue placeholder="送付先ウォレットを選択" />
          </SelectTrigger>
          <SelectContent>
            {simpleUserWallets.map((wallet) => (
              <SelectItem key={wallet.walletAddress} value={wallet.walletAddress}>
                {wallet.name} ({CommonLogic.shortenAddress(wallet.walletAddress)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={onClickUpdateTransferAddress}>
          保存
        </Button>
      </div>
    </div>
  )
}
