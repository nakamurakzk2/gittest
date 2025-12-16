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
import AdminFormAnswerView from "@/app/admin/customer-support/_components/form/AdminFormAnswerView"


interface PageProps {
  params: {
    productId: string
  },
  searchParams: {
    formId: string
  }
}

export default function FormAnswerPage({ params, searchParams }: PageProps) {
  const { simpleAdminUser, townId, setTownId, businessId, setBusinessId } = useAdminSession()
  const { productId } = params
  const { formId } = searchParams

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
            <BreadcrumbLink asChild>
              <Link href="/admin/customer-support/form-answers">フォーム回答</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>詳細</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <AdminFormAnswerView
        productId={productId}
        initialFormId={formId}
      />
    </main>
  )
}
