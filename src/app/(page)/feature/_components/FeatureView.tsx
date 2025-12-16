"use client"

// Providers
import { useLanguageSession } from "@/providers/language-provider"

// Icons
import { CampaignBanner } from "@/entity/page/top-page"

interface Props {
  campaignBanners: CampaignBanner[]
}

export default function FeatureView({ campaignBanners }: Props) {

  return (
    <div className="w-full">
      {/* PC用タイトル */}
      <h1 className="text-3xl font-bold text-black text-center mb-8">特集</h1>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {campaignBanners.map((banner) => (
          <a
            key={banner.campaignId}
            href={banner.link}
            className="block group"
          >
            <div className="relative overflow-hidden aspect-[2/1]">
              <img
                src={banner.image}
                alt="Campaign Banner"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
            </div>
          </a>
        ))}
      </div>

    </div>
  )
}
