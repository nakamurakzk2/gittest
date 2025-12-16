"use client"

// Entity
import { CampaignBanner } from "@/entity/page/top-page"

type Props = {
  campaignBanners: CampaignBanner[]
}

export default function TopCampaignBannerView({ campaignBanners }: Props) {
  if (campaignBanners.length === 0) {
    return null
  }

  return (
    <section className="w-full">
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
    </section>
  )
}
