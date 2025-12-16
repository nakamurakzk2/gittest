"use client"

import { ReactNode } from "react"

type Props = {
  href: string
  imageSrc: string
  imageAlt: string
  className?: string
  children?: ReactNode
  aspectRatio?: "square" | "video" | "wide" | "ultra-wide" | "custom"
  customAspectRatio?: string
}

export default function ImageLinkView({
  href,
  imageSrc,
  imageAlt,
  className = "",
  children,
  aspectRatio = "square",
  customAspectRatio
}: Props) {
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "video":
        return "aspect-video"
      case "wide":
        return "aspect-[4/3]"
      case "ultra-wide":
        return "aspect-[3/1]"
      case "custom":
        return customAspectRatio || "aspect-square"
      default:
        return "aspect-square"
    }
  }
  return (
    <a
      href={href}
      className={`block group flex-shrink-0 ${className}`}
    >
      <div className="relative overflow-hidden rounded-lg transition-shadow">
        <img
          src={imageSrc}
          alt={imageAlt}
          className={`w-full ${getAspectRatioClass()} object-contain group-hover:scale-105 transition-transform duration-300`}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0" />
        {children}
      </div>
    </a>
  )
}
