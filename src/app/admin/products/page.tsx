'use client'

import { useEffect, useState } from "react"
import { HomeIcon } from "lucide-react"
import Link from "next/link"

// Providers
import { useAdminSession } from "@/providers/admin-session-provider"

// Entity
import { AdminUserType } from "@/entity/admin/user"

// Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import ProductsView from "@/app/admin/products/_components/ProductsView"
import PaymentsView from "@/app/admin/products/_components/PaymentsView"
import NoPermissionView from "@/components/common/NoPermissionView"
import TownSelectCard from "@/components/common/TownSelectCard"
import BusinessSelectCard from "@/components/common/BusinessSelectCard"

export default function ProductsPage() {
  const { simpleAdminUser, townId, setTownId, businessId, setBusinessId } = useAdminSession()

  if (simpleAdminUser == null) {
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
            <BreadcrumbPage>商品管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-6">
        <div className="text-xl font-bold">
          商品管理
        </div>


        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">商品管理</TabsTrigger>
            <TabsTrigger value="payments">販売管理</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            {simpleAdminUser.townId == null && (
              <div className="mb-6">
                <TownSelectCard townId={townId} setTownId={setTownId} />
              </div>
            )}
            {townId !== '' && (
              <Card>
                <CardHeader>
                  <CardTitle>商品一覧</CardTitle>
                  <CardDescription>
                    販売商品を表示・管理します
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProductsView
                    townId={townId}
                    isEditable={simpleAdminUser.adminUserType !== AdminUserType.TOWN_VIEWER && simpleAdminUser.adminUserType !== AdminUserType.BUSINESS_VIEWER}
                    isEngineer={simpleAdminUser.adminUserType === AdminUserType.ENGINEER}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <div className="mb-6 flex gap-4">
              {simpleAdminUser.townId == null && (
                <div className="flex-1">
                  <TownSelectCard townId={townId} setTownId={setTownId} />
                </div>
              )}
              {simpleAdminUser.businessId == null && (
                <div className="flex-1">
                  <BusinessSelectCard townId={townId} businessId={businessId} setBusinessId={setBusinessId} />
                </div>
              )}
            </div>
            <Card>
              <CardHeader>
                <CardTitle>販売管理</CardTitle>
                <CardDescription>
                  決済履歴と販売情報を表示・管理します
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentsView
                  townId={townId}
                  businessId={businessId}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}