"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronDown, ChevronRight, Filter, Search, X } from "lucide-react"

// Components
import { Input } from "@/components/ui/input"
import BlueButton from "@/components/BlueButton"
import ProductItemsView from "@/components/common/ProductItemsView"

// Providers
import { useDialog } from "@/providers/dialog-provider"
import { useLanguageSession } from "@/providers/language-provider"

// Entity
import { SearchProductItem, SimpleProductCategory } from "@/entity/product/product"
import { SimpleTown } from "@/entity/town/town"

// Logic
import * as UserSearchPageServerLogic from "@/logic/server/user/user-search-page-server-logic"
import { SimpleBusiness } from "@/entity/town/business"
import { Button } from "@/components/ui/button"

type Props = {
  initialQuery: string
}

export default function SearchView({ initialQuery }: Props) {
  const { onFetch } = useDialog()
  const { getLocalizedText } = useLanguageSession()

  const [ searchProductItems, setSearchProductItems ] = useState<SearchProductItem[]>([])
  const [ productCategories, setProductCategories ] = useState<SimpleProductCategory[]>([])
  const [ simpleTowns, setSimpleTowns ] = useState<SimpleTown[]>([])
  const [ simpleBusinesses, setSimpleBusinesses ] = useState<SimpleBusiness[]>([])

  const [ query, setQuery ] = useState(initialQuery)
  const [ filteredSearchProductItems, setFilteredSearchProductItems ] = useState<SearchProductItem[]>([])
  const [ searchQuery, setSearchQuery ] = useState(initialQuery)
  const [ isComposing, setIsComposing ] = useState(false)
  const itemsPerPage = 20

  const reload = async () => {
    await onFetch(async () => {
      const { searchProductItems, simpleCategories, simpleTowns, simpleBusinesses } = await UserSearchPageServerLogic.fetchSearchPage()
      setSearchProductItems(searchProductItems)
      setProductCategories(simpleCategories)
      setSimpleTowns(simpleTowns)
      setSimpleBusinesses(simpleBusinesses)
    })
  }


  useEffect(() => {
    if (initialQuery && searchProductItems.length > 0) {
      setQuery(initialQuery)
      onClickSearch(initialQuery)
    }
  }, [initialQuery, searchProductItems])

  /**
   * 検索実行
   */
  const onClickSearch = (query: string) => {
    setSearchQuery(query)

    if (query.trim() === "") {
      setFilteredSearchProductItems(searchProductItems)
    } else {
      const filtered: SearchProductItem[] = []
      for (const searchProductItem of searchProductItems) {
        // 商品情報
        const title = getLocalizedText(searchProductItem.title)
        const description = getLocalizedText(searchProductItem.description)

        // カテゴリー
        const categoryNames = searchProductItem.categoryIds.map(categoryId => {
          const category = productCategories.find(category => category.categoryId === categoryId)
          return category == null ? "" : getLocalizedText(category.name)
        })

        // 自治体
        const town = simpleTowns.find(town => town.townId === searchProductItem.townId)
        const townName = town == null ? "" : getLocalizedText(town.name)

        // 事業者
        const business = simpleBusinesses.find(business => business.businessId === searchProductItem.businessId)
        const businessName = business == null ? "" : business.name

        if (
          title.toLowerCase().includes(query.toLowerCase()) ||
          description.toLowerCase().includes(query.toLowerCase()) ||
          categoryNames.some(name => name.toLowerCase().includes(query.toLowerCase())) ||
          townName.toLowerCase().includes(query.toLowerCase()) ||
          businessName.toLowerCase().includes(query.toLowerCase())
        ) {
          filtered.push(searchProductItem)
        }
      }
      setFilteredSearchProductItems(filtered)
    }
  }

  /**
   * 検索リセット
   */
  const onClickReset = () => {
    setQuery("")
    setSearchQuery("")
    setFilteredSearchProductItems(searchProductItems)
  }

  /**
   * キーボードイベントハンドラー
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isComposing) {
      onClickSearch(query)
    }
  }

  /**
   * IME入力開始
   */
  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  /**
   * IME入力終了
   */
  const handleCompositionEnd = () => {
    setIsComposing(false)
  }


  useEffect(() => {
    reload()
  }, [])

  // 初期クエリがある場合は自動で検索実行
  useEffect(() => {
    if (initialQuery && searchProductItems.length > 0) {
      onClickSearch(initialQuery)
    }
  }, [initialQuery, searchProductItems])


  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-center gap-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder="商品名、カテゴリー、自治体"
            className="w-full"
          />
          {query && (
            <button
              onClick={onClickReset}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <Button className="w-[50px] flex-grow-0 rounded-sm flex items-center justify-center p-0" onClick={() => onClickSearch(query)}>
          <Search />
        </Button>
      </div>

      {/* 検索結果ヘッダー */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">検索結果</span>
          {searchQuery ? (
            <span className="text-gray-800 font-semibold text-lg">「{searchQuery}」</span>
          ) : (
            <span className="text-gray-800 font-semibold text-lg">全件表示中</span>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {filteredSearchProductItems.length > 0 ? (
            <>
              {searchProductItems.length}件中{filteredSearchProductItems.length}件ヒット
              {filteredSearchProductItems.length > itemsPerPage && (
                <span className="ml-2">
                  （1〜{Math.min(itemsPerPage, filteredSearchProductItems.length)}件目を表示）
                </span>
              )}
            </>
          ) : (
            <span>{searchProductItems.length}件中0件ヒット</span>
          )}
        </div>
      </div>

      {/* 商品グリッド */}
      <ProductItemsView
        productItems={filteredSearchProductItems}
        simpleTowns={simpleTowns}
        simpleBusinesses={simpleBusinesses}
        simpleCategories={productCategories}
        itemsPerPage={itemsPerPage}
        emptyMessage={{
          title: "検索結果が見つかりませんでした",
          subtitle: "別のキーワードで検索してみてください"
        }}
      />
    </div>
  )
}

