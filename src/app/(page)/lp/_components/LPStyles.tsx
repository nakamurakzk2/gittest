"use client"

import React from "react"

type Props = {
  cssContent: string
}

export default function LpStyles({ cssContent }: Props) {
  return <style dangerouslySetInnerHTML={{ __html: cssContent }} />
}


