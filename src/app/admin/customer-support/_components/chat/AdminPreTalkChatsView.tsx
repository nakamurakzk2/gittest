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
import { PreTalkChat, ProductChat } from "@/entity/user/user-chat"

// Logic
import * as AdminChatServerLogic from "@/logic/server/admin/admin-chat-server-logic"
import * as CommonLogic from "@/logic/common-logic"
import { ProductItem } from "@/entity/product/product"

type Props = {
  townId: string
  businessId: string
}

type PreTalkChatWithProduct = PreTalkChat & {
  product: ProductItem
}

export default function AdminPreTalkChatsView({ townId, businessId }: Props) {
  const { onFetch } = useDialog()
  const router = useRouter()
  const [preTalkChats, setPreTalkChats] = useState<PreTalkChat[]>([])
  const [productItems, setProductItems] = useState<ProductItem[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const reload = async () => {
    await onFetch(async () => {
      const { preTalkChats, productItems } = await AdminChatServerLogic.fetchPreTalkChats(townId, businessId)
      setPreTalkChats(preTalkChats)
      setProductItems(productItems)
    })
  }

  useEffect(() => {
    reload()
  }, [townId, businessId])

  // 商品チャットと商品情報を結合し、ソート
  const sortedProductChats = useMemo(() => {
    const productMap = new Map(productItems.map(item => [item.productId, item]))

    const chatsWithPreTalkChat: PreTalkChatWithProduct[] = preTalkChats
      .map(chat => ({
        ...chat,
        product: productMap.get(chat.productId)!
      }))
      .filter(chat => chat.product) // 商品情報が存在するもののみ

    // ソート: 未読数が1以上のものを優先、その後更新日時の降順
    return chatsWithPreTalkChat.sort((a, b) => {
      // 未読数で比較（未読があるものを上に）
      if (a.adminUnreadCount > 0 && b.adminUnreadCount === 0) return -1
      if (a.adminUnreadCount === 0 && b.adminUnreadCount > 0) return 1

      // 更新日時の降順
      return b.updatedAt - a.updatedAt
    })
  }, [preTalkChats, productItems])

  // ページネーション
  const totalPages = Math.ceil(sortedProductChats.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentChats = sortedProductChats.slice(startIndex, endIndex)

  const onClickChat = (chatId: string) => {
    router.push(`/admin/customer-support/pre-talk-chat/${chatId}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">事前相談チャット一覧</h3>
        <div className="text-sm text-gray-500">
          {sortedProductChats.length}件中 {startIndex + 1}-{Math.min(endIndex, sortedProductChats.length)}件を表示
        </div>
      </div>

      <div className="space-y-2">
        {currentChats.map((chat) => (
          <Card
            key={chat.chatId}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onClickChat(chat.chatId)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                {/* 商品画像 */}
                <div className="flex-shrink-0">
                  {chat.product.images.length > 0 ? (
                    <img
                      src={chat.product.images[0]}
                      alt={chat.product.title.ja}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* 商品情報 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 truncate">
                        {chat.product.title.ja}
                      </h4>
                    </div>

                    {/* 未読数バッジ */}
                    {chat.adminUnreadCount > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        未読数: {chat.adminUnreadCount}
                      </Badge>
                    )}
                  </div>

                  {/* 更新日時 */}
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <Clock className="w-4 h-4 mr-1" />
                    {CommonLogic.formatDate(chat.updatedAt, "yyyy.MM.dd hh:mm")}
                  </div>
                </div>

                {/* クリックインジケーター */}
                <div className="flex-shrink-0">
                  <Eye className="w-5 h-5 text-gray-400" />
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

      {sortedProductChats.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          商品チャットがありません
        </div>
      )}
    </div>
  )
}
