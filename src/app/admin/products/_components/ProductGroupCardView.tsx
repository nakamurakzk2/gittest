"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Edit, Trash2, Copy, ExternalLink, Plus } from "lucide-react"

// Entity
import { ProductGroup, ProductItem } from "@/entity/product/product"
import { Business } from "@/entity/town/business"

// Providers
import { toast } from "@/components/hooks/use-toast"
import { useDialog } from "@/providers/dialog-provider"

// Components
import { Card, CardContent } from "@/components/ui/card"
import { CollectionDraft } from "@/entity/product/contract"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Logic
import * as AdminProductServerLogic from "@/logic/server/admin/admin-product-server-logic"

type Props = {
  productGroup: ProductGroup
  productItems: ProductItem[]
  collectionDrafts: CollectionDraft[]
  businesses: Business[]
  isEditable: boolean
  isEngineer: boolean
  reload: () => void
}

export default function ProductGroupCardView({ productGroup, productItems, collectionDrafts, businesses, isEditable, isEngineer, reload }: Props) {
  const router = useRouter()
  const { onFetch, setYesNoDialogData } = useDialog()

  const groupProductItems = productItems.filter(item =>
    productGroup.productIds.includes(item.productId)
  )
  const business = businesses.find(b => b.businessId === productGroup.businessId)
  const productUrl = `/product/${productGroup.productGroupId}`
  const previewUrl = `/admin/products/${productGroup.productGroupId}/preview`

  /**
   * 商品アイテムの公開状態を判定
   * @param item 商品アイテム
   * @returns 公開状態の情報
   */
  const getItemVisibleWarnings = (item: ProductItem) => {
    const now = Date.now()
    const reasons: string[] = []

    // 下書き状態
    if (item.isDraft) {
      reasons.push("下書き")
    }

    // 時間範囲外
    if (item.startTime && now < item.startTime) {
      reasons.push("公開前")
    }
    if (item.endTime && now > item.endTime) {
      reasons.push("公開終了")
    }

    return reasons
  }


  /**
   * 商品グループを削除
   * @param productGroupId 商品グループID
   */
  const onClickDelete = (productGroupId: string) => {
    setYesNoDialogData({
      title: "削除しますか？",
      description: "削除すると商品グループと商品が削除されます。本当によろしいですか？",
      onOk: async () => {
        await onFetch(async () => {
          await AdminProductServerLogic.deleteProductGroup(productGroupId)
          toast({
            title: "商品を削除しました",
          })
        })
        reload()
      }
    })
  }

  /**
   * URLをクリップボードにコピー
   * @param url コピーするURL
   */
  const onClickCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: "URLをコピーしました",
      })
    } catch (error) {
      toast({
        title: "コピーに失敗しました",
        variant: "destructive",
      })
    }
  }


  return (
    <Card className="w-full">
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {groupProductItems.length}点のバリエーション
          </div>
          <Badge>
            事業者: {business == null ? "不明" : business.name}
          </Badge>
        </div>
        {/* 商品URL */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs text-gray-800 font-bold">
              商品URL:
            </span>
            <Link
              href={productUrl}
              target="_blank"
              className="text-xs text-muted-foreground underline truncate hover:text-foreground transition-colors"
            >
              {productUrl}
            </Link>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onClickCopyUrl(window.location.origin + productUrl)}
              className="h-6 w-6 p-0"
              title="URLをコピー"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" asChild className="h-6 w-6 p-0" title="新しいタブで開く">
              <Link href={productUrl} target="_blank">
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          {groupProductItems.map((item, index) => {
            const warnings = getItemVisibleWarnings(item)
            return (
              <div key={index} className={`rounded-md px-3 py-2 text-sm ${item.contractAddress == null ? 'bg-red-50 border border-red-200' : warnings.length > 0 ? 'bg-gray-300 border' : 'bg-gray-50 border border-gray-200'}`}>
                <div className="flex items-center gap-2">
                  {item.images && item.images.length > 0 && (
                    <img
                      src={item.images[0]}
                      alt={item.title.ja}
                      className={`w-8 h-8 object-cover rounded-sm flex-shrink-0`}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-1">
                      {warnings.map((warning, index) => (
                        <Badge key={index} variant="default" className="text-[10px] px-1.5 py-0">
                          {warning}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-sm">
                      {item.title.ja}
                    </div>
                    {item.price && (
                      <div className="text-xs text-gray-800 font-bold mt-1">
                        ¥{item.price.toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    {item.contractAddress == null && (
                      <Badge variant="destructive">
                        NFTが未登録です
                      </Badge>
                    )}
                    {isEditable && (<>
                      {collectionDrafts.find(draft => draft.productId === item.productId) ? (
                        <Button variant="default" size="sm" className="w-[150px] h-6 px-2 text-xs" onClick={() => router.push(`/admin/products/collection/${item.productId}/edit?draft=true`)}>
                          <Edit className="h-3 w-3 mr-1" /> 下書きを確認
                        </Button>
                      ): (
                        <Button variant="outline" size="sm" className="w-[150px] h-6 px-2 text-xs" onClick={() => router.push(`/admin/products/collection/${item.productId}/edit`)}>
                          {item.contractAddress ? (<>
                            <Edit className="h-3 w-3 mr-1" /> NFT情報を編集
                          </>) : (<>
                            <Plus className="h-3 w-3 mr-1" /> NFT情報を登録
                          </>)}
                        </Button>
                      )}
                    </>)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 操作ボタン */}
        <div className="flex justify-between gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={previewUrl} target="_blank">
              <ExternalLink className="h-3 w-3" />
              プレビュー
            </Link>
          </Button>
          <div className="flex gap-2">
            {isEditable && (
              <Button variant="outline" size="sm" asChild className="h-8 px-3">
                <Link href={`/admin/products/${productGroup.productGroupId}/edit`}>
                  <Edit className="h-3 w-3 mr-1" />
                  商品編集
                </Link>
              </Button>
            )}
            {isEngineer && (
              <Button variant="destructive" size="sm" className="h-8 px-3" onClick={() => onClickDelete(productGroup.productGroupId)}>
                <Trash2 className="h-3 w-3 mr-1" />
                削除
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
