"use client"

import { HomeIcon } from "lucide-react"

// Providers
import { useAdminSession } from "@/providers/admin-session-provider"

// Components
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import AdminTopView from "@/app/admin/_components/AdminTopView"
import AdminLoginView from "@/app/admin/_components/AdminLoginView"

export default function HomePage() {
  const { loading, simpleAdminUser } = useAdminSession()

  if (loading && simpleAdminUser == null) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-2 py-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-1">
              <HomeIcon className="h-4 w-4" /> Admin
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {simpleAdminUser == null && (
        <AdminLoginView />
      )}
      {simpleAdminUser != null && (
        <AdminTopView />
      )}
    </main>
  )
}
