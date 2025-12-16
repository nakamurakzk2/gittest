'use client'

import { User as UserIcon, Package } from "lucide-react"

// Providers
import { useAdminSession } from "@/providers/admin-session-provider"

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AdminChatView from "@/app/admin/customer-support/_components/chat/AdminChatView"
import NoPermissionView from "@/components/common/NoPermissionView"

// Entity
import { ChatItem } from "@/entity/user/user-chat"
import { OwnProduct, ProductItem } from "@/entity/product/product"
import { User } from "@/entity/user/user"
import { AdminUserType } from "@/entity/admin/user"


type Props = {
  chatItems: ChatItem[]
  unreadCount: number
  user: User
  productItem: ProductItem
  ownProduct?: OwnProduct | null
  reload: () => Promise<void>
}

export default function AdminProductChatView({ chatItems, unreadCount, user, productItem, ownProduct = null, reload }: Props) {
  const { simpleAdminUser } = useAdminSession()

  if (simpleAdminUser == null) {
    return <NoPermissionView />
  }


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 左側: 商品情報とユーザー情報 */}
      <div className="space-y-4">

        {/* ユーザー情報 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              <div className="text-lg">
                ユーザー情報
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">メールアドレス</p>
                  <p className="font-medium text-xs">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">氏名</p>
                  <p className="font-medium text-xs">
                    {user.billingInfo.lastName} {user.billingInfo.firstName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">電話番号</p>
                  <p className="font-medium text-xs">{user.billingInfo.phoneNumber}</p>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">ユーザー情報を読み込み中...</div>
            )}
          </CardContent>
        </Card>

        {/* 商品情報 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <div className="text-lg">
                商品情報
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {productItem ? (
              <div className="space-y-3">
                <div
                  className="cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                  onClick={() => {
                    const url = `/product/${productItem.productGroupId}?productId=${productItem.productId}`
                    window.open(url, '_blank')
                  }}
                >
                  <h3 className="font-semibold hover:text-blue-600 transition-colors text-sm">{productItem.title.ja}</h3>
                  <p className="text-xs text-gray-600">{productItem.description.ja}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">¥{productItem.price.toLocaleString()}</span>
                </div>
                {productItem.images.length > 0 && (
                  <div className="mt-3">
                    <img
                      src={productItem.images[0]}
                      alt={productItem.title.ja}
                      className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => {
                        const url = `/product/${productItem.productGroupId}?productId=${productItem.productId}`
                        window.open(url, '_blank')
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500">商品情報を読み込み中...</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 右側: チャット履歴と送信フォーム */}
      <div className="lg:col-span-2">
        <AdminChatView
          chatItems={chatItems}
          tokenId={ownProduct == null ? null : ownProduct.tokenId}
          unreadCount={unreadCount}
          userId={user.userId}
          isEditable={simpleAdminUser.adminUserType !== AdminUserType.TOWN_VIEWER && simpleAdminUser.adminUserType !== AdminUserType.BUSINESS_VIEWER}
          reload={reload}
          productItem={productItem}
        />
      </div>
    </div>
  )
}
