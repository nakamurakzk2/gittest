"use client"

import { SimpleProductRankingItem } from "@/entity/ranking"
import Link from "next/link"
import { useLanguageSession } from "@/providers/language-provider"
import { SearchProductItem, SimpleProductItem } from "@/entity/product/product"
import { useMemo } from "react"
import ImageLinkView from "./ImageLinkView"
import * as CommonLogic from "@/logic/common-logic"

interface ProductItemViewProps {
  product: SimpleProductRankingItem | SimpleProductItem | SearchProductItem
}

export default function ProductItemView({ product }: ProductItemViewProps) {
  const { getLocalizedText } = useLanguageSession()

  const image  = useMemo(() => {
    if ("image" in product) {
      return product.image
    }
    return product.images[0]
  }, [product])

  return (
    <div className="space-y-2">
      {/* 商品画像 */}
      <ImageLinkView
        href={`/product/${product.productGroupId}?productId=${product.productId}`}
        imageSrc={image || ""}
        imageAlt={getLocalizedText(product.title)}
        className="mb-1"
      >
        {!image && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        )}
      </ImageLinkView>

      {/* 商品情報 */}
      <Link href={`/product/${product.productGroupId}?productId=${product.productId}`}>
        <div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm text-gray-900 mb-1 truncate">
              {getLocalizedText(product.title)}
            </h3>
          </div>
          <div className="text-sm text-gray-500 line-clamp-2 h-[40px]">
              {CommonLogic.markdownToPlainText(getLocalizedText(product.description))}
          </div>
          <div className="flex items-end justify-end">
            <span className="text-sm font-bold text-gray-900">
              ¥{product.price.toLocaleString()}
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}
