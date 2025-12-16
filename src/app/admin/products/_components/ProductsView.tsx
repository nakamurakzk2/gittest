"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

// Providers
import { toast } from "@/components/hooks/use-toast"

// Entity
import { ProductCategory, ProductGroup, ProductItem } from "@/entity/product/product"

// Components
import { Button } from "@/components/ui/button"
import { Package, Plus } from "lucide-react"
import { useDialog } from "@/providers/dialog-provider"
import ProductGroupCardView from "./ProductGroupCardView"

// Logic
import * as AdminProductServerLogic from "@/logic/server/admin/admin-product-server-logic"
import { Business } from "@/entity/town/business"
import { CollectionDraft } from "@/entity/product/contract"

type Props = {
  townId: string
  isEditable: boolean
  isEngineer: boolean
}

export default function ProductsView({ townId, isEditable, isEngineer }: Props) {
  const { onFetch, setYesNoDialogData } = useDialog()

  const [productGroups, setProductGroups] = useState<ProductGroup[]>([])
  const [productItems, setProductItems] = useState<ProductItem[]>([])
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([])
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [collectionDrafts, setCollectionDrafts] = useState<CollectionDraft[]>([])

  const reload = async () => {
    if (townId === "") return
    await onFetch(async () => {
      const { productGroups, productItems, productCategories, businesses, collectionDrafts } = await AdminProductServerLogic.fetchProducts(townId)
      setProductGroups(productGroups)
      setProductItems(productItems)
      setProductCategories(productCategories)
      setBusinesses(businesses)
      setCollectionDrafts(collectionDrafts)
    })
  }

  useEffect(() => {
    reload()
  }, [townId])


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">
            商品の詳細管理は編集ボタンをクリックしてください
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {productGroups.length} 個の商品グループ
          </div>
          {isEditable && (
            <Button asChild className="flex items-center gap-2">
              <Link href="/admin/products/create">
                <Plus className="h-4 w-4" />
                新規追加
              </Link>
            </Button>
          )}
        </div>
      </div>

      {productGroups.length === 0 && (
        <div className="col-span-full text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">商品が見つかりません</h3>
          <p className="text-sm text-muted-foreground mt-2">新しい商品を追加してください</p>
        </div>
      )}

      {productGroups.length > 0 && (
        <div className="space-y-4">
          {productGroups.map((productGroup) => (
            <ProductGroupCardView
              key={productGroup.productGroupId}
              productGroup={productGroup}
              productItems={productItems}
              collectionDrafts={collectionDrafts}
              businesses={businesses}
              reload={reload}
              isEditable={isEditable}
              isEngineer={isEngineer}
            />
          ))}
        </div>
      )}
    </div>
  )
}