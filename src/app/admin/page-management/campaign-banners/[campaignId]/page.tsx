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
import { CampaignBanner } from "@/entity/page/top-page"

// Logic
import * as AdminPageServerLogic from "@/logic/server/admin/admin-page-server-logic"

// Components
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import NoPermissionView from "@/components/common/NoPermissionView"
import CampaignBannerEditView from "../../_components/CampaignBannerEditView"

export default function EditCampaignBannerPage() {
  const { simpleAdminUser } = useAdminSession()
  const { onFetch } = useDialog()
  const params = useParams()
  const campaignId = params.campaignId as string

  const [banner, setBanner] = useState<CampaignBanner | null>(null)

  useEffect(() => {
    const fetchBanner = async () => {
      await onFetch(async () => {
        const { campaignBanner } = await AdminPageServerLogic.fetchCampaignBanner(campaignId)
        setBanner(campaignBanner)
      })
    }

    if (campaignId) {
      fetchBanner()
    }
  }, [campaignId, onFetch])

  if (simpleAdminUser == null || (simpleAdminUser.adminUserType !== AdminUserType.ENGINEER && simpleAdminUser.adminUserType !== AdminUserType.SUPER_ADMIN)) {
    return <NoPermissionView />
  }

  if (!banner) {
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
            <BreadcrumbPage>特集バナー編集</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold">特集バナーを編集</h1>
          <p className="text-muted-foreground">
            特集バナーの情報を編集してください
          </p>
        </div>

        <CampaignBannerEditView initialBanner={banner} />
      </div>
    </main>
  )
}
