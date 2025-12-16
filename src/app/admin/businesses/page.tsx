'use client'

import { useEffect } from "react"
import { HomeIcon } from "lucide-react"
import Link from "next/link"

// Providers
import { useAdminSession } from "@/providers/admin-session-provider"

// Entity
import { AdminUserType } from "@/entity/admin/user"

// Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import BusinessesView from "@/app/admin/businesses/_components/BusinessesView"
import NoPermissionView from "@/components/common/NoPermissionView"
import TownSelectCard from "@/components/common/TownSelectCard"

export default function BusinessesPage() {
  const { simpleAdminUser, townId, setTownId } = useAdminSession()

  useEffect(() => {
    if (simpleAdminUser == null) return
    if (simpleAdminUser.townId) {
      setTownId(simpleAdminUser.townId)
    }
  }, [simpleAdminUser])


  if (simpleAdminUser == null || (simpleAdminUser.adminUserType !== AdminUserType.ENGINEER && simpleAdminUser.adminUserType !== AdminUserType.SUPER_ADMIN && simpleAdminUser.adminUserType !== AdminUserType.TOWN  && simpleAdminUser.adminUserType !== AdminUserType.TOWN_VIEWER)) {
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
            <BreadcrumbPage>事業者管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-6">
        <div className="text-xl font-bold">
          事業者管理
        </div>
        {simpleAdminUser.townId == null && (
          <div className="mb-6">
            <TownSelectCard townId={townId} setTownId={setTownId} />
          </div>
        )}

        {townId !== '' && (
          <Card>
            <CardHeader>
              <CardTitle>事業者一覧</CardTitle>
              <CardDescription>
                事業者を表示・管理します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BusinessesView townId={townId} />
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}