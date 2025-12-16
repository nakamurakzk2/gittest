"use client"

import { useEffect, useState } from "react"

// Entity
import { SimpleUserWallet } from "@/entity/user/user"

// Providers
import { useDialog } from "@/providers/dialog-provider"

// Logic
import * as UserWalletPageServerLogic from "@/logic/server/user/user-wallet-page-server-logic"

// Components
import WalletListView from "@/app/(page)/account/external-integration/_components/WalletListView"
import TransferAddressView from "@/app/(page)/account/external-integration/_components/TransferAddressView"
import WalletAddButton from "@/app/(page)/account/external-integration/_components/WalletAddButton"
import { Web3AuthButton } from "@/components/Web3AuthButton"

export default function WalletManageView() {
  const { onFetch } = useDialog()
  const [simpleUserWallets, setSimpleUserWallets] = useState<SimpleUserWallet[]>([])
  const [transferAddress, setTransferAddress] = useState<string | null>(null)

  const reload = async () => {
      await onFetch(async () => {
      const { simpleUserWallets, transferAddress } = await UserWalletPageServerLogic.fetchWalletPage()
      setSimpleUserWallets(simpleUserWallets)
      setTransferAddress(transferAddress)
    })
  }

  useEffect(() => {
    reload()
  }, [])

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10">
        <Web3AuthButton
          simpleUserWallets={simpleUserWallets}
          title="WalletConnect"
        />
        <div>
          <WalletAddButton reload={reload} simpleUserWallets={simpleUserWallets} />
        </div>
      </div>

      <div className="space-y-12">
        <WalletListView
          simpleUserWallets={simpleUserWallets}
          reload={reload}
        />

        <TransferAddressView
          simpleUserWallets={simpleUserWallets}
          transferAddress={transferAddress}
          reload={reload}
        />

      </div>
    </div>
  )
}
