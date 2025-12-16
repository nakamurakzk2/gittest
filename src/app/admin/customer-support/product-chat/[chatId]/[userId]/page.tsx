'use client'

import { HomeIcon } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

// Providers
import { useDialog } from "@/providers/dialog-provider"

// Entity
import { User } from "@/entity/user/user"
import { ChatItem, ProductChat } from "@/entity/user/user-chat"
import { OwnAssetProduct, OwnProduct, ProductItem } from "@/entity/product/product"
import { FormAnswer, FormMaster } from "@/entity/product/form"

// Components
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import AdminOwnProductView from "@/app/admin/customer-support/_components/own-product/AdminOwnProductView"

// Logic
import * as AdminProductServerLogic from "@/logic/server/admin/admin-product-server-logic"


interface PageProps {
  params: {
    chatId: string,
    userId: string
  }
}

export default function ProductChatPage({ params }: PageProps) {
  const { chatId, userId } = params
  const { onFetch } = useDialog()

  const [productChat, setProductChat] = useState<ProductChat | null>(null)
  const [chatItems, setChatItems] = useState<ChatItem[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [productItem, setProductItem] = useState<ProductItem | null>(null)
  const [ownProduct, setOwnProduct] = useState<OwnProduct | null>(null)
  const [ownAssetProduct, setOwnAssetProduct] = useState<OwnAssetProduct | null>(null)
  const [formMasters, setFormMasters] = useState<FormMaster[]>([])
  const [formAnswers, setFormAnswers] = useState<FormAnswer[]>([])

  const reload = async () => {
    await onFetch(async () => {
      const { productChat, chatItems, user, productItem, ownProduct, ownAssetProduct, formMasters, formAnswers } = await AdminProductServerLogic.fetchOwnProductByChatId(chatId, userId)
      setProductChat(productChat)
      setChatItems(chatItems)
      setUser(user)
      setProductItem(productItem)
      setOwnAssetProduct(ownAssetProduct)
      setOwnProduct(ownProduct)
      setFormMasters(formMasters)
      setFormAnswers(formAnswers)
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
              <Link href="/admin/customer-support/product-chat">商品チャット</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>商品購入ユーザ詳細</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>


      {(ownProduct || ownAssetProduct) && user && productItem && productChat && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">商品購入ユーザ詳細</h1>
          </div>
          <AdminOwnProductView
            user={user}
            productItem={productItem}
            ownProduct={ownProduct}
            ownAssetProduct={ownAssetProduct}
            productChat={productChat}
            chatItems={chatItems}
            formMasters={formMasters}
            formAnswers={formAnswers}
            reload={reload}
            defaultTab="chat"
          />
        </div>
      )}
    </main>
  )
}
