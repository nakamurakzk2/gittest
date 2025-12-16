'use client'

import { useEffect, useState } from "react"
import { HomeIcon } from "lucide-react"
import Link from "next/link"

// Providers
import { useAdminSession } from "@/providers/admin-session-provider"
import { useDialog } from "@/providers/dialog-provider"

// Entity
import { AdminUserType } from "@/entity/admin/user"
import { Town } from "@/entity/town/town"

// Components
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import NoPermissionView from "@/components/common/NoPermissionView"
import TownEditView from "@/app/admin/towns/_components/TownEditView"

// Logic
import * as AdminTownServerLogic from "@/logic/server/admin/admin-town-server-logic"


export default function EditTownPage({ params }: { params: { townId: string } }) {
  const townId = params.townId
  const { onFetch } = useDialog()
  const { simpleAdminUser } = useAdminSession()
  const [ town, setTown ] = useState<Town | null>(null)

  const reload = async () => {
    if (townId === "") return
    await onFetch(async () => {
      const { town } = await AdminTownServerLogic.fetchTown(townId)
      setTown(town)
    })
  }

  useEffect(() => {
    reload()
  }, [townId])


  if (simpleAdminUser == null) {
    return <div>Loading...</div>
  }
  if (simpleAdminUser.adminUserType !== AdminUserType.ENGINEER && simpleAdminUser.adminUserType !== AdminUserType.SUPER_ADMIN) {
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
              <Link href="/admin/towns">自治体管理</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>編集</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">自治体を編集</h1>
            <p className="text-muted-foreground">
              自治体の情報を入力してください
            </p>
          </div>
        </div>
      </div>

      <TownEditView
        town={town}
      />
    </main>
  )
}