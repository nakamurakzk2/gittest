'use client'

import { useState, useEffect } from "react"
import { HomeIcon } from "lucide-react"
import Link from "next/link"

// Providers
import { useAdminSession } from "@/providers/admin-session-provider"
import { useDialog } from "@/providers/dialog-provider"

// Entity
import { AdminUserType } from "@/entity/admin/user"
import { ProductItem } from "@/entity/product/product"

// Components
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import ProductEditView from "@/app/admin/products/_components/ProductEditView"
import NoPermissionView from "@/components/common/NoPermissionView"

// Logic
import * as AdminProductServerLogic from "@/logic/server/admin/admin-product-server-logic"

export default function EditProductPage({ params }: { params: { productGroupId: string } }) {
  const { onFetch } = useDialog()
  const { simpleAdminUser } = useAdminSession()

  const [businessId, setBusinessId] = useState<string>("")
  const [townId, setTownId] = useState<string>("")
  const [productItems, setProductItems] = useState<ProductItem[]>([])

  const reload = async () => {
    await onFetch(async () => {
      const { productItems, townId, businessId } = await AdminProductServerLogic.fetchProductItems(params.productGroupId)
      setProductItems(productItems)
      setTownId(townId)
      setBusinessId(businessId)
    })
  }

  useEffect(() => {
    reload()
  }, [params.productGroupId])


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
            <BreadcrumbPage>商品編集</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {townId !== '' && businessId !== '' && (<>
        <div className="mb-6">
          <div>
            <h1 className="text-xl font-bold">商品を編集</h1>
            <p className="text-muted-foreground">
              商品グループの情報を編集してください ({productItems.length}個の商品)
            </p>
          </div>
        </div>

        <ProductEditView
          townId={townId}
          businessId={businessId}
          productGroupId={params.productGroupId}
          initialProductItems={productItems}
        />

      </>)}
    </main>
  )
}