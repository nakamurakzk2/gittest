"use client"

import { LANGUAGE_LIST } from "@/define/language"
import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import Image from "next/image"

// Components
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import ChatView from "@/app/(page)/account/_components/ChatView"

// Providers
import { useLanguageSession } from "@/providers/language-provider"
import { useDialog } from "@/providers/dialog-provider"

// Entity
import { OwnProductStatus, SimpleProductItem, ProductCategory, SimpleProductCategory } from "@/entity/product/product"
import { SimpleChat } from "@/entity/user/user-chat"
import { SimpleBusiness } from "@/entity/town/business"

// Logic
import * as UserProductPageServerLogic from "@/logic/server/user/user-product-page-server-logic"


interface Props {
  productId: string
}

export default function PreTalkChatView({ productId }: Props) {
  const { onFetch } = useDialog()
  const { getLocalizedText } = useLanguageSession()

  const [productItem, setProductItem] = useState<SimpleProductItem | null>(null)
  const [business, setBusiness] = useState<SimpleBusiness | null>(null)
  const [simpleCategories, setSimpleCategories] = useState<SimpleProductCategory[]>([])
  const [simpleChat, setSimpleChat] = useState<SimpleChat | null>(null)

  /**
   * 再読み込み
   */
  const reload = async () => {
    await onFetch(async () => {
      const { simpleProductItem, simpleBusiness, simpleCategories, simpleChat } = await UserProductPageServerLogic.fetchPreTalkChatPage(productId)
      setProductItem(simpleProductItem)
      setBusiness(simpleBusiness)
      setSimpleCategories(simpleCategories)
      setSimpleChat(simpleChat)
    })
  }

  useEffect(() => {
    reload()
  }, [productId])

  const getStatusBadge = (status: OwnProductStatus) => {
    switch (status) {
      case OwnProductStatus.PENDING_PAYMENT:
        return <Badge variant="secondary">入金待ち</Badge>
      case OwnProductStatus.PURCHASED:
        return <Badge variant="default">購入済み</Badge>
      case OwnProductStatus.NFT_MINTED:
        return <Badge variant="default">NFT発行済</Badge>
      case OwnProductStatus.NFT_TRANSFERRED:
        return <Badge variant="outline">転送済み</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (productItem == null) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* 左側: 商品情報 */}
      <div className="w-full md:w-[250px] flex-shrink-0 space-y-6">
        {/* 商品画像 */}
        <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
          {productItem.images.length > 0 ? (
            <Image
              src={productItem.images[0]}
              alt={getLocalizedText(productItem.title)}
              width={400}
              height={400}
              className="object-cover rounded-lg"
            />
          ) : (
            <span className="text-gray-400">画像なし</span>
          )}
        </div>

        {/* 商品情報 */}
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-600 mb-2">
              {simpleCategories.map((category) => (
                <Badge key={category.categoryId} variant="outline" className="text-xs">
                  {getLocalizedText(category.name)}
                </Badge>
              ))}
            </div>
            <h1 className="text-xl font-bold mb-2">
              {getLocalizedText(productItem.title)}
            </h1>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-semibold">¥{productItem.price.toLocaleString()}</span>
              <span className="text-md font-normal text-gray-500 mb-1">{getLocalizedText(LANGUAGE_LIST.TaxIncluded)}</span>
            </div>
          </div>

          <div className="text-gray-700 text-sm">
            <MarkdownRenderer
              content={getLocalizedText(productItem.description)}
              className="text-gray-700"
            />
          </div>

          {/* 折りたたみ可能セクション */}
          <div className="space-y-2">
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 rounded">
                <span className="text-blue-700 font-bold">配送について</span>
                <ChevronDown className="w-4 h-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-2 text-sm text-gray-600">
                {getLocalizedText(productItem.deliveryText)}
              </CollapsibleContent>
            </Collapsible>
            <Separator />

            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 rounded">
                <span className="text-blue-700 font-bold">支払いについて</span>
                <ChevronDown className="w-4 h-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-2 text-sm text-gray-600">
              {getLocalizedText(productItem.paymentText)}
              </CollapsibleContent>
            </Collapsible>
            <Separator />

            {business && (<>
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 rounded">
                  <span className="text-blue-700 font-bold">{getLocalizedText(LANGUAGE_LIST.BusinessInfo)}</span>
                  <ChevronDown className="w-4 h-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <span className="font-bold">{business.name}</span>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              <Separator />
            </>)}
          </div>
        </div>
      </div>

      {/* 右側: チャット・フォーム */}
      <div className="flex-1 space-y-6">
        {/* チャット機能 */}
        {simpleChat != null && (
          <ChatView
            productId={productId}
            simpleChat={simpleChat}
            setSimpleChat={setSimpleChat}
          />
        )}
      </div>
    </div>
  )
}
