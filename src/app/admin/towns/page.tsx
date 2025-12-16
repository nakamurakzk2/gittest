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
import TownsView from "@/app/admin/towns/_components/TownsView"
import NoPermissionView from "@/components/common/NoPermissionView"
import TownSelectCard from "@/components/common/TownSelectCard"

export default function TownsPage() {
  const { simpleAdminUser} = useAdminSession()

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
            <BreadcrumbPage>自治体管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-6">
        <div className="text-xl font-bold">
          自治体管理
        </div>

        <Card>
          <CardHeader>
            <CardTitle>自治体一覧</CardTitle>
            <CardDescription>
              自治体を表示・管理します
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TownsView />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}