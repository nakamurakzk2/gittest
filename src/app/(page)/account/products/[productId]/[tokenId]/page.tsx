'use client'

import Link from "next/link"
import OwnProductView from "@/app/(page)/account/_components/OwnProductView"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"

// Constants
import { getBackgroundClass } from "@/define/colors"

interface PageProps {
  params: {
    productId: string
    tokenId: string
  }
}

export default function Page({ params }: PageProps) {
  const { productId, tokenId } = params
  const tokenIdNumber = parseInt(tokenId, 10)

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
                <Link href="/account">アカウント</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>商品詳細</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <OwnProductView
          productId={productId}
          tokenId={tokenIdNumber}
        />
      </div>

    </div>

  )
}
