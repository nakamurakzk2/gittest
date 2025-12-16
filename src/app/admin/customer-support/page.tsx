'use client'

import { useEffect } from "react"
import { HomeIcon } from "lucide-react"
import Link from "next/link"

// Providers
import { useAdminSession } from "@/providers/admin-session-provider"

// Entity
import { AdminUserType } from "@/entity/admin/user"

// Components
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import NoPermissionView from "@/components/common/NoPermissionView"
import TownSelectCard from "@/components/common/TownSelectCard"
import BusinessSelectCard from "@/components/common/BusinessSelectCard"
import CustomerSupportView from "./_components/CustomerSupportView"

export default function CustomerSupportPage() {
  const { simpleAdminUser, townId, setTownId, businessId, setBusinessId } = useAdminSession()

  useEffect(() => {
    if (simpleAdminUser == null || simpleAdminUser.businessId == null) return
    setBusinessId(simpleAdminUser.businessId)
  }, [simpleAdminUser, setBusinessId])

  if (simpleAdminUser == null) {
    return <NoPermissionView />
  }

  return (
    <main className="max-w-7xl mx-auto px-2 py-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin" className="flex items-center gap-1">
                <HomeIcon className="h-4 w-4" /> Admin
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>顧客対応</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-6">
        <div className="text-xl font-bold">
          顧客対応管理
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
            <Link href="/admin/customer-support/product-chat">
              <div className="text-lg font-medium">商品チャット</div>
              <div className="text-sm text-muted-foreground">顧客との商品チャット管理</div>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
            <Link href="/admin/customer-support/pre-talk-chat">
              <div className="text-lg font-medium">事前相談チャット</div>
              <div className="text-sm text-muted-foreground">顧客との事前相談チャット管理</div>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
            <Link href="/admin/customer-support/form-answers">
              <div className="text-lg font-medium">フォーム回答</div>
              <div className="text-sm text-muted-foreground">フォーム回答状況の確認</div>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
            <Link href="/admin/customer-support/own-products">
              <div className="text-lg font-medium">商品購入ユーザ</div>
              <div className="text-sm text-muted-foreground">商品の所有者管理</div>
            </Link>
          </Button>
        </div>


        <CustomerSupportView
          townId={simpleAdminUser.townId || ''}
          businessId={simpleAdminUser.businessId || ''}
        />
      </div>
    </main>
  )
}
