'use client'

import { Edit, Save, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

// Entity
import { OwnProduct, AdminProductStatus, OwnAssetProduct } from "@/entity/product/product"
import { Attribute } from "@/entity/product/contract"

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Providers
import { useDialog } from "@/providers/dialog-provider"

// Logic
import * as AdminProductServerLogic from "@/logic/server/admin/admin-product-server-logic"

type Props = {
  ownProduct: OwnProduct | OwnAssetProduct
  isEditable: boolean
  reload: () => Promise<void>
}

export default function AdminProductAttributesTab({ ownProduct, isEditable, reload }: Props) {
  const { onFetch } = useDialog()

  const [isEditing, setIsEditing] = useState(false)
  const [attributes, setAttributes] = useState<Attribute[]>(ownProduct.attributes || [])
  const [isEditingStatus, setIsEditingStatus] = useState(false)
  const [adminStatus, setAdminStatus] = useState<AdminProductStatus>(ownProduct.adminStatus || AdminProductStatus.CONSULTATION)

  const onClickSaveAttributes = async () => {
    await onFetch(async () => {
      const { productId, tokenId } = ownProduct
      await AdminProductServerLogic.updateOwnProductAttributes(productId, tokenId, attributes)
      await reload()
      setIsEditing(false)
    })
  }

  const onClickAddAttribute = () => {
    setAttributes([...attributes, { trait_type: "", value: "" }])
  }

  const onClickRemoveAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index))
  }

  const onChangeAttribute = (index: number, field: keyof Attribute, value: string) => {
    const newAttributes = [...attributes]
    newAttributes[index] = { ...newAttributes[index], [field]: value }
    setAttributes(newAttributes)
  }

  const onClickSaveAdminStatus = async () => {
    await onFetch(async () => {
      const { productId, tokenId } = ownProduct
      await AdminProductServerLogic.updateAdminProductStatus(productId, tokenId, adminStatus)
      await reload()
      setIsEditingStatus(false)
    })
  }

  const getStatusLabel = (status: AdminProductStatus) => {
    switch (status) {
      case AdminProductStatus.CONSULTATION:
        return "相談"
      case AdminProductStatus.IN_USE:
        return "使う"
      case AdminProductStatus.COMPLETED:
        return "完了"
      default:
        return status
    }
  }

  return (
    <div className="space-y-4">
      {/* Admin Status Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              <div className="text-lg">
                管理者ステータス
              </div>
            </div>
            {isEditable && (
              <div className="flex gap-2">
                {!isEditingStatus ? (
                  <Button onClick={() => setIsEditingStatus(true)} variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    編集
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={onClickSaveAdminStatus} variant="default" size="sm">
                      <Save className="h-4 w-4 mr-1" />
                      保存
                    </Button>
                    <Button onClick={() => setIsEditingStatus(false)} variant="outline" size="sm">
                      キャンセル
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditingStatus ? (
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">ステータス</Label>
                <Select value={adminStatus} onValueChange={(value) => setAdminStatus(value as AdminProductStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AdminProductStatus.CONSULTATION}>相談</SelectItem>
                    <SelectItem value={AdminProductStatus.IN_USE}>使う</SelectItem>
                    <SelectItem value={AdminProductStatus.COMPLETED}>完了</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm">
                <span className="font-medium">現在のステータス:</span>
                <span className="ml-2">{getStatusLabel(adminStatus)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attributes Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              <div className="text-lg">
                Attributes
              </div>
            </div>
            {isEditable && (
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    編集
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={onClickSaveAttributes} variant="default" size="sm">
                      <Save className="h-4 w-4 mr-1" />
                      保存
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                      キャンセル
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-3">
              {attributes.map((attribute, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label className="text-xs font-medium">Trait Type</Label>
                    <Input
                      value={attribute.trait_type}
                      onChange={(e) => onChangeAttribute(index, 'trait_type', e.target.value)}
                      placeholder="属性名"
                      className="text-xs"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs font-medium">Value</Label>
                    <Input
                      value={attribute.value}
                      onChange={(e) => onChangeAttribute(index, 'value', e.target.value)}
                      placeholder="属性値"
                      className="text-xs"
                    />
                  </div>
                  <Button
                    onClick={() => onClickRemoveAttribute(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={onClickAddAttribute} variant="outline" className="w-full" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                属性を追加
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {attributes.length === 0 ? (
                <p className="text-gray-500 text-sm">属性が設定されていません</p>
              ) : (
                attributes.map((attribute, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-sm">
                      <span className="font-medium">{attribute.trait_type}</span>
                      <span className="mx-2">:</span>
                      <span>{attribute.value}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
