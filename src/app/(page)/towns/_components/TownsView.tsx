"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ChevronDown, ChevronRight, Filter, X } from "lucide-react"

// Entity
import { SimpleTown, TownPageItem } from "@/entity/town/town"
import { SimpleProductCategory } from "@/entity/product/product"

// Providers
import { useLanguageSession } from "@/providers/language-provider"

// Define
import { LANGUAGE_LIST } from "@/define/language"

// Components
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import ProductItemsView from "@/components/common/ProductItemsView"

// Logic
import { regions, getPrefCodeFromName } from "@/logic/address-logic"

interface Props {
  townPageItems: TownPageItem[]
  simpleCategories: SimpleProductCategory[]
}

export default function TownsView({ townPageItems, simpleCategories }: Props) {
  const router = useRouter()
  const { getLocalizedText } = useLanguageSession()

  // デフォルトで全都道府県を選択状態にする
  const allPrefectures = regions.flatMap(region => region.prefectures)
  const [selectedPrefectures, setSelectedPrefectures] = useState<string[]>(allPrefectures)
  const [expandedRegions, setExpandedRegions] = useState<string[]>(regions.map(region => region.name))
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // フィルタリングされた自治体を取得
  const filteredTowns = selectedPrefectures.length === 0
    ? townPageItems
    : townPageItems.filter(townPageItems => {
        // 選択された都道府県のprefCodeを取得
        const selectedPrefCodes = selectedPrefectures
          .map(prefName => getPrefCodeFromName(prefName))
          .filter(code => code !== null) as number[]

        // 自治体のprefCodeが選択された都道府県に含まれているかチェック
        return selectedPrefCodes.includes(townPageItems.simpleTown.prefCode)
      })

  const onClickPrefecture = (prefecture: string) => {
    setSelectedPrefectures(prev =>
      prev.includes(prefecture)
        ? prev.filter(p => p !== prefecture)
        : [...prev, prefecture]
    )
  }

  const onClickRegion = (regionName: string) => {
    setExpandedRegions(prev =>
      prev.includes(regionName)
        ? prev.filter(r => r !== regionName)
        : [...prev, regionName]
    )
  }

  const onClickSelectAll = () => {
    setSelectedPrefectures(allPrefectures)
  }

  const onClickClearAll = () => {
    setSelectedPrefectures([])
  }

  const onClickSelectRegion = (regionName: string) => {
    const region = regions.find(r => r.name === regionName)
    if (region) {
      setSelectedPrefectures(prev => {
        const regionPrefectures = region.prefectures
        const hasAllSelected = regionPrefectures.every(pref => prev.includes(pref))

        if (hasAllSelected) {
          // すべて選択済みの場合はすべて解除
          return prev.filter(pref => !regionPrefectures.includes(pref))
        } else {
          // 一部または未選択の場合はすべて選択
          const newSelected = [...prev]
          regionPrefectures.forEach(pref => {
            if (!newSelected.includes(pref)) {
              newSelected.push(pref)
            }
          })
          return newSelected
        }
      })
    }
  }

  return (
    <div className="w-full">
      {/* モバイル用ヘッダー */}
      <div className="flex items-center justify-between mb-6 lg:hidden">
        <h1 className="text-2xl font-bold text-black">{getLocalizedText(LANGUAGE_LIST.TownList)}</h1>
        {/* モバイル用フィルターボタン */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          {getLocalizedText(LANGUAGE_LIST.Filter)}
          {selectedPrefectures.length < allPrefectures.length && (
            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
              {selectedPrefectures.length}
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
        {/* 左側：フィルタリング用の都道府県選択 */}
        <div className={`w-full lg:w-48 flex-shrink-0 ${isMobileMenuOpen ? 'fixed inset-y-0 left-0 z-50 bg-white overflow-y-auto lg:relative lg:bg-transparent lg:z-auto lg:overflow-visible' : 'hidden lg:block'}`}>
          <div className="sticky top-4 md:top-6 px-4 py-6 lg:px-0 lg:py-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-black">{getLocalizedText(LANGUAGE_LIST.FilterByRegion)}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* 一括操作ボタン */}
            <div className="flex gap-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onClickSelectAll}
                className="text-xs"
              >
                {getLocalizedText(LANGUAGE_LIST.SelectAll)}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClickClearAll}
                className="text-xs"
              >
                {getLocalizedText(LANGUAGE_LIST.ClearAll)}
              </Button>
            </div>

            <div className="space-y-4">
              {regions.map((region) => {
                const isExpanded = expandedRegions.includes(region.name)
                const regionPrefectures = region.prefectures
                const selectedInRegion = regionPrefectures.filter(pref => selectedPrefectures.includes(pref))
                const isAllSelected = selectedInRegion.length === regionPrefectures.length
                const isPartiallySelected = selectedInRegion.length > 0 && selectedInRegion.length < regionPrefectures.length

                return (
                  <div key={region.name} className="border rounded-lg">
                    {/* 地域ヘッダー */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-t-lg">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={isAllSelected}
                          ref={(el) => {
                            if (el && el instanceof HTMLInputElement) {
                              el.indeterminate = isPartiallySelected
                            }
                          }}
                          onClick={() => onClickSelectRegion(region.name)}
                        />
                        <button
                          onClick={() => onClickRegion(region.name)}
                          className="flex items-center space-x-2 text-left"
                        >
                          <h3 className="text-lg font-medium text-gray-800">{region.name}</h3>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <span className="text-sm text-gray-500">
                        {selectedInRegion.length}/{regionPrefectures.length}
                      </span>
                    </div>

                    {/* 都道府県リスト */}
                    {isExpanded && (
                      <div className="p-3 space-y-2 bg-white rounded-b-lg">
                        {regionPrefectures.map((prefecture) => (
                          <div key={prefecture} className="flex items-center space-x-2 ml-4">
                            <Checkbox
                              id={prefecture}
                              checked={selectedPrefectures.includes(prefecture)}
                              onClick={() => onClickPrefecture(prefecture)}
                            />
                            <label
                              htmlFor={prefecture}
                              className="text-sm text-gray-700 cursor-pointer"
                            >
                              {prefecture}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 右側：自治体一覧 */}
        <div className="flex-1">
          {/* PC用タイトル */}
          <h1 className="hidden lg:block text-3xl font-bold text-black mb-8">{getLocalizedText(LANGUAGE_LIST.TownList)}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {filteredTowns.map((item, index) => (
              <div key={index} className="w-full bg-white p-4 space-y-4 ">
                <div className="text-lg font-semibold text-black">
                  {getLocalizedText(item.simpleTown.name)}
                </div>
                <ProductItemsView
                  productItems={item.simpleProductItems}
                  simpleTowns={[item.simpleTown]}
                  simpleBusinesses={item.simpleBusinesses}
                  simpleCategories={simpleCategories}
                  itemsPerPage={3}
                  layout="grid"
                  emptyMessage={{
                    title: getLocalizedText(LANGUAGE_LIST.NoTownProducts),
                    subtitle: getLocalizedText(LANGUAGE_LIST.TownNotRegistered)
                  }}
                />
                <div className="text-right">
                  <Link href={`/towns/${item.simpleTown.townId}`}>
                    {getLocalizedText(LANGUAGE_LIST.SeeMore)}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {filteredTowns.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">{getLocalizedText(LANGUAGE_LIST.NoProductsFound)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
