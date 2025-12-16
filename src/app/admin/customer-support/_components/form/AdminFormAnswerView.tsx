'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Clock, FileCheck } from "lucide-react"
import Image from "next/image"

// Providers
import { useDialog } from "@/providers/dialog-provider"

// Entity
import { FormAnswer, FormMaster } from "@/entity/product/form"
import { ProductItem } from "@/entity/product/product"
import { User } from "@/entity/user/user"

// Components
import { Card, CardContent } from "@/components/ui/card"
import AdminFormTabs from "@/app/admin/customer-support/_components/form/AdminFormTabs"
import AdminFormAnswersList from "@/app/admin/customer-support/_components/form/AdminFormAnswersList"

// Logic
import * as AdminFormServerLogic from "@/logic/server/admin/admin-form-server-logic"


type Props = {
  productId: string
  initialFormId: string
}

export default function AdminFormAnswerView({ productId, initialFormId }: Props) {
  const router = useRouter()
  const { onFetch } = useDialog()

  const [ formId, setFormId ] = useState<string>(initialFormId)
  const [ productItem, setProductItem ] = useState<ProductItem | null>(null)
  const [ formMasters, setFormMasters ] = useState<FormMaster[]>([])
  const [ formAnswers, setFormAnswers ] = useState<FormAnswer[]>([])
  const [ users, setUsers ] = useState<User[]>([])

  const reload = async () => {
    await onFetch(async () => {
      const { productItem, formMasters, formAnswers, users } = await AdminFormServerLogic.fetchFormAnswer(productId)
      setProductItem(productItem)
      setFormMasters(formMasters)
      setFormAnswers(formAnswers)
      setUsers(users)
    })
  }

  useEffect(() => {
    reload()
  }, [productId])

  if (productItem == null) {
    return <div>Loading...</div>
  }

  // 選択されたフォームの回答を取得（回答日時の降順で並び替え）
  const selectedFormAnswers = formAnswers
    .filter(answer => answer.formId === formId)
    .sort((a, b) => b.createdAt - a.createdAt)
  const selectedFormMaster = formMasters.find(master => master.formId === formId)

  return (
    <div className="space-y-6">
      {/* 商品情報 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            {productItem.images.length > 0 && (
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={productItem.images[0]}
                  alt={productItem.title.ja}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {productItem.title.ja}
              </h1>
              <p className="text-gray-600 mb-4">
                {productItem.description.ja}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  価格: ¥{productItem.price.toLocaleString()}
                </span>
                <span className="flex items-center">
                  <FileCheck className="w-4 h-4 mr-1" />
                  在庫: {productItem.stock}個
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* フォームタブ */}
      {formMasters.length > 0 && selectedFormMaster && (
        <AdminFormTabs
          formMasters={formMasters}
          selectedFormId={formId}
          answerCount={selectedFormAnswers.length}
          onFormIdChange={setFormId}
        >
          <AdminFormAnswersList
            formAnswers={selectedFormAnswers}
            formMaster={selectedFormMaster}
            users={users}
          />
        </AdminFormTabs>
      )}
    </div>
  )
}
