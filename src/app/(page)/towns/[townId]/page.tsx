import Link from "next/link"
import Image from "next/image"

// Components
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import TownView from "@/app/(page)/towns/_components/TownView"

// Logic
import * as PublicTownServerLogic from "@/logic/server/public/public-town-server-logic"

// Constants
import { getBackgroundClass } from "@/define/colors"


export default async function TownPage({ params }: { params: { townId: string } }) {
  const { simpleTown, simpleProductItems, simpleBusinesses, simpleCategories } = await PublicTownServerLogic.fetchTownPage(params.townId)

  return (
    <div className={`w-full ${getBackgroundClass('PRIMARY')} min-h-screen`}>
      <div className="w-full" style={{ aspectRatio: '5/1' }}>
        <Image
          src={simpleTown.headerImage}
          alt={simpleTown.name.ja}
          width={400} height={80}
          className="w-full h-full object-cover"
        />
      </div>
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
              <BreadcrumbLink asChild>
                <Link href="/towns">自治体一覧</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{simpleTown.name.ja}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <TownView
          simpleTown={simpleTown}
          simpleProductItems={simpleProductItems}
          simpleBusinesses={simpleBusinesses}
          simpleCategories={simpleCategories}
        />
      </div>
    </div>
  )
}
