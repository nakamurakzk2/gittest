"use client"

import { LANGUAGE_LIST } from "@/define/language"
import { useEffect, useState } from "react"
import { ChevronDown, MessageCircle, Smartphone, Handshake } from "lucide-react"

// Components
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import FormAnswerView from "@/app/(page)/account/_components/FormAnswerView"
import ChatView from "@/app/(page)/account/_components/ChatView"
import ImageLinkView from "@/components/common/ImageLinkView"
import ProductDetailCollapsible from "@/components/product/ProductDetailCollapsible"

// Providers
import { useLanguageSession } from "@/providers/language-provider"
import { useDialog } from "@/providers/dialog-provider"

// Entity
import { SimpleOwnProduct, SimpleProductItem, SimpleProductCategory, AdminProductStatus, OwnProductStatus } from "@/entity/product/product"
import { FormMaster } from "@/entity/product/form"
import { SimpleChat } from "@/entity/user/user-chat"
import { SimpleBusiness } from "@/entity/town/business"

// Logic
import * as UserProductPageServerLogic from "@/logic/server/user/user-product-page-server-logic"


interface Props {
  productId: string
  tokenId: number
}

export default function OwnProductView({ productId, tokenId }: Props) {
  const { onFetch } = useDialog()
  const { getLocalizedText } = useLanguageSession()

  const [ownProduct, setOwnProduct] = useState<SimpleOwnProduct | null>(null)
  const [productItem, setProductItem] = useState<SimpleProductItem | null>(null)
  const [formMasters, setFormMasters] = useState<FormMaster[]>([])
  const [business, setBusiness] = useState<SimpleBusiness | null>(null)
  const [simpleCategories, setSimpleCategories] = useState<SimpleProductCategory[]>([])
  const [simpleChat, setSimpleChat] = useState<SimpleChat | null>(null)

  /**
   * 再読み込み
   */
  const reload = async () => {
    await onFetch(async () => {
      const { simpleOwnProduct, formMasters, simpleProductItem, simpleBusiness, simpleCategories, simpleChat } = await UserProductPageServerLogic.fetchProductPage(productId, tokenId)
      setOwnProduct(simpleOwnProduct)
      setFormMasters(formMasters)
      setProductItem(simpleProductItem)
      setBusiness(simpleBusiness)
      setSimpleCategories(simpleCategories)
      setSimpleChat(simpleChat)
    })
  }

  useEffect(() => {
    reload()
  }, [productId, tokenId])


  if (ownProduct == null || productItem == null) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* 左側: 商品情報 */}
      <div className="w-full md:w-[250px] flex-shrink-0 space-y-6">
        {/* 商品画像 */}
        <ImageLinkView
          href={`/product/${ownProduct.productGroupId}?productId=${productItem.productId}`}
          imageSrc={productItem.images.length > 0 ? productItem.images[0] : ""}
          imageAlt={getLocalizedText(ownProduct.title)}
          className="aspect-square bg-gray-200"
        >
          {productItem.images.length === 0 && (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">画像なし</span>
            </div>
          )}
        </ImageLinkView>

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
              {getLocalizedText(ownProduct.title)}
            </h1>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-semibold">¥{productItem.price.toLocaleString()}</span>
              <span className="text-md font-normal text-gray-500 mb-1">{getLocalizedText(LANGUAGE_LIST.TaxIncluded)}</span>
            </div>
          </div>

          <MarkdownRenderer
            content={getLocalizedText(productItem.description)}
            className="text-gray-700 text-sm"
          />

          {/* 属性情報 */}
          <div className="space-y-2">
            {(ownProduct.attributes || []).map((attribute, index) => (
              <div className="flex items-center gap-2 text-sm" key={index}>
                <span>{attribute.trait_type}: {attribute.value}</span>
              </div>
            ))}
          </div>

          {/* 折りたたみ可能セクション */}
          <div className="space-y-4">
            {/*
            <Separator />
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 rounded">
                <span className="text-blue-700 font-bold">注文詳細</span>
                <ChevronDown className="w-4 h-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-2 text-sm text-gray-600">
                注文詳細の内容がここに表示されます。
              </CollapsibleContent>
            </Collapsible>
            */}
            <Separator />
            {business && (
              <ProductDetailCollapsible
                product={productItem}
                business={business}
              />
            )}
          </div>
        </div>
      </div>

      {/* 右側: チャット・フォーム */}
      <div className="flex-1 space-y-6">
        {/* プロセスフロー */}
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              ownProduct.adminStatus === AdminProductStatus.CONSULTATION
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-600"
            }`}>
              <MessageCircle className="w-4 h-4" />
            </div>
            <span className={`text-sm ${
              ownProduct.adminStatus === AdminProductStatus.CONSULTATION
                ? "text-blue-500 font-bold"
                : "text-gray-600"
            }`}>相談</span>
          </div>
          <div className="w-4 h-0.5 bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              ownProduct.adminStatus === AdminProductStatus.IN_USE
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-600"
            }`}>
              <Smartphone className="w-4 h-4" />
            </div>
            <span className={`text-sm ${
              ownProduct.adminStatus === AdminProductStatus.IN_USE
                ? "text-blue-500 font-bold"
                : "text-gray-600"
            }`}>使う</span>
          </div>
          <div className="w-4 h-0.5 bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              ownProduct.adminStatus === AdminProductStatus.COMPLETED
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-600"
            }`}>
              <Handshake className="w-4 h-4" />
            </div>
            <span className={`text-sm ${
              ownProduct.adminStatus === AdminProductStatus.COMPLETED
                ? "text-blue-500 font-bold"
                : "text-gray-600"
            }`}>完了</span>
          </div>
        </div>

        {/* チャット機能 */}
        {simpleChat != null && (
          <ChatView
            productId={productId}
            tokenId={tokenId}
            simpleChat={simpleChat}
            setSimpleChat={setSimpleChat}
            readonly={ownProduct.status === OwnProductStatus.NFT_TRANSFERRED || ownProduct.status === OwnProductStatus.PENDING_PAYMENT}
          />
        )}

        {/* フォーム回答 */}
        {formMasters.length > 0 && (
          <div className="space-y-4">
            {formMasters.map((form) => (
              <FormAnswerView
                key={form.formId}
                productId={productId}
                tokenId={tokenId}
                formMaster={form}
                setSimpleChat={setSimpleChat}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
