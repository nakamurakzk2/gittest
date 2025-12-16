"use client"

// Next.js
import Link from "next/link"

// Providers
import { useLanguageSession } from "@/providers/language-provider"

// Entity
import { SimpleProductCategory } from "@/entity/product/product"

// Components
import { ChevronRight } from "lucide-react"

type Props = {
  simpleCategories: SimpleProductCategory[]
}

export default function TopCategoryView({ simpleCategories }: Props) {
  const { getLocalizedText } = useLanguageSession()

  return (
    <section className="space-y-4 px-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {simpleCategories.map(category => (
          <Link
            key={category.categoryId}
            href={`/ranking?categoryId=${category.categoryId}`}
            className="px-0 py-2 border-b border-b-white hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer text-white"
          >
            <div className="flex items-center justify-between">
              {getLocalizedText(category.name)}
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
