'use client'

import Link from "next/link"
import { HomeIcon } from "lucide-react"

// Providers
import { useAdminSession } from "@/providers/admin-session-provider"

// Entity
import { AdminUserType } from "@/entity/admin/user"

// Components
import { Card, CardContent } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import TownUsersView from "@/app/admin/(users)/_components/TownUsersView"
import TownApplicationsView from "@/app/admin/(users)/_components/TownApplicationsView"
import NoPermissionView from "@/components/common/NoPermissionView"


export default function TownUsersPage() {
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
            <BreadcrumbPage>自治体ユーザー管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-4">
        <div className="text-xl font-bold">
          自治体ユーザー管理
        </div>
      </div>

      <div className="space-y-6">
        <Card className="py-6">
          <CardContent className="space-y-6">
            <TownApplicationsView />
            <TownUsersView />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}