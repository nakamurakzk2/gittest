"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

// Providers
import { useDialog } from "@/providers/dialog-provider"
import { toast } from "@/components/hooks/use-toast"

// Entity
import { DisplayOrder } from "@/entity/page/top-page"
import { ProductCategory } from "@/entity/product/product"

// Components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, Edit, GripVertical } from "lucide-react"

// Logic
import * as AdminProductServerLogic from "@/logic/server/admin/admin-product-server-logic"
import * as AdminPageServerLogic from "@/logic/server/admin/admin-page-server-logic"

// DnD Kit
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// ソート可能なテーブル行コンポーネント
function SortableProductCategoryRow({ productCategory }: {
  productCategory: ProductCategory
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: productCategory.categoryId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <TableRow ref={setNodeRef} style={style} className={isDragging ? "shadow-lg" : ""}>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
          <Image
            src={productCategory.icon}
            alt={productCategory.name.ja}
            width={20}
            height={20}
            className="rounded-md"
          />
        </div>
      </TableCell>
      <TableCell className="font-medium">
        {productCategory.name.ja}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {productCategory.description.ja}
      </TableCell>
      <TableCell className="text-right">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/admin/product-categories/${productCategory.categoryId}/edit`} className="flex items-center space-x-1">
            <Edit className="h-3 w-3" />
            <span>編集</span>
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default function ProductCategoriesView() {
  const { onFetch } = useDialog()

  const [ productCategories, setProductCategories] = useState<ProductCategory[]>([])
  const [displayOrder, setDisplayOrder] = useState<DisplayOrder | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const reload = async () => {
    await onFetch(async () => {
      const { productCategories, displayOrder } = await AdminProductServerLogic.fetchProductCategories()
      setProductCategories(productCategories)
      setDisplayOrder(displayOrder)
    })
  }

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id && displayOrder) {
      const oldIndex = displayOrder.ids.indexOf(active.id as string)
      const newIndex = displayOrder.ids.indexOf(over.id as string)

      const newIds = arrayMove(displayOrder.ids, oldIndex, newIndex)
      const updatedDisplayOrder = {
        ...displayOrder,
        ids: newIds,
        updatedAt: Date.now()
      }

      setDisplayOrder(updatedDisplayOrder)

      // サーバーに更新を送信
      await onFetch(async () => {
        await AdminPageServerLogic.upsertDisplayOrder(updatedDisplayOrder)
        toast({
          title: "順序更新完了",
          description: "商品カテゴリの表示順序を更新しました。"
        })
      })
    }
  }

  // displayOrderのids順にproductCategoriesを並べる
  const sortedProductCategories = displayOrder && displayOrder.ids.length > 0
    ? displayOrder.ids
        .map(id => productCategories.find(category => category.categoryId === id))
        .filter((category): category is ProductCategory => category !== undefined)
        .concat(productCategories.filter(category => !displayOrder.ids.includes(category.categoryId)))
    : productCategories

  useEffect(() => {
    reload()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {productCategories.length} 件の商品カテゴリ
        </div>
        <Button asChild className="flex items-center gap-2">
          <Link href="/admin/product-categories/create">
            <Plus className="h-4 w-4" />
            新規登録
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>アイコン</TableHead>
              <TableHead>商品カテゴリ名</TableHead>
              <TableHead>説明</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProductCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  商品カテゴリが見つかりません
                </TableCell>
              </TableRow>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={onDragEnd}
              >
                <SortableContext
                  items={sortedProductCategories.map(category => category.categoryId)}
                  strategy={verticalListSortingStrategy}
                >
                  {sortedProductCategories.map((productCategory) => (
                    <SortableProductCategoryRow
                      key={productCategory.categoryId}
                      productCategory={productCategory}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}