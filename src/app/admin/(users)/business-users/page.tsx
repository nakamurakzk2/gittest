'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { HomeIcon } from "lucide-react"

// Providers
import { useAdminSession } from "@/providers/admin-session-provider"

// Entity
import { AdminUserType } from "@/entity/admin/user"

// Components
import { Card, CardContent } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import NoPermissionView from "@/components/common/NoPermissionView"
import BusinessApplicationsView from "@/app/admin/(users)/_components/BusinessApplicationsView"
import BusinessUsersView from "@/app/admin/(users)/_components/BusinessUsersView"
import TownSelectCard from "@/components/common/TownSelectCard"


export default function BusinessUsersPage() {
  const { simpleAdminUser, townId, setTownId } = useAdminSession()

  useEffect(() => {
    if (simpleAdminUser == null) return
    if (simpleAdminUser.townId) {
      setTownId(simpleAdminUser.townId)
    }
  }, [simpleAdminUser])

  if (simpleAdminUser == null || simpleAdminUser.adminUserType !== AdminUserType.ENGINEER && simpleAdminUser.adminUserType !== AdminUserType.SUPER_ADMIN && simpleAdminUser.adminUserType !== AdminUserType.TOWN  && simpleAdminUser.adminUserType !== AdminUserType.TOWN_VIEWER) {
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
            <BreadcrumbPage>事業者ユーザー管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-4">
        <div className="text-xl font-bold">
          事業者ユーザー管理
        </div>
      </div>

      {simpleAdminUser.townId == null && (
        <div className="mb-6">
          <TownSelectCard townId={townId} setTownId={setTownId} />
        </div>
      )}

      {townId !== '' && (
        <Card className="py-6">
          <CardContent className="space-y-6">
            <BusinessApplicationsView townId={townId} />
            <BusinessUsersView townId={townId} />
          </CardContent>
        </Card>
      )}
    </main>
  )
}