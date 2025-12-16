'use client'

import { Clock, UserIcon, ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

// Entity
import { OwnAssetProduct, OwnProduct, OwnProductStatus, ProductItem } from "@/entity/product/product"

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User } from "@/entity/user/user"
import OwnProductStatusBadge from "@/components/common/OwnProductStatusBadge"
import OwnAssetProductStatusBadge from "@/components/common/OwnAssetProductStatusBadge"

// Providers
import { useDialog } from "@/providers/dialog-provider"

// Logic
import * as AdminProductServerLogic from "@/logic/server/admin/admin-product-server-logic"
import * as CommonLogic from "@/logic/common-logic"


type Props = {
  townId: string
  businessId: string
}

export default function OwnProductsView({ townId, businessId }: Props) {
  const { onFetch } = useDialog()
  const router = useRouter()

  const [ownProducts, setOwnProducts] = useState<OwnProduct[]>([])
  const [ownAssetProducts, setOwnAssetProducts] = useState<OwnAssetProduct[]>([])
  const [productItems, setProductItems] = useState<ProductItem[]>([])
  const [users, setUsers] = useState<User[]>([])

  const reload = async () => {
    await onFetch(async () => {
      const { ownProducts, ownAssetProducts, productItems, users } = await AdminProductServerLogic.fetchOwnProducts(townId, businessId)
      setProductItems(productItems)
      setOwnProducts(ownProducts)
      setOwnAssetProducts(ownAssetProducts)
      setUsers(users)
    })
  }

  useEffect(() => {
    reload()
  }, [townId, businessId])

  const getPurchaseCount = (productId: string) => {
    return ownProducts.filter(ownProduct => ownProduct.productId === productId).length
  }


  const onClickOwnProduct = (productId: string, tokenId: number, userId: string) => {
    router.push(`/admin/customer-support/own-products/${productId}/${tokenId}/${userId}`)
  }

  const getUserName = (userId: string) => {
    const user = users.find(user => user.userId === userId)
    return user ? `${user.billingInfo.lastName} ${user.billingInfo.firstName}` : "不明"
  }


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">商品一覧</h3>
        <Button onClick={reload} variant="outline">
          更新
        </Button>
      </div>

      <div className="space-y-6">
        {productItems.map((product) => {
          const productOwnProducts = ownProducts.filter(ownProduct => ownProduct.productId === product.productId).sort((a, b) => a.tokenId - b.tokenId)
          const productOwnAssetProducts = ownAssetProducts.filter(ownAssetProduct => ownAssetProduct.productId === product.productId).sort((a, b) => a.tokenId - b.tokenId)
          return (
            <Card key={product.productId}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  {product.images && product.images.length > 0 && (
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={product.images[0]}
                        alt={product.title.ja}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <CardTitle className="text-lg">{product.title.ja}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        {getPurchaseCount(product.productId)}件
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {productOwnProducts.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="text-sm text-gray-700">購入者</h4>
                    <div className="space-y-1">
                      {productOwnProducts.map((ownProduct, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => onClickOwnProduct(ownProduct.productId, ownProduct.tokenId, ownProduct.userId)}
                        >
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">
                              #{ownProduct.tokenId}
                            </Badge>
                            <UserIcon className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-500">
                              {getUserName(ownProduct.userId)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <OwnProductStatusBadge status={ownProduct.status} />
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-500">
                              {CommonLogic.formatDate(ownProduct.createdAt, "yyyy/MM/dd hh:mm:ss")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    購入者はいません
                  </div>
                )}
                {productOwnAssetProducts.length > 0 && (
                  <div className="space-y-2 mt-6">
                    <h4 className="text-sm text-gray-700">NFT所有者</h4>
                    <div className="space-y-1">
                      {productOwnAssetProducts.map((ownAssetProduct, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => onClickOwnProduct(ownAssetProduct.productId, ownAssetProduct.tokenId, ownAssetProduct.userId)}>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">
                              #{ownAssetProduct.tokenId}
                            </Badge>
                            <UserIcon className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-500">
                              {getUserName(ownAssetProduct.userId)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <OwnAssetProductStatusBadge isOwner={ownAssetProduct.isOwner} />
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-500">
                              {CommonLogic.formatDate(ownAssetProduct.createdAt, "yyyy/MM/dd hh:mm:ss")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {productItems.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          商品がありません
        </div>
      )}
    </div>
  )
}
