"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { Eip1193Provider } from "ethers"

// Providers
import { useDialog } from "@/providers/dialog-provider"
import { toast } from "@/components/hooks/use-toast"

// Components
import BlueButton from "@/components/BlueButton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Logic
import * as ContractLogic from "@/logic/contract-logic"
import * as UserWalletPageServerLogic from "@/logic/server/user/user-wallet-page-server-logic"

// Entity
import { SimpleUserWallet } from "@/entity/user/user"
import { useWeb3AuthConnect } from "@web3auth/modal/react"

type Props = {
  reload: () => void
  simpleUserWallets: SimpleUserWallet[]
}

export default function WalletAddButton({ reload, simpleUserWallets }: Props) {
  const { address, connector } = useAccount()
  const { connectorName } = useWeb3AuthConnect()
  const { onFetch } = useDialog()
  const [walletName, setWalletName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // 現在接続中のウォレットが既に連携済みかどうかを判定
  const isConnectedWalletLinked = address && simpleUserWallets.some(wallet =>
    wallet.walletAddress.toLowerCase() === address.toLowerCase()
  )

  const onClickAddWallet = async () => {
    if (address == null || connector == null || connector.getProvider() == null) return
    if (!walletName.trim()) {
      toast({
        title: "エラー",
        description: "ウォレット名を入力してください",
        variant: "destructive"
      })
      return
    }

    await onFetch(async () => {
      const provider = await connector.getProvider() as Eip1193Provider
      const { message } = await UserWalletPageServerLogic.fetchSignMessage(address)
      const signature = await ContractLogic.sign(provider, message)
      const isWeb3Auth = connectorName === 'auth'
      await UserWalletPageServerLogic.addWallet(signature, address, walletName.trim(), isWeb3Auth)
      toast({
        title: "ウォレットの連携が完了しました",
      })
      setWalletName("")
      setIsDialogOpen(false)
      reload()
    })
  }

  if (address == null) {
    return (
      <div className="text-sm text-gray-500">
        ウォレットを接続してください
      </div>
    )
  }

  if (isConnectedWalletLinked) {
    return (
      <div className="text-sm text-green-600">
        このウォレットは既に連携済みです
      </div>
    )
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <BlueButton>
          新しくウォレットを連携する
        </BlueButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>ウォレット連携</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wallet-address">ウォレットアドレス</Label>
            <Input
              id="wallet-address"
              value={address}
              disabled
              className="bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wallet-name">ウォレット名</Label>
            <Input
              id="wallet-name"
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
              placeholder="例: メインウォレット"
              maxLength={50}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              キャンセル
            </Button>
            <Button onClick={onClickAddWallet}>
              連携する
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
