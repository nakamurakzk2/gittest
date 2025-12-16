'use client'

import { useState, useEffect } from "react"
import { HomeIcon } from "lucide-react"
import Link from "next/link"

// Providers
import { useAdminSession } from "@/providers/admin-session-provider"

// Entity
import { AdminUserType } from "@/entity/admin/user"
import { ProductItem } from "@/entity/product/product"

// Components
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import ProductEditView from "@/app/admin/products/_components/ProductEditView"
import NoPermissionView from "@/components/common/NoPermissionView"
import TownSelectCard from "@/components/common/TownSelectCard"
import BusinessSelectCard from "@/components/common/BusinessSelectCard"


export default function CreateProductPage() {
  const { simpleAdminUser, townId, setTownId } = useAdminSession()
  const [businessId, setBusinessId] = useState<string>("")


  useEffect(() => {
    if (simpleAdminUser == null) return
    setBusinessId(simpleAdminUser.businessId || '')
  }, [simpleAdminUser])

  const now = Date.now()
  const productItems: ProductItem[] = [{
    productId: '',
    productGroupId: '',
    title: { ja: "", en: "", zh: "" },
    description: { ja: "", en: "", zh: "" },
    stock: 0,
    hideStock: false,
    deliveryText: { ja: "", en: "", zh: "" },
    paymentText: { ja: "", en: "", zh: "" },
    buyLimit: null,
    categoryIds: [],
    chatEnabled: false,
    price: 0,
    images: [],
    formIds: [],
    startTime: null,
    endTime: null,
    isDraft: false,
    townId: "",
    businessId: "",
    chainId: null,
    contractAddress: null,
    createdAt: now,
    updatedAt: now,
  }]

  if (simpleAdminUser == null) {
    return <div>Loading...</div>
  }
  if (simpleAdminUser.adminUserType !== AdminUserType.ENGINEER && simpleAdminUser.adminUserType !== AdminUserType.SUPER_ADMIN && simpleAdminUser.adminUserType !== AdminUserType.TOWN && simpleAdminUser.adminUserType !== AdminUserType.BUSINESS) {
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
              <Link href="/admin/products">商品管理</Link>
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
      {simpleAdminUser.businessId == null && (
        <div className="mb-6">
          <BusinessSelectCard townId={townId} businessId={businessId} setBusinessId={setBusinessId} />
        </div>
      )}

      {townId !== '' && businessId !== '' && (<>
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">新しい商品を作成</h1>
              <p className="text-muted-foreground">
                1つ以上の商品の情報を入力してください ({productItems.length}個の商品)
              </p>
            </div>
          </div>
        </div>

        <ProductEditView
          townId={townId}
          businessId={businessId}
          initialProductItems={productItems}
        />
      </>)}
    </main>
  )
}