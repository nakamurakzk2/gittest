"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { LANGUAGE_LIST } from "@/define/language"

// Entity
import { SimpleProductGroup, SimpleProductItem } from "@/entity/product/product"
import { SimpleBusiness } from "@/entity/town/business"

// Provider
import { useLanguageSession } from "@/providers/language-provider"

// Components
import ImageLinkView from "@/components/common/ImageLinkView"
import ProductDetailCollapsible from "@/components/product/ProductDetailCollapsible"
import BlueButton from "@/components/BlueButton"

type Props = {
  simpleProductGroup: SimpleProductGroup
  simpleProductItem: SimpleProductItem
  simpleBusiness: SimpleBusiness
  amount: number
  tokenIds?: number[]
}

export function PaymentProductView({ simpleProductGroup, simpleProductItem, simpleBusiness, amount, tokenIds = [] }: Props) {
  const router = useRouter()
  const { getLocalizedText } = useLanguageSession()

  const unitPrice = simpleProductItem.price
  const total = unitPrice * amount

  const productLink = useMemo(() => {
    if (tokenIds.length > 0) {
      return `/account/products/${simpleProductItem.productId}/${tokenIds[0]}`
    } else {
      return `/product/${simpleProductGroup.productGroupId}?productId=${simpleProductItem.productId}`
    }
  }, [simpleProductGroup.productGroupId, simpleProductItem.productId])


  return (
    <div className="p-6">
      <div className="space-y-4">
        {/* Product Item */}
        <div className="flex items-start space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
          <div className="relative">
            <ImageLinkView
              href={productLink}
              imageSrc={simpleProductItem.images && simpleProductItem.images.length > 0 ? simpleProductItem.images[0] : ""}
              imageAlt={getLocalizedText(simpleProductItem.title)}
              className="w-16 h-16"
            >
              {(!simpleProductItem.images || simpleProductItem.images.length === 0) && (
                <div className="absolute inset-0 bg-gray-200 rounded-lg" />
              )}
            </ImageLinkView>
            <div className="absolute -top-2 -right-2 bg-black text-white text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-lg">
              {amount}
            </div>
          </div>
          <Link
            href={productLink}
            className="flex-1"
          >
            <p className="text-sm text-gray-600">{getLocalizedText(simpleProductItem.title)}</p>
          </Link>
          <div className="text-right">
            <p className="text-sm">¥{unitPrice.toLocaleString()}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">{getLocalizedText(LANGUAGE_LIST.Total)}</span>
            <div className="text-right">
              <span className="text-xs text-gray-500">JPY</span>
              <span className="text-xl font-bold ml-1">¥{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      {/* 詳細情報（折りたたみ） */}
      <div className="mt-12">
        <ProductDetailCollapsible
          product={simpleProductItem}
          business={simpleBusiness}
        />
      </div>
      {tokenIds.length > 0 && (
        <div className="flex items-center space-x-4 mt-4">
          <BlueButton onClick={() => router.push(productLink)}>
            商品詳細
          </BlueButton>
        </div>
      )}

    </div>
  )
}
