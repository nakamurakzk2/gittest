"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"
import { DialogProvider } from "@/providers/dialog-provider"
import { Toaster } from "@/components/ui/toaster"
import { Web3AuthContextConfig, Web3AuthProvider } from "@web3auth/modal/react"
import { WagmiProvider } from "@web3auth/modal/react/wagmi"
import { WEB3AUTH_NETWORK } from '@web3auth/modal'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { LanguageSessionProvider } from "@/providers/language-provider"

const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID as string,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  },
}

export function ClientProviders({ children, cookies }: { children: React.ReactNode; cookies: string | null }) {
  const queryClient = new QueryClient()
  return (
    <Web3AuthProvider config={web3AuthContextConfig}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider>
          <LanguageSessionProvider>
            <DialogProvider>
              <NextAuthSessionProvider>
                {children}
              </NextAuthSessionProvider>
            </DialogProvider>
          </LanguageSessionProvider>
          <Toaster />
        </WagmiProvider>
      </QueryClientProvider>
    </Web3AuthProvider>
  )
}