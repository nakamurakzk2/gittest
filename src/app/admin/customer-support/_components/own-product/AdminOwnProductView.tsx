'use client'

import { Package, MessageSquare, FileText, UserIcon } from "lucide-react"
import { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"

// Providers
import { useAdminSession } from "@/providers/admin-session-provider"

// Entity
import { OwnAssetProduct, OwnProduct, ProductItem } from "@/entity/product/product"
import { User } from "@/entity/user/user"
import { ChatItem, ProductChat } from "@/entity/user/user-chat"
import { FormAnswer, FormMaster } from "@/entity/product/form"

// Components
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminChatView from "@/app/admin/customer-support/_components/chat/AdminChatView"
import AdminProductAttributesTab from "@/app/admin/customer-support/_components/own-product/AdminProductAttributesTab"
import AdminFormAnswersTab from "@/app/admin/customer-support/_components/own-product/AdminFormAnswersTab"
import OwnProductStatusBadge from "@/components/common/OwnProductStatusBadge"
import OwnAssetProductStatusBadge from "@/components/common/OwnAssetProductStatusBadge"
import NoPermissionView from "@/components/common/NoPermissionView"

// Logic
import * as CommonLogic from "@/logic/common-logic"
import { AdminUserType } from "@/entity/admin/user"

type Props = {
  productItem: ProductItem
  ownProduct: OwnProduct | null
  ownAssetProduct: OwnAssetProduct | null
  user: User
  productChat: ProductChat
  chatItems: ChatItem[]
  formMasters: FormMaster[]
  formAnswers: FormAnswer[]
  reload: () => Promise<void>
  defaultTab?: "status" | "chat" | "forms"
}

export default function AdminOwnProductView({ productItem, ownProduct, ownAssetProduct, user, productChat, chatItems, formMasters, formAnswers, reload, defaultTab = "status" }: Props) {
  const { simpleAdminUser } = useAdminSession()
  const tokenId = ownProduct?.tokenId ?? ownAssetProduct?.tokenId ?? null

  const openseaUrl = useMemo(() => {
    if (productItem.chainId == null || productItem.contractAddress == null || tokenId == null) {
      return ''
    }
    return CommonLogic.getMarketplaceUrl(productItem.chainId, productItem.contractAddress, tokenId.toString())
  }, [productItem.chainId, productItem.contractAddress, tokenId])


  if (simpleAdminUser == null) {
    return <NoPermissionView />
  }

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* ユーザー情報 */}
        <Card>
          <CardHeader className="pt-4 pb-2">
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              <div className="text-lg">
                ユーザー情報
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600 font-bold">氏名</p>
                  <p className="font-medium text-sm">
                    {user.billingInfo.lastName} {user.billingInfo.firstName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-bold">メールアドレス</p>
                  <p className="font-medium text-sm">{user.email}</p>
                </div>
                {/*
                <div>
                  <p className="text-sm text-gray-600">電話番号</p>
                  <p className="font-medium text-sm">{user.billingInfo.phoneNumber}</p>
                </div>
                */}
              </div>
            ) : (
              <div className="text-gray-500">ユーザー情報を読み込み中...</div>
            )}
          </CardContent>
        </Card>
        {/* 商品情報 */}
        <Card>
          <CardHeader className="pt-4 pb-2">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <div className="text-lg">
                商品情報
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-start gap-2">
            {/* 左側: 画像 */}
            <div className="flex items-center gap-2">
              {productItem.images.length > 0 && (
                <Image
                  src={productItem.images[0]}
                  alt={productItem.title.ja}
                  width={100}
                  height={100}
                  className="object-contain rounded"
                />
              )}
              {productItem.images.length === 0 && (
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-gray-400" />
                </div>
              )}
            </div>
            {/* 右側: 商品情報 */}
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold hover:text-blue-600 transition-colors text-sm">{productItem.title.ja}</h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge>
                  #{tokenId}
                </Badge>
                {ownProduct && (
                  <OwnProductStatusBadge status={ownProduct.status} />
                )}
                {ownAssetProduct && (
                  <OwnAssetProductStatusBadge isOwner={ownAssetProduct.isOwner} />
                )}
                {openseaUrl != '' && (
                  <Link href={openseaUrl} target="_blank">
                    <Image src="/assets/opensea.png" alt="OpenSea" width={16} height={16} />
                  </Link>
                )}
              </div>
              <div>
                {ownProduct && (
                  <div className="text-xs text-gray-500 font-bold">
                    購入日時: {CommonLogic.formatDate(ownProduct.createdAt, "yyyy/MM/dd hh:mm:ss")}
                  </div>
                )}
                {ownAssetProduct && (
                  <div className="text-xs text-gray-500 font-bold">
                    NFT移動日時: {CommonLogic.formatDate(ownAssetProduct.createdAt, "yyyy/MM/dd hh:mm:ss")}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="status" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            商品ステータス
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            チャット
          </TabsTrigger>
          <TabsTrigger value="forms" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            フォーム回答
          </TabsTrigger>
        </TabsList>

        {/* 商品ステータスタブ */}
        <TabsContent value="status" className="mt-6">
          {ownProduct && (
            <AdminProductAttributesTab
              ownProduct={ownProduct}
              isEditable={simpleAdminUser.adminUserType !== AdminUserType.TOWN_VIEWER && simpleAdminUser.adminUserType !== AdminUserType.BUSINESS_VIEWER}
              reload={reload}
            />
          )}
          {ownAssetProduct && (
            <AdminProductAttributesTab
              ownProduct={ownAssetProduct}
              isEditable={simpleAdminUser.adminUserType !== AdminUserType.TOWN_VIEWER && simpleAdminUser.adminUserType !== AdminUserType.BUSINESS_VIEWER}
              reload={reload}
            />
          )}
        </TabsContent>

        {/* チャットタブ */}
        <TabsContent value="chat" className="mt-6">
          <AdminChatView
            chatItems={chatItems}
            tokenId={tokenId}
            unreadCount={productChat.adminUnreadCount}
            userId={user.userId}
            isEditable={simpleAdminUser.adminUserType !== AdminUserType.TOWN_VIEWER && simpleAdminUser.adminUserType !== AdminUserType.BUSINESS_VIEWER}
            reload={reload}
            productItem={productItem}
          />
        </TabsContent>

        {/* フォーム回答タブ */}
        <TabsContent value="forms" className="mt-6">
          <AdminFormAnswersTab
            formMasters={formMasters}
            formAnswers={formAnswers}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
