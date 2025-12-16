'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Copy, Trash2 } from "lucide-react"
import Link from "next/link"

// Entity
import { ProductItem } from "@/entity/product/product"

// Providers
import { useDialog } from "@/providers/dialog-provider"
import { toast } from "@/components/hooks/use-toast"

// Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductItemEditView from "@/app/admin/products/_components/ProductItemEditView"

// Logic
import * as AdminProductServerLogic from "@/logic/server/admin/admin-product-server-logic"

interface Props {
  townId: string
  businessId: string
  initialProductItems: ProductItem[]
  productGroupId?: string
}

export default function ProductEditView({ townId, businessId, productGroupId = '', initialProductItems }: Props) {
  const router = useRouter()
  const { onFetch } = useDialog()

  const [productItems, setProductItems] = useState<ProductItem[]>(initialProductItems)
  const [activeTab, setActiveTab] = useState("0")

  const createEmptyProduct = (): ProductItem => {
    const now = Date.now()
    return {
      productId: '',
      productGroupId: '',
      title: { ja: "", en: "", zh: "" },
      description: { ja: "", en: "", zh: "" },
      stock: 0,
      hideStock: false,
      deliveryText: { ja: "", en: "", zh: "" },
      paymentText: { ja: "", en: "", zh: "" },
      buyLimit: null,
      categoryIds: [],
      chatEnabled: false,
      price: 0,
      images: [],
      formIds: [],
      startTime: null,
      endTime: null,
      isDraft: false,
      townId: "",
      businessId: "",
      chainId: null,
      contractAddress: null,
      createdAt: now,
      updatedAt: now,
    }
  }

  const updateProductItems = (newProductItems: ProductItem[]) => {
    setProductItems(newProductItems)
  }

  const addProduct = () => {
    const newIndex = productItems.length
    const newProductItems = [...productItems, createEmptyProduct()]
    updateProductItems(newProductItems)
    setActiveTab(newIndex.toString())
  }

  const copyProductItem = (index: number) => {
    const productToCopy = productItems[index]
    const now = Date.now()
    const newProduct: ProductItem = {
      ...productToCopy,
      productId: '',
      createdAt: now,
      updatedAt: now,
    }
    const newProductItems = [...productItems]
    newProductItems.splice(index + 1, 0, newProduct)
    updateProductItems(newProductItems)
    setActiveTab((index + 1).toString())
  }

  const removeProductItem = (index: number) => {
    if (productItems.length > 1) {
      const newProductItems = productItems.filter((_, i) => i !== index)
      updateProductItems(newProductItems)

      // アクティブなタブが削除された場合、適切なタブに移動
      const currentActiveIndex = parseInt(activeTab)
      if (currentActiveIndex === index) {
        // 削除されたタブがアクティブだった場合、前のタブまたは最初のタブに移動
        const newActiveIndex = index > 0 ? index - 1 : 0
        setActiveTab(newActiveIndex.toString())
      } else if (currentActiveIndex > index) {
        // 削除されたタブより後のタブがアクティブだった場合、インデックスを調整
        setActiveTab((currentActiveIndex - 1).toString())
      }
    }
  }

  const updateProductItem = (index: number, data: ProductItem) => {
    const newProductItems = [...productItems]
    newProductItems[index] = {
      ...newProductItems[index],
      ...data,
      updatedAt: Date.now(),
    }
    updateProductItems(newProductItems)
  }

  const onClickUpdate = async () => {
    await onFetch(async () => {
      if (productGroupId) {
        await AdminProductServerLogic.updateProductGroup(townId, businessId, productGroupId, productItems)
      } else {
        await AdminProductServerLogic.insertProductGroup(townId, businessId, productItems)
      }
      toast({
        description: '商品を登録しました',
      })
      router.push(`/admin/products`)
    })
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full" style={{gridTemplateColumns: `repeat(${productItems.length}, minmax(0, 1fr))`}}>
            {productItems.map((product, index) => (
              <TabsTrigger key={index} value={index.toString()} className="flex items-center gap-2">
                <span>バリエーション {index + 1}</span>
                {product.title.ja && (
                  <span className="text-xs text-muted-foreground truncate max-w-20">
                    ({product.title.ja})
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex items-center gap-2 ml-4">
            <Button onClick={addProduct} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              追加
            </Button>
          </div>
        </div>

        {productItems.map((productItem, index) => (
          <TabsContent key={productItem.productId} value={index.toString()} className="space-y-2">
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => copyProductItem(index)} className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                バリエーションをコピー
              </Button>
              {productItems.length > 1 && (
                <Button variant="destructive" size="sm" onClick={() => removeProductItem(index)} className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  削除
                </Button>
              )}
            </div>
            <ProductItemEditView
              item={productItem}
              townId={townId}
              businessId={businessId}
              onUpdate={(item) => updateProductItem(index, item)}
            />
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-end gap-4 mt-8">
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/products">キャンセル</Link>
        </Button>
        <Button onClick={onClickUpdate}>
          {`${productItems.length}個の商品を登録`}
        </Button>
      </div>
    </div>
  )
}