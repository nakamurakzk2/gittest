"use client"

// Entity
import { SimpleProductRankingItem } from "@/entity/ranking"
import { SimpleTown } from "@/entity/town/town"
import { SimpleBusiness } from "@/entity/town/business"
import { SimpleProductCategory } from "@/entity/product/product"
import ProductItemsView from "@/components/common/ProductItemsView"

// Components
import Link from "next/link"
import { ChevronRight } from "lucide-react"

type Props = {
  simpleRankingItems: SimpleProductRankingItem[]
  simpleTowns: SimpleTown[]
  simpleBusinesses: SimpleBusiness[]
  simpleCategories: SimpleProductCategory[]
}

export default function TopRankingView({ simpleRankingItems, simpleTowns, simpleBusinesses, simpleCategories }: Props) {

  if (simpleRankingItems.length === 0) {
    return null
  }

  return (
    <section className="space-y-4">
      <div className="px-2 flex items-center justify-between">
        <h2 className="text-2xl font-bold">ランキング</h2>
        <Link
          href="/ranking"
          className="flex items-center gap-2 text-sm text-black hover:opacity-70 transition-opacity"
        >
          <span>View More</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 商品グリッド */}
      <div className="overflow-x-auto lg:overflow-x-visible px-2">
        <div className="lg:hidden">
          <ProductItemsView
            productItems={simpleRankingItems}
            simpleTowns={simpleTowns}
            simpleBusinesses={simpleBusinesses}
            simpleCategories={simpleCategories}
            itemsPerPage={10}
            layout="horizontal"
          />
        </div>
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6">
          {simpleRankingItems.slice(0, 8).map((productItem) => (
            <div key={productItem.productId} className="w-full">
              <ProductItemsView
                productItems={[productItem]}
                simpleTowns={simpleTowns}
                simpleBusinesses={simpleBusinesses}
                simpleCategories={simpleCategories}
                itemsPerPage={1}
                layout="wrap"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
