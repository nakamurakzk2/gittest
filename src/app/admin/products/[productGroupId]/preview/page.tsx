'use client'

import { useState, useEffect } from "react"
import { HomeIcon } from "lucide-react"
import Link from "next/link"

// Providers
import { useAdminSession } from "@/providers/admin-session-provider"
import { useDialog } from "@/providers/dialog-provider"

// Entity
import { AdminUserType } from "@/entity/admin/user"
import { SimpleProductCategory, SimpleProductGroup, SimpleProductItem } from "@/entity/product/product"
import { SimpleBusiness } from "@/entity/town/business"

// Components
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import NoPermissionView from "@/components/common/NoPermissionView"
import SimpleProductView from "@/components/product/SimpleProductView"

// Logic
import * as AdminProductServerLogic from "@/logic/server/admin/admin-product-server-logic"
import { SimpleTown } from "@/entity/town/town"

export default function EditProductPage({ params }: { params: { productGroupId: string } }) {
  const { onFetch } = useDialog()
  const { simpleAdminUser } = useAdminSession()

  const [simpleProductGroup, setSimpleProductGroup] = useState<SimpleProductGroup | null>(null)
  const [simpleProductItems, setSimpleProductItems] = useState<SimpleProductItem[]>([])
  const [simpleProductCategories, setSimpleProductCategories] = useState<SimpleProductCategory[]>([])
  const [simpleBusiness, setSimpleBusiness] = useState<SimpleBusiness | null>(null)
  const [simpleTown, setSimpleTown] = useState<SimpleTown | null>(null)


  const reload = async () => {
    await onFetch(async () => {
      const { simpleProductGroup, simpleProductItems, simpleProductCategories, simpleBusiness, simpleTown } = await AdminProductServerLogic.fetchSimpleProductForPreview(params.productGroupId)
      setSimpleProductGroup(simpleProductGroup)
      setSimpleProductItems(simpleProductItems)
      setSimpleProductCategories(simpleProductCategories)
      setSimpleBusiness(simpleBusiness)
      setSimpleTown(simpleTown)
    })
  }

  useEffect(() => {
    reload()
  }, [params.productGroupId])


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
              <Link href="/admin/products">商品管理</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>プレビュー</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {simpleProductGroup && simpleProductItems && simpleProductCategories && simpleBusiness && simpleTown && (
        <SimpleProductView
          productGroup={simpleProductGroup}
          productItems={simpleProductItems}
          productCategories={simpleProductCategories}
          business={simpleBusiness}
          town={simpleTown}
          isPreview={true}
        />
      )}

    </main>
  )
}