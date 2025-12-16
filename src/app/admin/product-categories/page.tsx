'use client'

import { HomeIcon } from "lucide-react"
import Link from "next/link"

// Providers
import { useAdminSession } from "@/providers/admin-session-provider"

// Entity
import { AdminUserType } from "@/entity/admin/user"

// Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import ProductCategoriesView from "@/app/admin/product-categories/_components/ProductCategoriesView"
import NoPermissionView from "@/components/common/NoPermissionView"

export default function ProductCategoriesPage() {
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
            <BreadcrumbPage>商品カテゴリ管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-6">
        <div className="text-xl font-bold">
          商品カテゴリ管理
        </div>

        <Card>
          <CardHeader>
            <CardTitle>商品カテゴリ一覧</CardTitle>
            <CardDescription>
              商品カテゴリを表示・管理します
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductCategoriesView />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}