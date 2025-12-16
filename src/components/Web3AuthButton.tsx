"use client"

import { useEffect, useState } from "react"
import { BrowserProvider, ethers } from "ethers"

// Providers
import { useDialog } from "@/providers/dialog-provider"

// Entity
import { SimpleUserWallet } from "@/entity/user/user"

// Components
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuPortal } from '@/components/ui/dropdown-menu'
import { Badge } from "@/components/ui/badge"
import { useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser } from "@web3auth/modal/react"
import { useAccount } from "wagmi"



type Props = {
  title: string
  simpleUserWallets?: SimpleUserWallet[]
}

export function Web3AuthButton({ title, simpleUserWallets = [] }: Props) {
  const { address } = useAccount()
  const { connect, connectorName, isConnected } = useWeb3AuthConnect()
  const { disconnect } = useWeb3AuthDisconnect()

  const [ dropdownOpen, setDropdownOpen ] = useState(false)

  // 現在接続中のウォレットが連携済みかどうかを判定
  const isConnectedWalletLinked = address && simpleUserWallets.some(wallet =>
    wallet.walletAddress.toLowerCase() === address.toLowerCase()
  )

  if (address == null) {
    return (
      <Button onClick={() => connect()}>
        {title}
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="default">
            {address == null ? '' : `${address.slice(0, 6)} ... ${address.slice(-4)}`}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent className="z-50">
            <DropdownMenuItem onClick={() => disconnect()}>
              ウォレット切断
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>

      {isConnectedWalletLinked && (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          連携済み
        </Badge>
      )}
      {!isConnectedWalletLinked && (
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          未連携
        </Badge>
      )}
    </div>
  )
}
