"use client"

// Providers
import { useLanguageSession } from "@/providers/language-provider"

// Entity
import { SimpleTown } from "@/entity/town/town"

// Components
import ImageLinkView from "@/components/common/ImageLinkView"

type Props = {
  simpleTowns: SimpleTown[]
}

export default function TopTownsView({ simpleTowns }: Props) {
  const { getLocalizedText } = useLanguageSession()

  if (simpleTowns.length === 0) {
    return null
  }

  return (
    <section className="space-y-4">
      <div className="w-full overflow-x-auto scrollbar-hide px-2">
        <div className="flex gap-4 items-center justify-center pb-4 min-w-max">
          {simpleTowns.map((town) => (
            <ImageLinkView
              key={town.townId}
              href={`/towns/${town.townId}`}
              imageSrc={town.bannerImage}
              imageAlt={getLocalizedText(town.name)}
              className="w-64 flex-shrink-0 p-2 bg-white rounded-lg shadow-sm"
              aspectRatio="custom"
              customAspectRatio="aspect-[4/1]"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
