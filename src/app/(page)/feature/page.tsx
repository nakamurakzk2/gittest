import Link from "next/link"

// Components
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import FeatureView from "@/app/(page)/feature/_components/FeatureView"

// Logic
import * as PublicFeatureServerLogic from "@/logic/server/public/public-feature-server-logic"

// Constants
import { getBackgroundClass } from "@/define/colors"


export default async function FeaturePage() {
  const { campaignBanners } = await PublicFeatureServerLogic.fetchFeaturePage()

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
              <BreadcrumbPage>特集</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <FeatureView
          campaignBanners={campaignBanners}
        />
      </div>
    </div>
  )
}
