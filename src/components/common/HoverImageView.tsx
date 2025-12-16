"use client"

import Link from "next/link"
import { ReactNode } from "react"
import { MultiLanguageText } from "@/entity/language"
import { useLanguageSession } from "@/providers/language-provider"

type Props = {
  href: string
  imageSrc: string
  imageAlt: string
  hoverText: MultiLanguageText
  fontSize?: number
  className?: string
  children?: ReactNode
}

export default function HoverImageView({
  href,
  imageSrc,
  imageAlt,
  hoverText,
  fontSize = 16,
  className = "",
  children
}: Props) {
  const { getLocalizedText } = useLanguageSession()

  return (
    <Link href={href} className={`group relative block overflow-hidden rounded-lg ${className}`}>
      <div className="card__media relative">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover block rounded-lg"
        />
        <>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-65 transition-opacity duration-300 ease-in-out rounded-lg" />
          {hoverText && (
            <div
              className="absolute inset-0 flex items-center justify-center text-center text-white p-6 leading-relaxed whitespace-pre-line opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out pointer-events-none z-10"
              style={{ fontSize: `${fontSize}px` }}
            >
              {getLocalizedText(hoverText)}
            </div>
          )}
        </>
        {children}
      </div>
    </Link>
  )
}
