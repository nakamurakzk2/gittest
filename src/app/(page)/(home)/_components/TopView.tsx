"use client"

// Providers
import { useLanguageSession } from "@/providers/language-provider"

// Entity
import { SimpleProductCategory } from "@/entity/product/product"
import { SimpleTown } from "@/entity/town/town"
import { TopBanner, TopPickup, CampaignBanner } from "@/entity/page/top-page"

// Components
import TopBannerView from "./TopBannerView"
import TopPickupView from "./TopPickupView"
import TopTownsView from "./TopTownsView"
import TopCategoryView from "./TopCategoryView"
import TopCampaignBannerView from "./TopCampaignBannerView"
import { SimpleProductRankingItem } from "@/entity/ranking"
import TopRankingView from "./TopRankingView"
import { SimpleBusiness } from "@/entity/town/business"

type Props = {
  simpleCategories: SimpleProductCategory[]
  topBanners: TopBanner[]
  topPickups: TopPickup[]
  campaignBanners: CampaignBanner[]
  simpleTowns: SimpleTown[]
  simpleBusinesses: SimpleBusiness[]
  simpleRankingItems: SimpleProductRankingItem[]
}


export default function TopView({ simpleCategories, topBanners, topPickups, campaignBanners, simpleTowns, simpleBusinesses, simpleRankingItems }: Props) {

  return (
    <div className="space-y-8">
      {/* TOPバナー - カルーセル */}
      <TopBannerView topBanners={topBanners} />

      {/* 自治体 */}
      <TopTownsView simpleTowns={simpleTowns} />

      {/* PickUp */}
      <TopPickupView topPickups={topPickups} />

      {/* ランキング */}
      <TopRankingView simpleRankingItems={simpleRankingItems} simpleTowns={simpleTowns} simpleBusinesses={simpleBusinesses} simpleCategories={simpleCategories} />

      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#2B2B2B] space-y-4">
        {/* 特集バナー */}
        <TopCampaignBannerView campaignBanners={campaignBanners} />
        <div className="max-w-6xl mx-auto">
          {/* カテゴリ */}
          <TopCategoryView simpleCategories={simpleCategories} />
        </div>
      </div>
    </div>
  )
}