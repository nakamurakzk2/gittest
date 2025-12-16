'use client'

import { useState, useEffect } from "react"
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
import BusinessSelectCard from "@/components/common/BusinessSelectCard"
import CustomerSupportNavigation from "@/app/admin/customer-support/_components/CustomerSupportNavigation"
import AdminPreTalkChatsView from "@/app/admin/customer-support/_components/chat/AdminPreTalkChatsView"

export default function PreTalkChatPage() {
  const { simpleAdminUser, townId, setTownId, businessId, setBusinessId } = useAdminSession()

  useEffect(() => {
    if (simpleAdminUser == null || simpleAdminUser.businessId == null) return
    setBusinessId(simpleAdminUser.businessId)
  }, [simpleAdminUser, setBusinessId])

  if (simpleAdminUser == null) {
    return <div>Loading...</div>
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
              <Link href="/admin/customer-support">顧客対応</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>事前相談チャット</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6 space-y-6">
        <div className="text-xl font-bold">
          事前相談チャット管理
        </div>
        <CustomerSupportNavigation />
      </div>

      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          {simpleAdminUser.townId == null && (
            <TownSelectCard townId={townId} setTownId={setTownId} />
          )}
        </div>
        <div className="flex-1">
          {simpleAdminUser.businessId == null && (
            <BusinessSelectCard townId={townId} businessId={businessId} setBusinessId={setBusinessId} />
          )}
        </div>
      </div>

      {townId !== '' && businessId !== '' && (
        <AdminPreTalkChatsView
          townId={townId}
          businessId={businessId}
        />
      )}
    </main>
  )
}
