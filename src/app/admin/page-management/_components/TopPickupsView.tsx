"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

// Providers
import { toast } from "@/components/hooks/use-toast"

// Entity
import { DisplayOrder, TopPickup } from "@/entity/page/top-page"

// Logic
import * as AdminPageServerLogic from "@/logic/server/admin/admin-page-server-logic"

// Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, Plus, Edit, Trash2, GripVertical } from "lucide-react"
import { useDialog } from "@/providers/dialog-provider"

// DnD Kit
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// ソート可能なカードコンポーネント
function SortablePickupCard({ pickup, isActive, onClickDelete }: {
  pickup: TopPickup
  isActive: (pickup: TopPickup) => boolean
  onClickDelete: (pickupId: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: pickup.pickupId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card ref={setNodeRef} style={style} className={isDragging ? "shadow-lg" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src={pickup.image}
                alt="Pickup"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <CardTitle className="text-lg">ピックアップ</CardTitle>
              <CardDescription className="mt-1">
                ピックアップアイテム
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isActive(pickup) ? "default" : "secondary"}>
              {isActive(pickup) ? "表示中" : "非表示"}
            </Badge>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/page-management/top-pickups/${pickup.pickupId}`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onClickDelete(pickup.pickupId)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          <div>リンク: {pickup.link}</div>
          <div>
            表示期間: {
              pickup.startTime && pickup.endTime
                ? `${new Date(pickup.startTime).toLocaleDateString()} - ${new Date(pickup.endTime).toLocaleDateString()}`
                : "無制限"
            }
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function TopPickupsView() {
  const { onFetch, setYesNoDialogData } = useDialog()

  const [topPickups, setTopPickups] = useState<TopPickup[]>([])
  const [displayOrder, setDisplayOrder] = useState<DisplayOrder | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const reload = async () => {
    await onFetch(async () => {
      const { topPickups, displayOrder } = await AdminPageServerLogic.fetchAllTopPickups()
      setTopPickups(topPickups)
      setDisplayOrder(displayOrder)
    })
  }

  const onClickDelete = (pickupId: string) => {
    setYesNoDialogData({
      title: "ピックアップを削除しますか？",
      description: "この操作は取り消せません。",
      onOk: async () => {
        await onFetch(async () => {
          await AdminPageServerLogic.deleteTopPickup(pickupId)
          setTopPickups(prev => prev.filter(pickup => pickup.pickupId !== pickupId))
          // displayOrderからも削除
          if (displayOrder) {
            const newIds = displayOrder.ids.filter(id => id !== pickupId)
            const updatedDisplayOrder = {
              ...displayOrder,
              ids: newIds,
              updatedAt: Date.now()
            }
            setDisplayOrder(updatedDisplayOrder)
            await AdminPageServerLogic.upsertDisplayOrder(updatedDisplayOrder)
          }
          toast({
            title: "削除完了",
            description: "ピックアップを削除しました。"
          })
        })
      }
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
          description: "ピックアップの表示順序を更新しました。"
        })
      })
    }
  }

  // displayOrderのids順にtopPickupsを並べる
  const sortedTopPickups = displayOrder
    ? displayOrder.ids
        .map(id => topPickups.find(pickup => pickup.pickupId === id))
        .filter((pickup): pickup is TopPickup => pickup !== undefined)
        .concat(topPickups.filter(pickup => !displayOrder.ids.includes(pickup.pickupId)))
    : topPickups

  useEffect(() => {
    reload()
  }, [])

  const isActive = (pickup: TopPickup) => {
    const now = Date.now()
    if (pickup.startTime && pickup.startTime > now) return false
    if (pickup.endTime && pickup.endTime < now) return false
    return true
  }


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">
            ピックアップの詳細管理は編集ボタンをクリックしてください
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {topPickups.length} 個のピックアップ
          </div>
          <Button asChild className="flex items-center gap-2">
            <Link href="/admin/page-management/top-pickups/create">
              <Plus className="h-4 w-4" />
              新規追加
            </Link>
          </Button>
        </div>
      </div>

      {topPickups.length === 0 && (
        <div className="col-span-full text-center py-12">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">ピックアップが見つかりません</h3>
          <p className="text-sm text-muted-foreground mt-2">新しいピックアップを追加してください</p>
        </div>
      )}

      {sortedTopPickups.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={sortedTopPickups.map(pickup => pickup.pickupId)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {sortedTopPickups.map((pickup) => (
                <SortablePickupCard
                  key={pickup.pickupId}
                  pickup={pickup}
                  isActive={isActive}
                  onClickDelete={onClickDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
