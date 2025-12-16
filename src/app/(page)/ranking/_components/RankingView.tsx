"use client"

import { useMemo, useState } from "react"
import { LANGUAGE_LIST } from "@/define/language"

// Components
import ProductItemsView from "@/components/common/ProductItemsView"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

// Providers
import { useLanguageSession } from "@/providers/language-provider"

// Entity
import { SimpleProductRankingItem } from "@/entity/ranking"
import { SimpleTown } from "@/entity/town/town"
import { SimpleBusiness } from "@/entity/town/business"
import { SimpleProductCategory } from "@/entity/product/product"

// Icons
import { Filter, X } from "lucide-react"

type TimeFilter = "all" | "monthly" | "daily"
type PriceFilter = "10000-30000" | "30000-50000" | "50000-100000" | "100000-"

interface RankingViewProps {
  dailyRankingItems: SimpleProductRankingItem[]
  monthlyRankingItems: SimpleProductRankingItem[]
  allTimeRankingItems: SimpleProductRankingItem[]
  simpleTowns: SimpleTown[]
  simpleBusinesses: SimpleBusiness[]
  simpleCategories: SimpleProductCategory[]
  initialCategoryId?: string
}

export default function RankingView({ dailyRankingItems, monthlyRankingItems, allTimeRankingItems, simpleTowns, simpleBusinesses, simpleCategories, initialCategoryId }: RankingViewProps) {
  const { getLocalizedText } = useLanguageSession()
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>("all")

  // フィルタリング用のstate
  const [selectedTowns, setSelectedTowns] = useState<string[]>([])
  const [selectedPrice, setSelectedPrice] = useState<PriceFilter | "">("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategoryId ? [initialCategoryId] : [])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const timeFilters = [
    { key: "all" as TimeFilter, label: LANGUAGE_LIST.AllTime },
    { key: "monthly" as TimeFilter, label: LANGUAGE_LIST.Monthly },
    { key: "daily" as TimeFilter, label: LANGUAGE_LIST.Daily }
  ]

  const priceFilters = [
    { key: "10000-30000" as PriceFilter, label: LANGUAGE_LIST.PriceRange10000_30000 },
    { key: "30000-50000" as PriceFilter, label: LANGUAGE_LIST.PriceRange30000_50000 },
    { key: "50000-100000" as PriceFilter, label: LANGUAGE_LIST.PriceRange50000_100000 },
    { key: "100000-" as PriceFilter, label: LANGUAGE_LIST.PriceRange100000Plus }
  ]

  // フィルタリングロジック
  const filteredRankingItems = useMemo(() => {
    let items: SimpleProductRankingItem[] = []

    // 時間フィルターで基本データを取得
    switch (selectedFilter) {
      case "all":
        items = allTimeRankingItems
        break
      case "monthly":
        items = monthlyRankingItems
        break
      case "daily":
        items = dailyRankingItems
        break
      default:
        items = []
    }

    // 自治体フィルター
    if (selectedTowns.length > 0) {
      items = items.filter(item => selectedTowns.includes(item.townId))
    }

    // 価格フィルター
    if (selectedPrice) {
      items = items.filter(item => {
        const price = item.price
        switch (selectedPrice) {
          case "10000-30000":
            return price >= 10000 && price < 30000
          case "30000-50000":
            return price >= 30000 && price < 50000
          case "50000-100000":
            return price >= 50000 && price < 100000
          case "100000-":
            return price >= 100000
          default:
            return true
        }
      })
    }

    // カテゴリフィルター
    if (selectedCategories.length > 0) {
      items = items.filter(item =>
        item.categories.some(category => selectedCategories.includes(category.categoryId))
      )
    }

    return items
  }, [selectedFilter, allTimeRankingItems, monthlyRankingItems, dailyRankingItems, selectedTowns, selectedPrice, selectedCategories])

  // フィルター操作関数
  const onClickTown = (townId: string) => {
    setSelectedTowns(prev =>
      prev.includes(townId)
        ? prev.filter(id => id !== townId)
        : [...prev, townId]
    )
  }

  const onClickCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const onClickClearAllFilters = () => {
    setSelectedTowns([])
    setSelectedPrice("")
    setSelectedCategories([])
  }

  // フィルターが適用されているかどうかを判定
  const hasActiveFilters = selectedTowns.length > 0 || selectedPrice || selectedCategories.length > 0

  return (
    <div className="w-full">
      {/* モバイル用ヘッダー */}
      <div className="flex items-center justify-between mb-6 lg:hidden">
        <h1 className="text-2xl font-bold text-black">{getLocalizedText(LANGUAGE_LIST.Ranking)}</h1>
        {/* モバイル用フィルターボタン */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          {getLocalizedText(LANGUAGE_LIST.Filter)}
          {(selectedTowns.length > 0 || selectedPrice || selectedCategories.length > 0) && (
            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
              {selectedTowns.length + (selectedPrice ? 1 : 0) + selectedCategories.length}
            </span>
          )}
        </Button>
      </div>

      {/* モバイル用オーバーレイ */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        {/* 左側：フィルタリング用のサイドバー */}
        <div className={`w-full lg:w-64 flex-shrink-0 ${isMobileMenuOpen ? 'fixed inset-y-0 left-0 z-50 bg-white overflow-y-auto lg:relative lg:bg-transparent lg:z-auto lg:overflow-visible' : 'hidden lg:block'}`}>
          <div className="sticky top-4 md:top-6 px-4 py-6 lg:px-0 lg:py-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-black">{getLocalizedText(LANGUAGE_LIST.SearchFilters)}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* クリアボタン */}
            <div className="mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onClickClearAllFilters}
                className="w-full text-xs"
              >
                {getLocalizedText(LANGUAGE_LIST.ClearAll)}
              </Button>
            </div>

            <div className="space-y-6">
              {/* 自治体フィルター */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">{getLocalizedText(LANGUAGE_LIST.Municipality)}</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {simpleTowns.map((town) => (
                    <div key={town.townId} className="flex items-center space-x-2">
                      <Checkbox
                        id={`town-${town.townId}`}
                        checked={selectedTowns.includes(town.townId)}
                        onClick={() => onClickTown(town.townId)}
                      />
                      <Label
                        htmlFor={`town-${town.townId}`}
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        {getLocalizedText(town.name)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 価格フィルター */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">{getLocalizedText(LANGUAGE_LIST.Price)}</h3>
                <div className="space-y-2">
                  {priceFilters.map((filter) => (
                    <div key={filter.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`price-${filter.key}`}
                        checked={selectedPrice === filter.key}
                        onClick={() => {
                          if (selectedPrice === filter.key) {
                            // 同じ価格帯をクリックした場合は選択を解除
                            setSelectedPrice("")
                          } else {
                            // 異なる価格帯をクリックした場合は選択
                            setSelectedPrice(filter.key)
                          }
                        }}
                      />
                      <Label
                        htmlFor={`price-${filter.key}`}
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        {getLocalizedText(filter.label)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* カテゴリフィルター */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">{getLocalizedText(LANGUAGE_LIST.ProductCategory)}</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {simpleCategories.map((category) => (
                    <div key={category.categoryId} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.categoryId}`}
                        checked={selectedCategories.includes(category.categoryId)}
                        onClick={() => onClickCategory(category.categoryId)}
                      />
                      <Label
                        htmlFor={`category-${category.categoryId}`}
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        {getLocalizedText(category.name)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右側：ランキング表示 */}
        <div className="flex-1">
          {/* PC用タイトル */}
          <h1 className="hidden lg:block text-3xl font-bold text-black text-center mb-8">{getLocalizedText(LANGUAGE_LIST.Ranking)}</h1>

          {/* ヘッダーセクション */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-8">
              {timeFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setSelectedFilter(filter.key)}
                  className={`text-lg font-medium transition-colors ${
                    selectedFilter === filter.key
                      ? "text-gray-900 font-semibold"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {getLocalizedText(filter.label)}
                </button>
              ))}
            </div>
          </div>

          {/* 商品グリッド */}
          <ProductItemsView
            productItems={filteredRankingItems}
            simpleTowns={simpleTowns}
            simpleBusinesses={simpleBusinesses}
            simpleCategories={simpleCategories}
            itemsPerPage={12}
            layout="grid"
            emptyMessage={{
              title: hasActiveFilters ? getLocalizedText(LANGUAGE_LIST.NoMatchingProducts) : getLocalizedText(LANGUAGE_LIST.NoRankingData),
              subtitle: hasActiveFilters ? getLocalizedText(LANGUAGE_LIST.ChangeSearchFilters) : getLocalizedText(LANGUAGE_LIST.AggregatingSalesData)
            }}
          />
        </div>
      </div>
    </div>
  )
}
