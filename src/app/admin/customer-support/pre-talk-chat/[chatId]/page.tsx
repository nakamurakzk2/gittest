'use client'

import { HomeIcon } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

// Providers
import { useDialog } from "@/providers/dialog-provider"

// Entity
import { ChatItem, PreTalkChat } from "@/entity/user/user-chat"
import { User } from "@/entity/user/user"
import { ProductItem } from "@/entity/product/product"


// Components
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import AdminProductChatView from "@/app/admin/customer-support/_components/chat/AdminProductChatView"

// Logic
import * as AdminChatServerLogic from "@/logic/server/admin/admin-chat-server-logic"


interface PageProps {
  params: {
    chatId: string
  }
}

export default function ProductChatPage({ params }: PageProps) {
  const { chatId } = params
  const { onFetch } = useDialog()

  const [preTalkChat, setPreTalkChat] = useState<PreTalkChat | null>(null)
  const [chatItems, setChatItems] = useState<ChatItem[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [productItem, setProductItem] = useState<ProductItem | null>(null)

  const reload = async () => {
    await onFetch(async () => {
      const { preTalkChat, chatItems, user, productItem } = await AdminChatServerLogic.fetchPreTalkChat(chatId)
      setPreTalkChat(preTalkChat)
      setChatItems(chatItems)
      setUser(user)
      setProductItem(productItem)
    })
  }

  useEffect(() => {
    reload()
  }, [chatId])


  return (
    <main className="max-w-4xl mx-auto px-2 py-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin" className="flex items-center gap-1">
                <HomeIcon className="h-4 w-4" /> Admin
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/customer-support">顧客対応</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/customer-support/pre-talk-chat">事前相談チャット</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>チャット詳細</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>


      {preTalkChat && user && productItem && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">事前相談チャット</h1>
          </div>
          <div className="space-y-6">
            <AdminProductChatView
              chatItems={chatItems}
              unreadCount={preTalkChat.adminUnreadCount}
              user={user}
              productItem={productItem}
              reload={reload}
            />
          </div>
        </div>
      )}
    </main>
  )
}
