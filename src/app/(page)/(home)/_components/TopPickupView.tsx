"use client"

import { useEffect, useRef } from "react"

// Providers
import { useLanguageSession } from "@/providers/language-provider"

// Entity
import { TopPickup } from "@/entity/page/top-page"

// Components
import HoverImageView from "@/components/common/HoverImageView"

// Define
import { LANGUAGE_LIST } from "@/define/language"

type Props = {
  topPickups: TopPickup[]
}

export default function TopPickupView({ topPickups }: Props) {
  const { getLocalizedText } = useLanguageSession()
  const sectionRef = useRef<HTMLDivElement>(null)

  const isActive = (startTime: number | null, endTime: number | null) => {
    const now = Date.now()
    if (startTime && startTime > now) return false
    if (endTime && endTime < now) return false
    return true
  }

  const activeTopPickups = topPickups.filter(pickup => isActive(pickup.startTime, pickup.endTime))

  useEffect(() => {
    const revealNodes = document.querySelectorAll('[data-reveal]')
    if (revealNodes.length) {
      const reveal = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      }
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(reveal, {
          threshold: 0.1,
          rootMargin: '0px 0px -10% 0px'
        })
        revealNodes.forEach((node) => observer.observe(node))
      } else {
        revealNodes.forEach((node) => node.classList.add('is-visible'))
      }
    }
  }, [activeTopPickups])

  if (activeTopPickups.length === 0) {
    return null
  }

  return (
    <div ref={sectionRef} className="space-y-4 reveal" data-reveal>
      <div className="px-2">
        <h2 className="text-2xl font-bold">{getLocalizedText(LANGUAGE_LIST.Featured)}</h2>
      </div>

      {/* モバイル表示: 横スクロール */}
      <div className="lg:hidden px-2">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 flex-nowrap">
            {activeTopPickups.map((pickup) => (
              <div key={pickup.pickupId} className="w-64 flex-shrink-0 h-64">
                <HoverImageView
                  href={pickup.link}
                  imageSrc={pickup.image}
                  imageAlt="PickUp"
                  hoverText={pickup.text}
                  fontSize={18}
                  className="w-full h-full"
                >
                  {pickup.type === 'sold-out' && (
                    <>
                      <div className="absolute inset-0 bg-black bg-opacity-70" />
                      <div className="absolute top-2 left-2">
                        <span className="bg-black text-white px-2 py-1 rounded text-xs font-semibold">
                          {getLocalizedText(LANGUAGE_LIST.SoldOut)}
                        </span>
                      </div>
                    </>
                  )}
                </HoverImageView>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PC表示: 左側1つ、右側4つ */}
      <div className="hidden lg:grid grid-cols-2 gap-6">
        {/* 左側のPickUp */}
        {activeTopPickups[0] && (
          <div>
            <HoverImageView
              href={activeTopPickups[0].link}
              imageSrc={activeTopPickups[0].image}
              imageAlt="PickUp"
              hoverText={activeTopPickups[0].text}
              fontSize={48}
            >
              {activeTopPickups[0].type === 'sold-out' && (
                <>
                  <div className="absolute inset-0 bg-black bg-opacity-70" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-black text-white px-3 py-1 rounded text-sm font-semibold">
                      {getLocalizedText({ ja: "売り切れ", en: "Sold Out", zh: "售罄" })}
                    </span>
                  </div>
                </>
              )}
            </HoverImageView>
          </div>
        )}

        {/* 右側のPickUp（最大4つ） */}
        <div>
          <div className="grid grid-cols-2 gap-4">
            {activeTopPickups.slice(1, 5).map((pickup) => (
              <HoverImageView
                key={pickup.pickupId}
                href={pickup.link}
                imageSrc={pickup.image}
                imageAlt="PickUp"
                hoverText={pickup.text}
                fontSize={24}
              >
                {pickup.type === 'sold-out' && (
                  <>
                    <div className="absolute inset-0 bg-black bg-opacity-70" />
                    <div className="absolute top-2 left-2">
                      <span className="bg-black text-white px-2 py-1 rounded text-xs font-semibold">
                        {getLocalizedText({ ja: "売り切れ", en: "Sold Out", zh: "售罄" })}
                      </span>
                    </div>
                  </>
                )}
              </HoverImageView>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
