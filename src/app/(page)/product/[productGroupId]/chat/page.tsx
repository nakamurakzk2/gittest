'use client'

import Link from "next/link"
import { getBackgroundClass } from "@/define/colors"

// Components
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import BlueButton from "@/components/BlueButton"
import PreTalkChatView from "@/app/(page)/product/_components/PreTalkChatView"

// Providers
import { useUserSession } from "@/providers/user-session-provider"
import { useRouter } from "next/navigation"
import { useLanguageSession } from "@/providers/language-provider"
import { LANGUAGE_LIST } from "@/define/language"

type Props = {
  params: { productGroupId: string }
  searchParams: { productId?: string }
}

export default function ProductGroupChatPage({ params, searchParams }: Props) {
  const productId = searchParams.productId as string
  const productGroupId = params.productGroupId as string
  const router = useRouter()

  const { getLocalizedText } = useLanguageSession()
  const { simpleUser } = useUserSession()

  return (
    <div className={`w-full ${getBackgroundClass('PRIMARY')} min-h-screen`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
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
                <Link href={`/product/${productGroupId}?productId=${productId}`}>商品</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>事前相談チャット</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {simpleUser == null && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-8">
              事前相談チャットを利用するにはログインが必要です
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
        )}

        {simpleUser != null && (
          <PreTalkChatView
            productId={productId}
          />
        )}
      </div>
    </div>
  )
}