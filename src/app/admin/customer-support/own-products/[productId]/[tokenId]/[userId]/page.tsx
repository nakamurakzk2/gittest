'use client'

import { HomeIcon } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

// Providers
import { useDialog } from "@/providers/dialog-provider"

// Entity
import { User } from "@/entity/user/user"
import { OwnAssetProduct, OwnProduct, ProductItem } from "@/entity/product/product"
import { ChatItem, ProductChat } from "@/entity/user/user-chat"
import { FormAnswer, FormMaster } from "@/entity/product/form"

// Components
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import AdminOwnProductView from "@/app/admin/customer-support/_components/own-product/AdminOwnProductView"

// Logic
import * as AdminProductServerLogic from "@/logic/server/admin/admin-product-server-logic"


interface PageProps {
  params: {
    productId: string
    tokenId: string
    userId: string
  }
}

export default function OwnProductPage({ params }: PageProps) {
  const { productId, tokenId, userId } = params
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const defaultTab = (tabParam === "status" || tabParam === "chat" || tabParam === "forms") ? tabParam : "status"
  const tokenIdNumber = parseInt(tokenId, 10)
  const { onFetch } = useDialog()

  const [productItem, setProductItem] = useState<ProductItem | null>(null)
  const [ownProduct, setOwnProduct] = useState<OwnProduct | null>(null)
  const [ownAssetProduct, setOwnAssetProduct] = useState<OwnAssetProduct | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [productChat, setProductChat] = useState<ProductChat | null>(null)
  const [chatItems, setChatItems] = useState<ChatItem[]>([])
  const [formMasters, setFormMasters] = useState<FormMaster[]>([])
  const [formAnswers, setFormAnswers] = useState<FormAnswer[]>([])

  const reload = async () => {
    await onFetch(async () => {
      const { productItem, ownProduct, ownAssetProduct, user, productChat, chatItems, formMasters, formAnswers } = await AdminProductServerLogic.fetchOwnProduct(productId, tokenIdNumber, userId)
      setProductItem(productItem)
      setOwnProduct(ownProduct)
      setOwnAssetProduct(ownAssetProduct)
      setUser(user)
      setProductChat(productChat)
      setChatItems(chatItems)
      setFormMasters(formMasters)
      setFormAnswers(formAnswers)
    })
  }

  useEffect(() => {
    reload()
  }, [productId, tokenId])
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
              <Link href="/admin/customer-support/own-products">商品購入ユーザ</Link>
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
            defaultTab={defaultTab}
          />
        </div>
      )}
    </main>
  )
}
