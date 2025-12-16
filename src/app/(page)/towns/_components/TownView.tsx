"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

// Providers
import { useLanguageSession } from "@/providers/language-provider"

// Entity
import { SimpleTown } from "@/entity/town/town"
import { SimpleProductCategory, SimpleProductItem } from "@/entity/product/product"

// Components
import ProductItemsView from "@/components/common/ProductItemsView"
import { SimpleBusiness } from "@/entity/town/business"

interface Props {
  simpleTown: SimpleTown
  simpleProductItems: SimpleProductItem[]
  simpleBusinesses: SimpleBusiness[]
  simpleCategories: SimpleProductCategory[]
}

export default function TownView({ simpleTown, simpleProductItems, simpleBusinesses, simpleCategories }: Props) {
  const router = useRouter()
  const { getLocalizedText } = useLanguageSession()

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* ヘッダ部分 */}
      <div className="mb-16 space-y-4">
        <div className="flex items-center justify-start gap-6">
          {/* 自治体アイコン */}
          <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center">
            {simpleTown.image ? (
              <Image
                src={simpleTown.image}
                alt={getLocalizedText(simpleTown.name)}
                width={48}
                height={48}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-300 rounded-full" />
            )}
          </div>
          {/* 名前 */}
          <h1 className="text-3xl font-bold text-black">
            {getLocalizedText(simpleTown.name)}
          </h1>
        </div>
      </div>

      {/* 出品一覧 */}
      <div>
        <h2 className="text-2xl font-bold text-black mb-6">
          出品一覧
        </h2>

        {/* 商品グリッド */}
        <ProductItemsView
          productItems={simpleProductItems}
          simpleTowns={[simpleTown]}
          simpleBusinesses={simpleBusinesses}
          simpleCategories={simpleCategories}
          itemsPerPage={12}
          layout="grid"
          emptyMessage={{
            title: "出品商品がありません",
            subtitle: "この自治体ではまだ商品が登録されていません"
          }}
        />
      </div>
      <div className="flex flex-col lg:flex-row mt-14 lg:space-x-10">
        {/* 地図 */}
        <div className="w-full lg:w-[400px]">
          <Image
            src={simpleTown.mapImage}
            alt={getLocalizedText(simpleTown.name)}
            width={400}
            height={400}
            className="w-full h-full object-contain"
          />
        </div>
        {/* 説明文 */}
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold text-black">
            {getLocalizedText(simpleTown.name)}
          </h1>
          <p className="text-base text-black leading-relaxed">
            {getLocalizedText(simpleTown.description)}
          </p>
        </div>
      </div>
    </div>
  )
}