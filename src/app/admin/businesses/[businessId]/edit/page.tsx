'use client'

import { useEffect, useState } from "react"
import { HomeIcon } from "lucide-react"
import Link from "next/link"

// Providers
import { useAdminSession } from "@/providers/admin-session-provider"
import { useDialog } from "@/providers/dialog-provider"

// Entity
import { AdminUserType } from "@/entity/admin/user"
import { Business } from "@/entity/town/business"

// Components
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import NoPermissionView from "@/components/common/NoPermissionView"
import TownSelectCard from "@/components/common/TownSelectCard"
import BusinessEditView from "@/app/admin/businesses/_components/BusinessEditView"

// Logic
import * as AdminBusinessServerLogic from "@/logic/server/admin/admin-business-server-logic"


export default function EditBusinessPage({ params }: { params: { businessId: string } }) {
  const businessId = params.businessId
  const { onFetch } = useDialog()
  const { simpleAdminUser, townId, setTownId } = useAdminSession()
  const [ business, setBusiness ] = useState<Business | null>(null)

  const reload = async () => {
    if (businessId === "") return
    await onFetch(async () => {
      const { business } = await AdminBusinessServerLogic.fetchBusiness(townId, businessId)
      setBusiness(business)
    })
  }

  useEffect(() => {
    reload()
  }, [businessId, townId])


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

      {townId !== '' && business !== null && business.townId === townId && (<>
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">事業者を編集</h1>
              <p className="text-muted-foreground">
                事業者の情報を入力してください
              </p>
            </div>
          </div>
        </div>

        <BusinessEditView
        townId={townId}
          business={business}
        />
      </>)}
    </main>
  )
}