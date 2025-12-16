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
import TownEditView from "@/app/admin/towns/_components/TownEditView"



export default function CreateTownPage() {
  const { simpleAdminUser, townId, setTownId } = useAdminSession()

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
            <BreadcrumbPage>新規作成</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <TownEditView />
    </main>
  )
}