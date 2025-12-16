'use client'

import { useEffect, useState } from "react"

// Providers
import { useDialog } from "@/providers/dialog-provider"

// Entity
import { ProductCategory } from "@/entity/product/product"

// Components
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Logic
import * as AdminProductServerLogic from "@/logic/server/admin/admin-product-server-logic"

interface ProductCategorySelectViewProps {
  categoryIds: string[]
  setCategoryIds: (categoryIds: string[]) => void
}

export default function ProductCategorySelectView({ categoryIds, setCategoryIds }: ProductCategorySelectViewProps) {
  const { onFetch } = useDialog()
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([])

  const reload = async () => {
    await onFetch(async () => {
      const { productCategories } = await AdminProductServerLogic.fetchProductCategories()
      setProductCategories(productCategories)
    })
  }

  useEffect(() => {
    reload()
  }, [])

  const onToggleCategoryId = (categoryId: string) => {
    if (categoryIds.includes(categoryId)) {
      setCategoryIds(categoryIds.filter(id => id !== categoryId))
    } else {
      setCategoryIds([...categoryIds, categoryId])
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">カテゴリ選択</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-4">
        {productCategories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {productCategories.map((category) => (
              <div
                key={category.categoryId}
                className={`
                  relative flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-muted/50
                  ${categoryIds.includes(category.categoryId)
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                    : 'border-border hover:border-muted-foreground/30'
                  }
                `}
                onClick={() => onToggleCategoryId(category.categoryId)}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${category.categoryId}`}
                    checked={categoryIds.includes(category.categoryId)}
                    onChange={() => {}}
                    className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Label
                    htmlFor={`category-${category.categoryId}`}
                    className="text-sm font-medium cursor-pointer block"
                  >
                    {category.name.ja}
                  </Label>
                  {category.description.ja && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {category.description.ja}
                    </p>
                  )}
                </div>
                {categoryIds.includes(category.categoryId) && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {categoryIds.length > 0 && (
          <div className="pt-3 border-t">
            <div className="text-sm text-muted-foreground mb-2">
              選択中のカテゴリー ({categoryIds.length}個)
            </div>
            <div className="flex flex-wrap gap-2">
              {categoryIds.map((categoryId) => {
                const category = productCategories.find(cat => cat.categoryId === categoryId)
                return (
                  <Badge
                    key={categoryId}
                    variant="default"
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    {category?.name.ja || categoryId}
                  </Badge>
                )
              })}
            </div>
          </div>
        )}
        {productCategories.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">カテゴリーが見つかりません</p>
            <p className="text-xs mt-1">管理画面でカテゴリーを作成してください</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}