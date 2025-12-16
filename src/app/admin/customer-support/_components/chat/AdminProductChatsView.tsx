'use client'

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { MessageSquare, Clock, Eye } from "lucide-react"

// Component
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Providers
import { useDialog } from "@/providers/dialog-provider"

// Entity
import { ProductChat } from "@/entity/user/user-chat"
import { ProductItem } from "@/entity/product/product"
import { User } from "@/entity/user/user"

// Logic
import * as AdminChatServerLogic from "@/logic/server/admin/admin-chat-server-logic"
import * as CommonLogic from "@/logic/common-logic"

type Props = {
  townId: string
  businessId: string
}

type ChatDetail = {
  chatId: string
  userId: string
  chatCount: number
  unreadCount: number
  username: string
  productTitle: string
  productImage: string
  tokenId: number
  updatedAt: number
}

export default function AdminProductChatsView({ townId, businessId }: Props) {
  const { onFetch } = useDialog()
  const router = useRouter()
  const [productChats, setProductChats] = useState<ProductChat[]>([])
  const [productItems, setProductItems] = useState<ProductItem[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const reload = async () => {
    await onFetch(async () => {
      const { productChats, productItems, users } = await AdminChatServerLogic.fetchProductChats(townId, businessId)
      setProductChats(productChats)
      setProductItems(productItems)
      setUsers(users)
    })
  }

  useEffect(() => {
    reload()
  }, [townId, businessId])


  const chatDetails = useMemo(() => {
    const chatDetails: ChatDetail[] = []
    for (const chat of productChats) {
      const user = users.find(user => user.userId === chat.userId)
      const productItem = productItems.find(item => item.productId === chat.productId)
      if (productItem == null) continue
      chatDetails.push({
        chatId: chat.chatId,
        chatCount: chat.chatCount,
        unreadCount: chat.adminUnreadCount,
        userId: chat.userId,
        username: user == null ? "不明" : `${user.billingInfo.lastName} ${user.billingInfo.firstName}`,
        productTitle: productItem.title.ja,
        productImage: productItem.images.length > 0 ? productItem.images[0] : "",
        tokenId: chat.tokenId,
        updatedAt: chat.updatedAt,
      })
    }

    return chatDetails
      .filter(e => e.chatCount > 0)
      .sort((a, b) => {
        if (a.unreadCount > 0 && b.unreadCount === 0) return -1
        if (a.unreadCount === 0 && b.unreadCount > 0) return 1
        return b.updatedAt - a.updatedAt
      })
  }, [productChats, productItems])

  // ページネーション
  const totalPages = Math.ceil(chatDetails.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentChats = chatDetails.slice(startIndex, endIndex)

  const onClickChat = (chatId: string, userId: string) => {
    router.push(`/admin/customer-support/product-chat/${chatId}/${userId}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">商品チャット一覧</h3>
        <div className="text-sm text-gray-500">
          {chatDetails.length}件中 {startIndex + 1}-{Math.min(endIndex, chatDetails.length)}件を表示
        </div>
      </div>

      <div className="space-y-2">
        {currentChats.map((chat) => (
          <Card
            key={chat.chatId}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onClickChat(chat.chatId, chat.userId)}
          >
            <CardContent className="p-3">
              <div className="flex items-center space-x-3">
                {/* 商品画像（小さく） */}
                <div className="flex-shrink-0">
                  {chat.productImage.length > 0 ? (
                    <img
                      src={chat.productImage}
                      alt={chat.productTitle}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* メインコンテンツ */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    {/* ユーザ名 */}
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {chat.username}
                    </div>
                    {/* 更新日時 */}
                    <div className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {CommonLogic.formatDate(chat.updatedAt, "yyyy/MM/dd hh:mm:ss")}
                    </div>
                  </div>

                  {/* 商品情報とチャット数 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs text-gray-600 truncate">
                        {chat.productTitle}
                      </span>
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        #{chat.tokenId}
                      </Badge>
                    </div>

                    {/* 未読数とチャット数 */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {chat.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs px-2 py-0">
                          {chat.unreadCount}
                        </Badge>
                      )}
                      <span className="text-xs text-gray-400">
                        {chat.chatCount}件
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            前へ
          </Button>

          <span className="text-sm text-gray-500">
            {currentPage} / {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            次へ
          </Button>
        </div>
      )}

      {chatDetails.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          チャット履歴はありません
        </div>
      )}
    </div>
  )
}
