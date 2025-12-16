// Components
import TopView from "@/app/(page)/(home)/_components/TopView"

// Logic
import * as PublicTopServerLogic from "@/logic/server/public/public-top-server-logic"

// Constants
import { getBackgroundClass } from "@/define/colors"


export default async function HomePage() {
  const { simpleCategories, topBanners, topPickups, campaignBanners, simpleTowns, simpleBusinesses, dailyRankingItems } = await PublicTopServerLogic.fetchTopPage()

  return (
    <div className={`w-full ${getBackgroundClass('PRIMARY')} min-h-screen`}>
      <div className="mx-auto max-w-6xl">
        <TopView
          simpleCategories={simpleCategories}
          topBanners={topBanners}
          topPickups={topPickups}
          campaignBanners={campaignBanners}
          simpleTowns={simpleTowns}
          simpleBusinesses={simpleBusinesses}
          simpleRankingItems={dailyRankingItems}
        />
      </div>
    </div>
  )
}
