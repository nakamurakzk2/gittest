'use client'

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

export default function PageManagementPage() {
  const { simpleAdminUser } = useAdminSession()

  if (simpleAdminUser == null || (simpleAdminUser.adminUserType !== AdminUserType.ENGINEER && simpleAdminUser.adminUserType !== AdminUserType.SUPER_ADMIN)) {
    return <NoPermissionView />
  }

  return (
    <main className="max-w-4xl mx-auto px-2 py-6">
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
            <BreadcrumbPage>ページ管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-6">
        <div className="text-xl font-bold">
          ページ管理
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
            <Link href="/admin/page-management/top-banners">
              <div className="text-lg font-medium">TOPバナー</div>
              <div className="text-sm text-muted-foreground">トップページのバナー管理</div>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
            <Link href="/admin/page-management/top-pickups">
              <div className="text-lg font-medium">ピックアップ</div>
              <div className="text-sm text-muted-foreground">ピックアップアイテム管理</div>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
            <Link href="/admin/page-management/campaign-banners">
              <div className="text-lg font-medium">特集バナー</div>
              <div className="text-sm text-muted-foreground">特集バナー管理</div>
            </Link>
          </Button>

        </div>
      </div>
    </main>
  )
}
