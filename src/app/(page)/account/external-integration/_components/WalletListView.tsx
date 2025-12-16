"use client"

import { useEffect, useState } from "react"

// Providers
import { useDialog } from "@/providers/dialog-provider"

// Entity
import { SimpleUserWallet } from "@/entity/user/user"

// Logic
import * as UserWalletPageServerLogic from "@/logic/server/user/user-wallet-page-server-logic"
import { shortenAddress } from "@/logic/common-logic"

// Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy } from "lucide-react"
import { toast } from "@/components/hooks/use-toast"
import { useAccount } from "wagmi"

type Props = {
  simpleUserWallets: SimpleUserWallet[]
  reload: () => void
}

export default function WalletListView({ simpleUserWallets, reload }: Props) {
  const { onFetch, setYesNoDialogData } = useDialog()
  const { address } = useAccount()

  const [editingWallet, setEditingWallet] = useState<string | null>(null)
  const [editingName, setEditingName] = useState<string>("")
  const [currentAddress, setCurrentAddress] = useState<string | null>(null)

  // 通常のウォレット接続の場合
  useEffect(() => {
    if (address == null) return
    setCurrentAddress(address.toLowerCase())
  }, [address])

  const onClickEditWalletName = (walletAddress: string, currentName: string) => {
    setEditingWallet(walletAddress)
    setEditingName(currentName)
  }

  /**
   * ウォレット名を保存
   */
  const onClickSaveWalletName = async () => {
    if (!editingWallet) return
    await onFetch(async () => {
      await UserWalletPageServerLogic.updateWalletName(editingWallet, editingName)
      await reload()
      setEditingWallet(null)
      setEditingName("")
    })
  }

  /**
   * ウォレット名編集をキャンセル
   */
  const onClickCancelWalletName = () => {
    setEditingWallet(null)
    setEditingName("")
  }

  /**
   * ウォレットを削除
   * @param walletAddress ウォレットアドレス
   * @param walletName
   */
  const onClickDeleteWallet = (walletAddress: string, walletName: string) => {
    setYesNoDialogData({
      title: "ウォレットの削除",
      description: `「${walletName}」ウォレットの連携を解除しますか？\nこの操作は取り消せません。`,
      onOk: async () => {
        await onFetch(async () => {
          await UserWalletPageServerLogic.deleteWallet(walletAddress)
          await reload()
        })
      }
    })
  }

  const onClickCopyAddress = async (address: string) => {
    await navigator.clipboard.writeText(address)
    toast({
      title: "コピーしました",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">連携済みウォレット</h2>
        <Badge variant="secondary">{simpleUserWallets.length}件</Badge>
      </div>

      {simpleUserWallets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">連携済みのウォレットがありません</p>
          <p className="text-sm text-muted-foreground mt-2">ウォレットを追加して始めましょう</p>
        </div>
      )}

      {simpleUserWallets.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
          {simpleUserWallets.map((wallet) => (
            <Card key={wallet.walletAddress} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {editingWallet === wallet.walletAddress ? (
                    <div className="flex flex-col sm:flex-row items-start gap-2">
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1 max-w-xs"
                        placeholder="ウォレット名を入力"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={onClickSaveWalletName}>
                          保存
                        </Button>
                        <Button size="sm" variant="outline" onClick={onClickCancelWalletName}>
                          キャンセル
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm font-bold truncate">{wallet.name}</div>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-sm text-muted-foreground font-mono">
                      {shortenAddress(wallet.walletAddress)}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onClickCopyAddress(wallet.walletAddress)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    {currentAddress === wallet.walletAddress && (
                      <Badge variant="default" className="text-xs">
                        接続中
                      </Badge>
                    )}
                  </div>
                </div>

                {editingWallet !== wallet.walletAddress && (
                  <div className="flex gap-2 sm:ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onClickEditWalletName(wallet.walletAddress, wallet.name)}
                      className="flex-1 sm:flex-none"
                    >
                      名前を変更
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onClickDeleteWallet(wallet.walletAddress, wallet.name)}
                      className="flex-1 sm:flex-none"
                    >
                      接続を解除
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
