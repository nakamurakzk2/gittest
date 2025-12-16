'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { HomeIcon } from "lucide-react"
import Link from "next/link"

// Providers
import { useAdminSession } from "@/providers/admin-session-provider"

// Entity
import { AdminUserType } from "@/entity/admin/user"
import { TopBanner } from "@/entity/page/top-page"

// Components
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import NoPermissionView from "@/components/common/NoPermissionView"
import TopBannerEditView from "../../_components/TopBannerEditView"

// Providers
import { useDialog } from "@/providers/dialog-provider"

// Logic
import * as AdminPageServerLogic from "@/logic/server/admin/admin-page-server-logic"

interface Props {
  params: {
    bannerId: string
  }
}

export default function EditTopBannerPage({ params }: Props) {
  const { simpleAdminUser } = useAdminSession()
  const { onFetch } = useDialog()
  const router = useRouter()

  const [banner, setBanner] = useState<TopBanner | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBanner = async () => {
      await onFetch(async () => {
        const response = await AdminPageServerLogic.fetchTopBanner(params.bannerId)
        setBanner(response.topBanner)
        setLoading(false)
      })
    }

    fetchBanner()
  }, [params.bannerId])


  if (simpleAdminUser == null || (simpleAdminUser.adminUserType !== AdminUserType.ENGINEER && simpleAdminUser.adminUserType !== AdminUserType.SUPER_ADMIN)) {
    return <NoPermissionView />
  }

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-2 py-6">
        <div className="text-center py-12">
          <div className="text-muted-foreground">読み込み中...</div>
        </div>
      </main>
    )
  }

  if (!banner) {
    return (
      <main className="max-w-4xl mx-auto px-2 py-6">
        <div className="text-center py-12">
          <div className="text-muted-foreground">バナーが見つかりません</div>
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
            <BreadcrumbPage>TOPバナー編集</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold">TOPバナーを編集</h1>
          <p className="text-muted-foreground">
            バナーの情報を編集してください
          </p>
        </div>

        <TopBannerEditView
          initialBanner={banner}
        />
      </div>
    </main>
  )
}
