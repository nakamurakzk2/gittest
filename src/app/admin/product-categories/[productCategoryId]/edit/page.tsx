'use client'

import { useEffect, useState } from "react"
import { HomeIcon } from "lucide-react"
import Link from "next/link"

// Providers
import { useAdminSession } from "@/providers/admin-session-provider"
import { useDialog } from "@/providers/dialog-provider"

// Entity
import { AdminUserType } from "@/entity/admin/user"
import { ProductCategory } from "@/entity/product/product"

// Components
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import NoPermissionView from "@/components/common/NoPermissionView"
import ProductCategoryEditView from "@/app/admin/product-categories/_components/ProductCategoryEditView"

// Logic
import * as AdminProductServerLogic from "@/logic/server/admin/admin-product-server-logic"


export default function EditBusinessPage({ params }: { params: { productCategoryId: string } }) {
  const productCategoryId = params.productCategoryId
  const { onFetch } = useDialog()
  const { simpleAdminUser } = useAdminSession()
  const [ productCategory, setProductCategory ] = useState<ProductCategory | null>(null)

  const reload = async () => {
    if (productCategoryId === "") return
    await onFetch(async () => {
      const { productCategory } = await AdminProductServerLogic.fetchProductCategory(productCategoryId)
      setProductCategory(productCategory)
    })
  }

  useEffect(() => {
    reload()
  }, [productCategoryId])


  if (simpleAdminUser == null) {
    return <div>Loading...</div>
  }
  if (simpleAdminUser.adminUserType !== AdminUserType.ENGINEER && simpleAdminUser.adminUserType !== AdminUserType.SUPER_ADMIN && simpleAdminUser.adminUserType !== AdminUserType.TOWN  && simpleAdminUser.adminUserType !== AdminUserType.TOWN_VIEWER) {
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
              <Link href="/admin/product-categories">商品カテゴリ管理</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>編集</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {productCategory != null && (<>
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">商品カテゴリを編集</h1>
              <p className="text-muted-foreground">
                商品カテゴリの情報を入力してください
              </p>
            </div>
          </div>
        </div>

        <ProductCategoryEditView
          productCategory={productCategory}
        />
      </>)}
    </main>
  )
}