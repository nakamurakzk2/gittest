'use client'

import { useState } from "react"

// Component
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent } from "@/components/ui/dialog"

// Providers
import { useDialog } from "@/providers/dialog-provider"
import { toast } from "@/components/hooks/use-toast"

// Entity
import { ChatItem, ChatUserType } from "@/entity/user/user-chat"
import { ProductItem } from "@/entity/product/product"

// Logic
import * as CommonLogic from "@/logic/common-logic"
import * as AdminChatServerLogic from "@/logic/server/admin/admin-chat-server-logic"

interface Props {
  chatItems: ChatItem[]
  unreadCount: number
  userId: string
  productItem: ProductItem
  isEditable: boolean
  tokenId?: number | null
  reload: () => Promise<void>
}

export default function AdminChatView({ chatItems, unreadCount, userId, productItem, isEditable, tokenId = null, reload }: Props) {
  const { townId, businessId, productId } = productItem
  const { onFetch } = useDialog()
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  /**
   * メッセージを送信
   */
  const onClickSendMessage = async () => {
    if (message.trim() === "") return
    await onFetch(async () => {
      if (tokenId == null) {
        await AdminChatServerLogic.sendPreTalkChat(townId, businessId, userId, productId, message, [])
      } else {
        await AdminChatServerLogic.sendProductChat(townId, businessId, userId, productId, tokenId, message, [])
      }
      setMessage("")
      await reload()
      toast({
        title: "メッセージを送信しました",
      })
    })
  }

  // 検索クエリでフィルタリング
  const filteredChatItems = chatItems.filter(item =>
    item.message.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  // 未返信メッセージの判定（最新のメッセージからunreadCount分）
  const getUnreadMessageIndices = () => {
    if (unreadCount <= 0) return new Set()

    const unreadIndices = new Set<number>()
    let userMessageCount = 0

    // 最新のメッセージから逆順でカウント
    for (let i = filteredChatItems.length - 1; i >= 0; i--) {
      const item = filteredChatItems[i]
      if (item.chatUserType === ChatUserType.USER) {
        userMessageCount++
        if (userMessageCount <= unreadCount) {
          unreadIndices.add(i)
        }
      }
    }

    return unreadIndices
  }

  const unreadMessageIndices = getUnreadMessageIndices()

  /**
   * 画像をクリックした時の処理
   */
  const onClickImage = (imageUrl: string) => {
    setSelectedImage(imageUrl)
  }

  /**
   * 未読数をリセット
   */
  const onClickResetUnread = async () => {
    await onFetch(async () => {
      if (tokenId == null) {
        await AdminChatServerLogic.resetPreTalkUnreadCount(townId, businessId, userId, productId)
      } else {
        await AdminChatServerLogic.resetProductUnreadCount(townId, businessId, userId, productId, tokenId)
      }
      await reload()
      toast({
        title: "未読数をリセットしました",
      })
    })
  }

  return (
    <Card>
      <CardContent className="p-4">
        {/* 未返信メッセージ数表示 */}
        {unreadCount > 0 && (
          <div className="mb-4 p-2 bg-orange-50 border border-orange-200 rounded text-sm text-orange-800 flex items-center justify-between">
            <span>未返信のメッセージ: {unreadCount}件</span>
            {isEditable && (
              <Button size="sm" variant="outline" className="text-xs" onClick={onClickResetUnread}>
                既読にする
              </Button>
            )}
          </div>
        )}

        {/* メッセージ検索 */}
        <div className="mb-4">
          <Input
            placeholder="過去のメッセージを検索"
            className="w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* チャット履歴 */}
        <div className="space-y-4 mb-4 h-96 max-h-[600px]  overflow-y-auto">
          {filteredChatItems.length > 0 ? (
            filteredChatItems.map((item: ChatItem, index: number) => {
              const isUnread = unreadMessageIndices.has(index)
              return (
                <div key={item.chatItemId} className={item.chatUserType === ChatUserType.ADMIN ? "text-right" : "text-left"}>
                  <div className={item.chatUserType === ChatUserType.ADMIN
                    ? "inline-block bg-[#00349B] text-white p-3 rounded-lg text-sm max-w-xs whitespace-pre-wrap text-left"
                    : `inline-block p-3 rounded-lg text-sm max-w-xs whitespace-pre-wrap ${isUnread
                      ? "bg-orange-100 border-2 border-orange-300 text-orange-900"
                      : "bg-gray-100 text-gray-900"
                    }`
                  }>
                    {item.message}
                    {isUnread && (
                      <div className="text-xs text-orange-600 font-semibold mt-1">
                        ⚠️ 未返信
                      </div>
                    )}
                  </div>

                  {/* 画像表示 */}
                  {item.images && item.images.length > 0 && (
                    <div className={`mt-2 space-y-2 ${item.chatUserType === ChatUserType.ADMIN ? "flex flex-col items-end" : "flex flex-col items-start"}`}>
                      {item.images.map((imageUrl, imageIndex) => (
                        <div key={imageIndex} className="max-w-[120px]">
                          <img
                            src={imageUrl}
                            alt={`画像 ${imageIndex + 1}`}
                            className="w-full h-auto rounded-lg cursor-pointer hover:opacity-80 transition-opacity object-contain"
                            onClick={() => onClickImage(imageUrl)}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mt-1">
                    {CommonLogic.formatDate(item.createdAt, "yyyy.MM.dd hh:mm")}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center text-gray-500 text-sm">
              {searchQuery ? "該当するメッセージが見つかりません" : "まだメッセージがありません"}
            </div>
          )}
        </div>

        {/* メッセージ入力 */}
        {isEditable && (
          <div className="space-y-2">
            <Textarea
              placeholder="メッセージを入力"
              className="min-h-[100px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" disabled={!message.trim() || !isEditable} onClick={onClickSendMessage}>
                送信
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* 画像拡大表示ダイアログ */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          {selectedImage && (
            <div className="flex items-center justify-center p-4">
              <img
                src={selectedImage}
                alt="拡大画像"
                className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
