"use client"

import React from "react"
import Link from "next/link"

type Props = {
  href?: string
  label?: {
    line1?: string
    main?: string
    line2?: string
  }
  customClassName?: string
}

export default function LpFloatingButton({
  href = "#section-purchase",
  label = {
    line1: "商品の",
    main: "購入",
    line2: "はコチラ",
  },
  customClassName = "",
}: Props) {
  return (
    <Link className={`purchase-fab ${customClassName}`} href={href} aria-label="購入フォームへ移動">
      <span className="purchase-fab__label">
        <span className="purchase-fab__line">{label.line1}</span>
        <span className="purchase-fab__main">{label.main}</span>
        <span className="purchase-fab__line">{label.line2}</span>
      </span>
    </Link>
  )
}

