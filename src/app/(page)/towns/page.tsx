import Link from "next/link"

// Components
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import TownsView from "@/app/(page)/towns/_components/TownsView"

// Logic
import * as PublicTownServerLogic from "@/logic/server/public/public-town-server-logic"

// Constants
import { getBackgroundClass } from "@/define/colors"


export default async function TownsPage() {
  const { townPageItems, simpleCategories } = await PublicTownServerLogic.fetchTownsPage()

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
                <BreadcrumbPage>自治体一覧</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        <TownsView
          townPageItems={townPageItems}
          simpleCategories={simpleCategories}
        />
      </div>
    </div>
  )
}
