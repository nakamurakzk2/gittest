"use client"

import { useState } from "react"

// Components
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

// Entity
import { SimpleChat, ChatItem, ChatUserType } from "@/entity/user/user-chat"

// Providers
import { useDialog } from "@/providers/dialog-provider"
import { toast } from "@/components/hooks/use-toast"

// Logic
import * as CommonLogic from "@/logic/common-logic"
import * as UserChatPageServerLogic from "@/logic/server/user/user-chat-page-server-logic"

interface Props {
  productId: string
  tokenId?: number | null
  simpleChat: SimpleChat
  setSimpleChat: (chat: SimpleChat) => void
  readonly?: boolean
}

export default function ChatView({ productId, simpleChat, setSimpleChat, tokenId = null, readonly = false }: Props) {
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
        const response = await UserChatPageServerLogic.sendPreTalkChat(productId, message, [])
        setSimpleChat(response.simpleChat)
      } else {
        const response = await UserChatPageServerLogic.sendProductChat(productId, tokenId, message, [])
        setSimpleChat(response.simpleChat)
      }
      setMessage("")
      toast({
        title: "メッセージを送信しました",
      })
    })
  }

  // 検索クエリでフィルタリング
  const filteredChatItems = simpleChat.chatItems.filter(item =>
    item.message.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  // 新規メッセージの判定（最新のメッセージからunreadCount分）
  const getUnreadMessageIndices = () => {
    if (simpleChat.unreadCount <= 0) return new Set()

    const unreadIndices = new Set<number>()
    let adminMessageCount = 0

    // 最新のメッセージから逆順でカウント
    for (let i = filteredChatItems.length - 1; i >= 0; i--) {
      const item = filteredChatItems[i]
      if (item.chatUserType === ChatUserType.ADMIN) {
        adminMessageCount++
        if (adminMessageCount <= simpleChat.unreadCount) {
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

  return (
    <Card>
      <CardContent className="p-4">
        {/* 新規メッセージ数表示 */}
        {simpleChat.unreadCount > 0 && (
          <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
            新規メッセージがあります: {simpleChat.unreadCount}件
          </div>
        )}

        {/* メッセージ検索 */}
        <div className="mb-4">
          <Input
            placeholder="過去のメッセージ"
            className="w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* チャット履歴 */}
        <div className="space-y-4 mb-4 h-96 max-h-[600px] overflow-y-auto">
          {filteredChatItems.length > 0 ? (
            filteredChatItems.map((item: ChatItem, index: number) => {
              const isUnread = unreadMessageIndices.has(index)
              return (
                <div key={item.chatItemId} className={item.chatUserType === ChatUserType.USER ? "text-right" : "text-left"}>
                  <div className={item.chatUserType === ChatUserType.USER
                    ? "inline-block bg-[#00349B] text-white p-2 rounded-lg text-sm whitespace-pre-wrap text-left"
                    : "inline-block p-2 rounded-lg text-sm whitespace-pre-wrap bg-gray-100 text-gray-900"
                  }>
                    {item.message}
                  </div>

                  {/* 画像表示 */}
                  {item.images && item.images.length > 0 && (
                    <div className={`mt-2 space-y-2 ${item.chatUserType === ChatUserType.USER ? "flex flex-col items-end" : "flex flex-col items-start"}`}>
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
        {!readonly && (
          <div className="space-y-2">
            <Textarea
              placeholder="メッセージを入力"
              className="min-h-[100px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button
                onClick={onClickSendMessage}
                disabled={!message.trim()}
                size="sm"
              >
                送信
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* 画像拡大表示ダイアログ */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0">
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
