'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Providers
import { useDialog } from "@/providers/dialog-provider"
import { toast } from "@/components/hooks/use-toast"

// Entity
import { ProductCategory } from "@/entity/product/product"

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Logic
import * as AdminProductServerLogic from "@/logic/server/admin/admin-product-server-logic"
import ImageUploadView from "@/components/common/ImageUploadView"
import { Trash2Icon } from "lucide-react"


interface Props {
  productCategory?: ProductCategory | null
}

export default function ProductCategoryEditView({ productCategory }: Props) {
  const router = useRouter()
  const { onFetch, setYesNoDialogData } = useDialog()

  const [ nameJa, setNameJa ] = useState(productCategory?.name.ja || "")
  const [ nameEn, setNameEn ] = useState(productCategory?.name.en || "")
  const [ nameZh, setNameZh ] = useState(productCategory?.name.zh || "")
  const [ descriptionJa, setDescriptionJa ] = useState(productCategory?.description.ja || "")
  const [ descriptionEn, setDescriptionEn ] = useState(productCategory?.description.en || "")
  const [ descriptionZh, setDescriptionZh ] = useState(productCategory?.description.zh || "")
  const [ icon, setIcon ] = useState(productCategory?.icon || "")


  const onClickUpdate = async () => {
    const productCategoryData: ProductCategory = {
      categoryId: productCategory?.categoryId || "",
      name: {
        ja: nameJa,
        en: nameEn,
        zh: nameZh
      },
      description: {
        ja: descriptionJa,
        en: descriptionEn,
        zh: descriptionZh
      },
      icon,
      createdAt: productCategory?.createdAt || 0,
      updatedAt: productCategory?.updatedAt || 0
    }
    await onFetch(async () => {
      await AdminProductServerLogic.upsertProductCategory(productCategoryData)
      toast({
        description: "商品カテゴリ情報を登録しました",
      })
      router.push(`/admin/product-categories`)
    })
  }

  const onClickDelete = async () => {
    if (!productCategory?.categoryId) return

    setYesNoDialogData({
      title: "確認",
      description: "この商品カテゴリを削除します。本当によろしいですか？",
      onOk: async () => {
        await onFetch(async () => {
          await AdminProductServerLogic.deleteProductCategory(productCategory.categoryId)
          toast({
            description: "商品カテゴリを削除しました",
          })
          router.push(`/admin/product-categories`)
        })
      }
    })
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">商品カテゴリ情報</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-4">
            <Label className="text-sm font-medium">
              カテゴリ名 <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="nameJa" className="text-xs text-gray-600">日本語</Label>
                <Input
                  value={nameJa}
                  onChange={(e) => setNameJa(e.target.value)}
                  placeholder="カテゴリ名（日本語）"
                />
              </div>
              <div>
                <Label htmlFor="nameEn" className="text-xs text-gray-600">英語</Label>
                <Input
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="カテゴリ名（英語）"
                />
              </div>
              <div>
                <Label htmlFor="nameZh" className="text-xs text-gray-600">中国語</Label>
                <Input
                  value={nameZh}
                  onChange={(e) => setNameZh(e.target.value)}
                  placeholder="カテゴリ名（中国語）"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium">
              説明 <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="descriptionJa" className="text-xs text-gray-600">日本語</Label>
                <Textarea
                  value={descriptionJa}
                  onChange={(e) => setDescriptionJa(e.target.value)}
                  placeholder="説明（日本語）"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="descriptionEn" className="text-xs text-gray-600">英語</Label>
                <Textarea
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="説明（英語）"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="descriptionZh" className="text-xs text-gray-600">中国語</Label>
                <Textarea
                  value={descriptionZh}
                  onChange={(e) => setDescriptionZh(e.target.value)}
                  placeholder="説明（中国語）"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="icon" className="text-sm font-medium">
              アイコンURL
            </Label>
            <ImageUploadView
              image={icon}
              setImage={setIcon}
              type="product"
            />
          </div>
        </div>
        <div className="flex justify-between pt-6 border-t">
          <div>
            {productCategory?.categoryId && (
              <Button variant="destructive" onClick={onClickDelete}>
                <Trash2Icon className="w-4 h-4" />
                削除
              </Button>
            )}
          </div>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link href="/admin/product-categories">キャンセル</Link>
            </Button>
            <Button disabled={nameJa.length === 0} onClick={onClickUpdate}>
              登録
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}