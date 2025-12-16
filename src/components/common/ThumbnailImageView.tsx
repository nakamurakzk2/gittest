"use client"

import { ReactNode, CSSProperties } from "react"

type Props = {
  imageSrc: string
  imageAlt: string
  isSelected?: boolean
  onClick?: () => void
  className?: string
  style?: CSSProperties
  children?: ReactNode
  grayscale?: boolean
}

export default function ThumbnailImageView({
  imageSrc,
  imageAlt,
  isSelected = false,
  onClick,
  className = "",
  style,
  children,
  grayscale = false
}: Props) {
  return (
    <button
      onClick={onClick}
      style={style}
      className={`aspect-square rounded overflow-hidden border-2 transition-all duration-200 group ${className} ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-200'
          : 'border-transparent hover:border-gray-300'
      }`}
    >
      <div className="relative w-full h-full overflow-hidden">
        <img
          src={imageSrc}
          alt={imageAlt}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${grayscale ? 'grayscale opacity-75' : ''}`}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
        {children}
      </div>
    </button>
  )
}
