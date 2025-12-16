"use client"

import { LANGUAGE_LIST } from "@/define/language"
import { getBackgroundClass } from "@/define/colors"
import { useRouter } from "next/navigation"
import { ArrowDown } from "lucide-react"
import Link from "next/link"

// Components
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import BlueButton from "@/components/BlueButton"
import OwnProductsView from "@/app/(page)/account/_components/OwnProductsView"

// Providers
import { useDialog } from "@/providers/dialog-provider"
import { useUserSession } from "@/providers/user-session-provider"
import { useLanguageSession } from "@/providers/language-provider"


export default function AccountPage() {
  const router = useRouter()

  const { setYesNoDialogData } = useDialog()
  const { simpleUser, logout, loading } = useUserSession()
  const { getLocalizedText } = useLanguageSession()

  const onClickLogout = async () => {
    setYesNoDialogData({
      title: getLocalizedText(LANGUAGE_LIST.LogoutTitle),
      description: getLocalizedText(LANGUAGE_LIST.Logout),
      onOk: async () => {
        await logout()
        router.push("/")
      },
      onCancel: () => {}
    })
  }

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
                <BreadcrumbPage>アカウント</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* ログインが必要な旨を表示 */}
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {getLocalizedText(LANGUAGE_LIST.Account)}
            </h1>
            <p className="text-gray-600 mb-8">
              アカウント情報を表示するにはログインが必要です
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
              <BreadcrumbPage>アカウント</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {getLocalizedText(LANGUAGE_LIST.Account)}
        </h1>
        <div className="flex justify-end items-center">
          <div>
            <Link href="/account/external-integration">
              <BlueButton className="flex items-center justify-center gap-1 text-xs">
                <ArrowDown className="w-4 h-4" />
                {getLocalizedText(LANGUAGE_LIST.ExternalIntegrationPage)}
              </BlueButton>
            </Link>

          </div>
        </div>
        <div className="mt-12">
          <OwnProductsView />
        </div>
        <div className="my-6 flex justify-center items-center gap-2 sm:gap-10">
          <div>
            <Link href="/account/edit">
              <BlueButton className="px-4">
                アカウント情報の編集
              </BlueButton>
            </Link>
          </div>
          <div>
            <BlueButton className="px-4" onClick={onClickLogout}>
              {getLocalizedText(LANGUAGE_LIST.LogoutTitle)}
            </BlueButton>
          </div>
        </div>
      </div>
    </div>
  )
}
