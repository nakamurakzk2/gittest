"use client"

import React from "react"
import { useLpInteractions } from "@/app/(page)/lp/_hooks/useLpInteractions"

type Props = {
  htmlContent: string
}

export default function LpContentView({ htmlContent }: Props) {
  useLpInteractions()

  return (
    <main
      id="top"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}

