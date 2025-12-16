import Link from "next/link"

// Components
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import SearchView from "@/app/(page)/search/_components/SearchView"

// Constants
import { getBackgroundClass } from "@/define/colors"

type SearchParams = {
  query?: string
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const query = searchParams.query

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
              <BreadcrumbPage>検索</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <SearchView
          initialQuery={query || ''}
        />
      </div>
    </div>
  )
}
