"use client"

import { LANGUAGE_LIST } from "@/define/language"
import { getBackgroundClass } from "@/define/colors"
import { useAccount } from "wagmi"
import Link from "next/link"

// Components
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import BlueButton from "@/components/BlueButton"
import WalletSelectView from "@/app/(page)/account/external-integration/_components/WalletSelectView"
import WalletManageView from "@/app/(page)/account/external-integration/_components/WalletManageView"

// Providers
import { useUserSession } from "@/providers/user-session-provider"
import { useLanguageSession } from "@/providers/language-provider"

export default function ExternalIntegrationPage() {
  const { simpleUser, loading } = useUserSession()
  const { address } = useAccount()
  const { getLocalizedText } = useLanguageSession()

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="px-6 py-8">
          <div className="text-center">読み込み中...</div>
        </div>
      </div>
    )
  }

  if (!simpleUser) {
    return (
      <div className={`w-full ${getBackgroundClass('PRIMARY')} min-h-screen`}>
        <div className="px-6 py-6 max-w-6xl mx-auto">
          {/* パンくずリスト */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">ホーム</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/account">アカウント</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>外部連携</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* ログインが必要な旨を表示 */}
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {getLocalizedText(LANGUAGE_LIST.ExternalIntegrationPage)}
            </h1>
            <p className="text-gray-600 mb-8">
              外部連携機能を利用するにはログインが必要です
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/login">
                <BlueButton className="px-6">
                  {getLocalizedText(LANGUAGE_LIST.Login)}
                </BlueButton>
              </Link>
              <Link href="/signup">
                <BlueButton className="px-6" variant="outline">
                  {getLocalizedText(LANGUAGE_LIST.Signup)}
                </BlueButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full ${getBackgroundClass('PRIMARY')} min-h-screen`}>
      <div className="px-6 py-6 max-w-6xl mx-auto">
        {/* パンくずリスト */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">ホーム</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/account">アカウント</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>外部連携</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {getLocalizedText(LANGUAGE_LIST.ExternalIntegrationPage)}
        </h1>


        {address == null && (
          <WalletSelectView />
        )}

        {(address != null) && (
          <WalletManageView />
        )}
      </div>
    </div>
  )
}
