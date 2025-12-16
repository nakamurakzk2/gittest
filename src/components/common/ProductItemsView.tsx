"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import ProductItemView from "@/components/common/ProductItemView"
import { SearchProductItem, SimpleProductCategory, SimpleProductItem } from "@/entity/product/product"
import { SimpleProductRankingItem } from "@/entity/ranking"
import { SimpleTown } from "@/entity/town/town"
import { SimpleBusiness } from "@/entity/town/business"

type ProductItem = SearchProductItem | SimpleProductItem | SimpleProductRankingItem

type Props = {
  productItems: ProductItem[]
  simpleTowns: SimpleTown[]
  simpleBusinesses: SimpleBusiness[]
  simpleCategories: SimpleProductCategory[]
  itemsPerPage: number
  layout?: "wrap" | "horizontal" | "grid"
  emptyMessage?: {
    title: string
    subtitle?: string
  }
}

export default function ProductItemsView({ productItems, simpleTowns, simpleCategories, simpleBusinesses, itemsPerPage, layout = "wrap", emptyMessage = { title: "商品が見つかりませんでした", subtitle: "別の条件で検索してみてください"} }: Props) {
  const [currentPage, setCurrentPage] = useState(1)

  // ページが変更されたときに現在ページをリセット
  const resetPage = () => {
    setCurrentPage(1)
  }

  // 商品データが変更されたときにページをリセット
  useState(() => {
    resetPage()
  })

  const totalPages = Math.ceil(productItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(currentPage * itemsPerPage, productItems.length)
  const currentItems = productItems.slice(startIndex, endIndex)

  if (productItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">
          {emptyMessage.title}
        </div>
        {emptyMessage.subtitle && (
          <div className="text-gray-400 text-sm mt-2">
            {emptyMessage.subtitle}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div className={`w-full ${
        layout === "grid"
          ? "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : layout === "wrap"
            ? "flex flex-wrap justify-center gap-10"
            : "flex flex-nowrap overflow-x-auto scrollbar-hide gap-10"
      }`}>
        {currentItems.map((productItem) => (
          <div key={productItem.productId} className={`${
            layout === "grid"
              ? "w-full"
              : layout === "wrap"
                ? "w-full max-w-[250px]"
                : "w-[250px] flex-shrink-0"
          }`}>
            <ProductItemView
              product={productItem}
            />
          </div>

        ))}
      </div>

      {/* ページネーション */}
      {productItems.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            前へ
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2
              })
              .map((page, index, array) => (
                <div key={page} className="flex items-center">
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span className="px-2 text-gray-400">...</span>
                  )}
                  <Button
                    onClick={() => setCurrentPage(page)}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                </div>
              ))}
          </div>

          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
          >
            次へ
          </Button>
        </div>
      )}
    </>
  )
}
