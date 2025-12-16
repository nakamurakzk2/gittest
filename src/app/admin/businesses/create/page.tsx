'use client'

import { HomeIcon } from "lucide-react"
import Link from "next/link"

// Providers
import { useAdminSession } from "@/providers/admin-session-provider"

// Entity
import { AdminUserType } from "@/entity/admin/user"

// Components
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import NoPermissionView from "@/components/common/NoPermissionView"
import TownSelectCard from "@/components/common/TownSelectCard"
import BusinessEditView from "@/app/admin/businesses/_components/BusinessEditView"



export default function CreateBusinessPage() {
  const { simpleAdminUser, townId, setTownId } = useAdminSession()

  if (simpleAdminUser == null) {
    return <div>Loading...</div>
  }
  if (simpleAdminUser.adminUserType !== AdminUserType.ENGINEER && simpleAdminUser.adminUserType !== AdminUserType.SUPER_ADMIN && simpleAdminUser.adminUserType !== AdminUserType.TOWN  && simpleAdminUser.adminUserType !== AdminUserType.TOWN_VIEWER) {
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
            <BreadcrumbLink asChild>
              <Link href="/admin/businesses">事業者管理</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>新規作成</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {simpleAdminUser.townId == null && (
        <div className="mb-6">
          <TownSelectCard townId={townId} setTownId={setTownId} />
        </div>
      )}

    {townId !== '' && (<>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">新しい事業者を作成</h1>
            <p className="text-muted-foreground">
              事業者の情報を入力してください
            </p>
          </div>
        </div>
      </div>

      <BusinessEditView townId={townId}  />
      </>)}
    </main>
  )
}