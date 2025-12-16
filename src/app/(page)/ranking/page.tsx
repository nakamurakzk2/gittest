import Link from "next/link"

// Components
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import RankingView from "@/app/(page)/ranking/_components/RankingView"

// Logic
import * as PublicRankingServerLogic from "@/logic/server/public/public-ranking-server-logic"

// Constants
import { getBackgroundClass } from "@/define/colors"

type Props = {
  searchParams: { categoryId?: string }
}

export default async function RankingPage({ searchParams }: Props) {
  const { dailyRankingItems, monthlyRankingItems, allTimeRankingItems, simpleTowns, simpleBusinesses, simpleCategories } = await PublicRankingServerLogic.fetchRankingPage()

  return (
    <div className={`w-full ${getBackgroundClass('PRIMARY')} min-h-screen`}>
      <div className="px-6 py-6 max-w-6xl mx-auto">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">ホーム</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>ランキング</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <RankingView
          dailyRankingItems={dailyRankingItems}
          monthlyRankingItems={monthlyRankingItems}
          allTimeRankingItems={allTimeRankingItems}
          simpleTowns={simpleTowns}
          simpleBusinesses={simpleBusinesses}
          simpleCategories={simpleCategories}
          initialCategoryId={searchParams.categoryId}
        />
      </div>
    </div>
  )
}
