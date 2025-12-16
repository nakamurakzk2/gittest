"use client"

import { useState, useEffect, useRef } from "react"

// Providers
import { useLanguageSession } from "@/providers/language-provider"

// Entity
import { TopBanner } from "@/entity/page/top-page"

type Props = {
  topBanners: TopBanner[]
}

export default function TopBannerView({ topBanners }: Props) {
  const { getLocalizedText } = useLanguageSession()
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const slidesRef = useRef<HTMLAnchorElement[]>([])
  const dotsRef = useRef<HTMLButtonElement[]>([])

  const isActive = (startTime: number | null, endTime: number | null) => {
    const now = Date.now()
    if (startTime && startTime > now) return false
    if (endTime && endTime < now) return false
    return true
  }

  const activeTopBanners = topBanners.filter(banner => isActive(banner.startTime, banner.endTime))

  // カルーセルの自動スクロール
  useEffect(() => {
    if (activeTopBanners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % activeTopBanners.length)
    }, 5000) // 5秒間隔

    return () => clearInterval(interval)
  }, [activeTopBanners.length])

  // アクティブ状態の更新
  useEffect(() => {
    const slides = slidesRef.current
    const dots = dotsRef.current

    const updateActiveStates = (newIndex: number) => {
      slides.forEach((slide, index) => {
        if (slide) {
          slide.classList.toggle("is-active", index === newIndex)
          slide.setAttribute("aria-hidden", index === newIndex ? "false" : "true")
          // インラインスタイルを更新
          slide.style.opacity = index === newIndex ? "1" : "0"
          slide.style.zIndex = index === newIndex ? "1" : "0"
        }
      })

      dots.forEach((dot, index) => {
        if (dot) {
          dot.classList.toggle("is-active", index === newIndex)
          dot.setAttribute("aria-selected", index === newIndex ? "true" : "false")
          dot.setAttribute("tabindex", index === newIndex ? "0" : "-1")
        }
      })
    }

    updateActiveStates(currentBannerIndex)
  }, [currentBannerIndex])

  const goToBanner = (index: number) => {
    setCurrentBannerIndex(index)
  }

  const goToPrevious = () => {
    setCurrentBannerIndex((prev) =>
      prev === 0 ? activeTopBanners.length - 1 : prev - 1
    )
  }

  const goToNext = () => {
    setCurrentBannerIndex((prev) =>
      prev === activeTopBanners.length - 1 ? 0 : prev + 1
    )
  }

  if (activeTopBanners.length === 0) {
    return null
  }

  return (
    <section className="mx-auto max-w-6xl">
      <div className="relative overflow-hidden">
        <div className="relative aspect-[2/1]">
          {activeTopBanners.map((banner, index) => (
            <a
              key={banner.bannerId}
              href={banner.link}
              ref={(el) => {
                if (el) slidesRef.current[index] = el
              }}
              className={`carousel-slide block w-full ${index === 0 ? 'is-active' : ''}`}
              aria-hidden={index !== currentBannerIndex}
              style={{
                position: 'absolute',
                inset: '0',
                margin: '0',
                opacity: index === 0 ? '1' : '0',
                transition: 'opacity 1s ease',
                zIndex: index === 0 ? '1' : '0'
              }}
            >
              <div className="relative overflow-hidden aspect-[2/1]">
                <img
                  src={banner.image}
                  alt={getLocalizedText(banner.title)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 md:left-[20%] p-6 md:p-8">
                  <h3 className="text-black font-bold text-2xl md:text-3xl lg:text-5xl">
                    {getLocalizedText(banner.title)}
                  </h3>
                  <p className="text-black/80 text-md md:text-lg lg:text-xl mt-2">
                    {getLocalizedText(banner.description)}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* カルーセルナビゲーション */}
        {activeTopBanners.length > 1 && (
          <>
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
              onClick={goToPrevious}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
              onClick={goToNext}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* インジケーター */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {activeTopBanners.map((_, index) => (
                <button
                  key={index}
                  ref={(el) => {
                    if (el) dotsRef.current[index] = el
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentBannerIndex
                      ? 'bg-white'
                      : 'bg-white/50 hover:bg-white/80'
                  }`}
                  onClick={() => goToBanner(index)}
                  aria-selected={index === currentBannerIndex}
                  tabIndex={index === currentBannerIndex ? 0 : -1}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .carousel-slide {
          position: absolute;
          inset: 0;
          margin: 0;
          opacity: 0;
          transition: opacity 1s ease;
          z-index: 0;
        }

        .carousel-slide.is-active {
          opacity: 1;
          z-index: 1;
        }
      `}</style>
    </section>
  )
}
