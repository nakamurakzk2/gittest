'use client'

import { useEffect, useState } from "react"
import { HomeIcon } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Providers
import { useAdminSession } from "@/providers/admin-session-provider"
import { useDialog } from "@/providers/dialog-provider"

// Entity
import { AdminUserType } from "@/entity/admin/user"
import { TopPickup } from "@/entity/page/top-page"

// Logic
import * as AdminPageServerLogic from "@/logic/server/admin/admin-page-server-logic"

// Components
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import NoPermissionView from "@/components/common/NoPermissionView"
import TopPickupEditView from "@/app/admin/page-management/_components/TopPickupEditView"

export default function EditTopPickupPage() {
  const params = useParams()
  const pickupId = params.pickupId as string

  const { simpleAdminUser } = useAdminSession()
  const { onFetch } = useDialog()

  const [pickup, setPickup] = useState<TopPickup | null>(null)

  /**
   * ピックアップを取得
   */
  const reload = async () => {
    if (pickupId === "") return
    await onFetch(async () => {
      const { topPickup } = await AdminPageServerLogic.fetchTopPickup(pickupId)
      setPickup(topPickup)
    })
  }

  useEffect(() => {
    reload()
  }, [pickupId])

  if (simpleAdminUser == null || (simpleAdminUser.adminUserType !== AdminUserType.ENGINEER && simpleAdminUser.adminUserType !== AdminUserType.SUPER_ADMIN)) {
    return <NoPermissionView />
  }

  if (!pickup) {
    return (
      <main className="max-w-4xl mx-auto px-2 py-6">
        <div className="text-center py-8">
          <div className="text-lg">読み込み中...</div>
        </div>
      </main>
    )
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
              <Link href="/admin/page-management">ページ管理</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>PickUp編集</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold">PickUpを編集</h1>
          <p className="text-muted-foreground">
            PickUpの情報を編集してください
          </p>
        </div>

        <TopPickupEditView initialPickup={pickup} />
      </div>
    </main>
  )
}
